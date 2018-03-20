import psycopg2
import os
import json
from flask import Flask, request, Response

SUBJECT_FIELDS = ('id', 'subject', 'provider', 'image', 'course-ids', 'job-ids')

app = Flask(__name__)

best_cache = {}

conn = psycopg2.connect('host=learning2earn.c9dnk6wbtbst.us-east-2.rds.amazonaws.com user=postgres dbname=learning2earn password=cs373spring2018')

def process_subjects(pg_result):
    results = []
    for res in pg_result:
        sub = {}
        for k, v in zip(SUBJECT_FIELDS, res):
            sub[k] = v
            if k == 'course-ids' or k == 'job-ids':
                if v:
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
            resp.data = process_subjects(res)
            return resp
        except ValueError:
            return '{"error": "subject_id_not_integer"}'
    elif 'courseId' in request.args:
        try:
            courseId = int(request.args['courseId'])
            res = execute('SELECT Subject.id, Subject.subject, Subject.provider, Subject.image, Subject.courses, Subject.jobs FROM Subject JOIN Course ON subject_id = Subject.id WHERE Course.id = %s ' + limitQuery, (courseId))
            resp.data = process_subjects(res)
            return resp
        except ValueError:
            return '{"error": "course_id_not_integer"}'
    elif 'jobId' in request.args:
        try:
            jobId = int(request.args['jobId'])
            res = execute('SELECT Subject.id, Subject.subject, Subject.provider, Subject.image, Subject.courses, Subject.jobs FROM Subject JOIN Subject_Job ON Subject.id = Subject_Job.subject_id WHERE job_id = %s ' + limitQuery, (jobId))
            resp.data = process_subjects(res)
            return resp
        except ValueError:
            return '{"error": "job_id_not_integer"}'
    else:
        res = execute('SELECT * FROM Subject ' + limitQuery)
        resp.data = process_subjects(res)
        return resp

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)
