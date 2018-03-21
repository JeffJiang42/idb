import psycopg2
import os
import json
from flask import Flask, request, Response

SUBJECT_FIELDS = ('id', 'subject', 'provider', 'image', 'course-ids', 'job-ids')
# need to add provider to gitbook
COURSE_FIELDS = ('id', 'course', 'desription', 'image', 'instructor', 'link', 'price', 'subject', 'provider', 'job-ids', 'subject-id')
JOB_FIELDS = ('id', 'name', 'company', 'description', 'image', 'link', 'provider', 'courses', 'subject_ids')

FIELDS = (SUBJECT_FIELDS,COURSE_FIELDS,JOB_FIELDS)

app = Flask(__name__)

best_cache = {}

conn = psycopg2.connect('host=learning2earn.c9dnk6wbtbst.us-east-2.rds.amazonaws.com user=postgres dbname=learning2earn password=cs373spring2018')

def process_results(pg_result,type_):
    """
    process the results according to the type

    pg_result -- the result of an execution from pg
    type_ -- the type according to the FIELDS tuple

    returns a serialized JSON string baby
    """
    results = []
    type_fields = FIELDS[type_] 
    for res in pg_result:
        sub = {}
        for k, v in zip(type_fields, res):
            sub[k] = v
            if k == 'course-ids' or k == 'job-ids' or k == 'subject-ids':
                if v and not v == 'None' :
                    sub[k] = [int(x) for x in v.split(',')]
                else:
                    sub[k] = []
        results.append(sub)
    return json.dumps(results)

def execute(statement, *formatted):
    global conn
    for x in range(0, 3):
        try:
            with conn.cursor() as cur:
                statement = cur.mogrify(statement, formatted)
                if statement in best_cache:
                    print('pulling from cache')
                    return best_cache[statement]
                cur.execute(statement)
                data = cur.fetchall()
                best_cache[statement] = data
                return data
        except psycopg2.OperationalError:
            print('error - reconnecting...')
            conn = psycopg2.connect('host=learning2earn.c9dnk6wbtbst.us-east-2.rds.amazonaws.com user=postgres dbname=learning2earn password=cs373spring2018')
    return [('error',)]            

@app.route('/')
def default():
    resp = Response('{"error": "pick_something"}')
    resp.headers['Content-Type'] = 'application/json'
    return resp

@app.route('/subjects')
def subjects():
    res = None
    resp = Response()
    resp.headers['Content-Type'] = 'application/json'
    limit, limitQuery = 0, ''
    # check request type
    if 'limit' in request.args:
        try:
            limit = int(request.args['limit'])
            if limit <= 0:
                resp.data = '{"error": "limit_less_than_one"}'
                return resp
            limitQuery = ' LIMIT ' + str(limit)
        except ValueError:
            resp.data = '{"error": "limit_not_integer"}'
            return resp
    if 'subjectId' in request.args:
        try:
            subjectId = int(request.args['subjectId'])
            res = execute('SELECT * FROM Subject WHERE Subject.id = %s ' + limitQuery, (subjectId))
            resp.data = process_results(res,0)
            return resp
        except ValueError:
            return '{"error": "subject_id_not_integer"}'
    elif 'courseId' in request.args:
        try:
            courseId = int(request.args['courseId'])
            res = execute('SELECT Subject.id, Subject.subject, Subject.provider, Subject.image, Subject.courses, \
                Subject.jobs FROM Subject JOIN Course ON subject_id = Subject.id WHERE Course.id = %s ' + limitQuery, (courseId))
            resp.data = process_results(res,0)
            return resp
        except ValueError:
            return '{"error": "course_id_not_integer"}'
    elif 'jobId' in request.args:
        try:
            jobId = int(request.args['jobId'])
            res = execute('SELECT Subject.id, Subject.subject, Subject.provider, Subject.image, Subject.courses, \
                Subject.jobs FROM Subject JOIN Subject_Job ON Subject.id = Subject_Job.subject_id WHERE job_id = %s ' + limitQuery, (jobId))
            resp.data = process_results(res,0)
            return resp
        except ValueError:
            return '{"error": "job_id_not_integer"}'
    else:
        res = execute('SELECT * FROM Subject ' + limitQuery)
        resp.data = process_results(res,0)
        return resp

@app.route('/courses')
def courses():
    res = None
    resp = Response()
    resp.headers['Content-Type'] = 'application/json'
    limit, limitQuery = 0, ''
    # check request type
    if 'limit' in request.args:
        try:
            limit = int(request.args['limit'])
            if limit <= 0:
                resp.data = '{"error": "limit_less_than_one"}'
                return resp
            limitQuery = ' LIMIT ' + str(limit)
        except ValueError:
            resp.data = '{"error": "limit_not_integer"}'
            return resp
    if 'courseId' in request.args:
        try:
            courseId = int(request.args['subjectId'])
            res = execute('SELECT * FROM Course WHERE Course.id = %s ' + limitQuery, (courseId))
            resp.data = process_results(res,1)
            return resp
        except ValueError:
            return '{"error": "course_id_not_integer"}'
    elif 'subjectId' in request.args:
        try:
            subjectId = int(request.args['courseId'])
            res = execute('SELECT * FROM Course WHERE Course.subject_id = %s ' + limitQuery, (subjectId))
            resp.data = process_results(res,1)
            return resp
        except ValueError:
            return '{"error": "subject_id_not_integer"}'
    elif 'jobId' in request.args:
        try:
            jobId = int(request.args['jobId'])
            res = execute('SELECT Course.id, Course.course, Course.description, Course.image, \
                Course.instructor, Course.link, Course.price, Course.subject, Course.provider, \
                Course.jobs, Course.subject_id FROM Course JOIN Course_Job ON Course.id = Course_Job.course_id WHERE Course.job_id = %s ' + limitQuery, (jobId))
            resp.data = process_results(res,1)
            return resp
        except ValueError:
            return '{"error": "job_id_not_integer"}'
    else:
        res = execute('SELECT * FROM Course ' + limitQuery)
        resp.data = process_results(res,1)
        return resp

@app.route('/jobs')
def jobs():
    res = None
    resp = Response()
    resp.headers['Content-Type'] = 'application/json'
    limit, limitQuery = 0, ''
    # check request type
    if 'limit' in request.args:
        try:
            limit = int(request.args['limit'])
            if limit <= 0:
                resp.data = '{"error": "limit_less_than_one"}'
                return resp
            limitQuery = ' LIMIT ' + str(limit)
        except ValueError:
            resp.data = '{"error": "limit_not_integer"}'
            return resp
    if 'jobId' in request.args:
        try:
            jobId = int(request.args['jobId'])
            res = execute('SELECT * FROM Job WHERE Job.id = %s ' + limitQuery, (jobId))
            resp.data = process_results(res,2)
            return resp
        except ValueError:
            return '{"error": "course_id_not_integer"}'
    elif 'subjectId' in request.args:
        try:
            subjectId = int(request.args['subjectId'])
            res = execute('SELECT Job.id, Job.name, Job.company, Job.description, Job.image, Job.link, Job.provider, Job.courses, Job.subjects_ids \
                FROM Job JOIN Subject_Job ON Subject_Job.job_id = Job.id WHERE subject_id = %s ' + limitQuery, (subjectId))
            resp.data = process_results(res,2)
            return resp
        except ValueError:
            return '{"error": "subject_id_not_integer"}'
    elif 'courseId' in request.args:
        try:
            courseId = int(request.args['courseId'])
            res = execute('SELECT Job.id, Job.name, Job.company, Job.description, Job.image, Job.link, Job.provider, Job.courses, Job.subjects_ids \
                FROM Job JOIN Course_Job ON Course_Job.job_id = Job.id WHERE course_id = %s ' + limitQuery, (courseId))
            resp.data = process_results(res,2)
            return resp
        except ValueError:
            return '{"error": "job_id_not_integer"}'
    else:
        res = execute('SELECT * FROM Job ' + limitQuery)
        resp.data = process_results(res,2)
        return resp
        
if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)
