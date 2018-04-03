import psycopg2
import os
import json
from flask import Flask, request, Response
from flask_cors import CORS

SUBJECT_FIELDS = ('id', 'subject', 'provider', 'image', 'course-ids', 'job-ids')
# need to add provider to gitbook
COURSE_FIELDS = ('id', 'course', 'desc', 'image', 'instructor', 'link', 'price', 'provider', 'job-ids', 'subject-id')
JOB_FIELDS = ('id', 'name', 'company', 'desc', 'image', 'link', 'provider', 'course-ids', 'subject-ids', 'location', 'jobtype')

FIELDS = (SUBJECT_FIELDS,COURSE_FIELDS,JOB_FIELDS)

SUBJECT_FILTERS = {}
COURSE_FILTERS = {'provider': 'exact',
                  'price': 'range',
                  'relevant-jobs': 'range'
                  }
JOB_FILTERS = {}

FILTERS = (SUBJECT_FILTERS,COURSE_FILTERS,JOB_FILTERS)
TABLES = ('Subject','Course','Job')

app = Flask(__name__)
CORS(app)

best_cache = {}

conn = psycopg2.connect('host=learning2earn.c9dnk6wbtbst.us-east-2.rds.amazonaws.com user=postgres dbname=learning2earn password=cs373spring2018')

def clean_data(type_,sub):
    """
    some bad data - we can parse in backend

    type_ -- the type according to the FIELDS tuple
    sub -- dictionary of attributes to be returned from api query

    returns updated sub
    """
    # increase resolution of courses/subject
    if (type_ == 1 or type_==0) and sub['provider']=='Udemy':
        sub['image'] = sub['image'].replace('125_H','480x270')
    # authentic jobs images broken
    if type_ == 2 and sub['provider']=='Authentic Jobs':
        sub['image'] = sub['image'].replace('https://authenticjobs.s3.amazonaws.com','')
        if 'company-blank.png' in sub['image']:
            sub['image'] = 'https://i.vimeocdn.com/portrait/3831018_300x300' # set a real default
    # default github jobs when no image
    elif type_ == 2 and sub['provider']=='Github Jobs':
        if sub['image']=='null' or sub['image'] is None:
            sub['image'] = 'https://pbs.twimg.com/profile_images/625760778554093568/dM7xD4SQ_400x400.png'
    if type_==2 and sub['provider']=='Authentic Jobs':
        sub['name']=sub['name'][:sub['name'].rindex("_")]
    return sub

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
        sub = clean_data(type_,sub)
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

def filter_query(args,type_):
    filters = FILTERS[type_]
    table = TABLES[type_]
    query = ''

    for param in filters:
        if param in args:
            query += ' and'
            column = table + '.' + param

            if filters[param] == 'exact':
                query += ' (' + column + ' = ' + "'" + args[param] + "'" + ')'
            elif filters[param] == 'range':
                range_ = args[param].split('..')
                if len(range_) != 2:
                    raise ValueError(param + '_invalid_range')
                else:
                    try:
                        min_ = int(range_[0])
                        max_ = int(range_[1])
                        if min_>max_:
                            raise ValueError(param + '_invalid_range')
                    except ValueError:
                        raise ValueError(param + '_range_not_integers')
                query += ' ( CASE WHEN ' + column + " = 'Free' THEN 0 BETWEEN " + range_[0] + ' AND ' + range_[1] +''\
                'ELSE CAST( (COALESCE(' + 'SUBSTR(' + column + ',2),' + "'0'" + ')) AS decimal(10,2))'\
                            ' BETWEEN ' + range_[0] + ' AND ' + range_[1] + ' END)'

    return query



@app.route('/anime')
def anime():
    resp = Response('{"anime":1}')
    resp.headers['Content-Type'] = 'application/json'
    return resp
    
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
            res = execute('SELECT * FROM Subject WHERE Subject.id = %s ORDER BY id ' + limitQuery, (subjectId))
            resp.data = process_results(res,0)
            return resp
        except ValueError:
            return '{"error": "subject_id_not_integer"}'
    elif 'courseId' in request.args:
        try:
            courseId = int(request.args['courseId'])
            res = execute('SELECT Subject.id, Subject.subject, Subject.provider, Subject.image, Subject.courses, \
                Subject.jobs FROM Subject JOIN Course ON subject_id = Subject.id WHERE Course.id = %s ORDER BY Subject.id ' + limitQuery, (courseId))
            resp.data = process_results(res,0)
            return resp
        except ValueError:
            return '{"error": "course_id_not_integer"}'
    elif 'jobId' in request.args:
        try:
            jobId = int(request.args['jobId'])
            res = execute('SELECT Subject.id, Subject.subject, Subject.provider, Subject.image, Subject.courses, \
                Subject.jobs FROM Subject JOIN Subject_Job ON Subject.id = Subject_Job.subject_id WHERE job_id = %s ORDER BY id ' + limitQuery, (jobId))
            resp.data = process_results(res,0)
            return resp
        except ValueError:
            return '{"error": "job_id_not_integer"}'
    else:
        res = execute('SELECT * FROM Subject ORDER BY id ' + limitQuery)
        resp.data = process_results(res,0)
        return resp

@app.route('/courses')
def courses():
    res = None
    resp = Response()
    resp.headers['Content-Type'] = 'application/json'
    limit, limitQuery = 0, ''
    # check filters
    try:
        where_clause = filter_query(request.args,1)
    except Exception as e:
        resp.data = '{"error": "' + str(e) + '"}'
        return resp
    print(where_clause)
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
            courseId = int(request.args['courseId'])
            res = execute('SELECT * FROM Course WHERE (Course.id = %s)' + where_clause + ' ORDER BY id ' + limitQuery, (courseId))
            resp.data = process_results(res,1)
            return resp
        except ValueError:
            return '{"error": "course_id_not_integer"}'
    elif 'subjectId' in request.args:
        try:
            subjectId = int(request.args['subjectId'])
            res = execute('SELECT * FROM Course WHERE (Course.subject_id = %s)' + where_clause + ' ORDER BY id ' + limitQuery, (subjectId))
            resp.data = process_results(res,1)
            return resp
        except ValueError:
            return '{"error": "subject_id_not_integer"}'
    elif 'jobId' in request.args:
        try:
            jobId = int(request.args['jobId'])
            res = execute('SELECT Course.id, Course.course, Course.description, Course.image, \
                Course.instructor, Course.link, Course.price, Course.provider, \
                Course.jobs, Course.subject_id FROM Course JOIN Course_Job ON Course.id = Course_Job.course_id WHERE (Course_Job.job_id = %s)' + where_clause + ' ORDER BY id ' + limitQuery, (jobId))
            resp.data = process_results(res,1)
            return resp
        except ValueError:
            return '{"error": "job_id_not_integer"}'
    else:
        if len(where_clause)>4:
            where_clause = where_clause[4:]
            res = execute('SELECT * FROM Course WHERE ' + where_clause + ' ORDER BY id ' + limitQuery)
        else:
            res = execute('SELECT * FROM Course ORDER BY id ' + limitQuery)
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
            res = execute('SELECT * FROM Job WHERE Job.id = %s ORDER BY id ' + limitQuery, (jobId))
            resp.data = process_results(res,2)
            return resp
        except ValueError:
            return '{"error": "job_id_not_integer"}'
    elif 'subjectId' in request.args:
        try:
            subjectId = int(request.args['subjectId'])
            res = execute('SELECT Job.id, Job.name, Job.company, Job.description, Job.image, Job.link, Job.provider, Job.courses, Job.subjects_ids \
                FROM Job JOIN Subject_Job ON Subject_Job.job_id = Job.id WHERE subject_id = %s ORDER BY id ' + limitQuery, (subjectId))
            resp.data = process_results(res,2)
            return resp
        except ValueError:
            return '{"error": "subject_id_not_integer"}'
    elif 'courseId' in request.args:
        try:
            courseId = int(request.args['courseId'])
            res = execute('SELECT Job.id, Job.name, Job.company, Job.description, Job.image, Job.link, Job.provider, Job.courses, Job.subjects_ids, Job.location, Job.jobtype \
                FROM Job JOIN Course_Job ON Course_Job.job_id = Job.id WHERE course_id = %s ORDER BY id ' + limitQuery, (courseId))
            resp.data = process_results(res,2)
            return resp
        except ValueError:
            return '{"error": "course_id_not_integer"}'
    else:
        res = execute('SELECT * FROM Job ORDER BY id ' + limitQuery)
        resp.data = process_results(res,2)
        return resp

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)
