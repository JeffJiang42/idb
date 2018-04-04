import psycopg2
import os
import json
from flask import Flask, request, Response
from flask_cors import CORS

COURSE_SEARCH = 'SELECT * FROM Course WHERE description LIKE %s OR course LIKE %s OR provider LIKE %s'
SUBJECT_SEARCH = 'SELECT * FROM Subject WHERE subject LIKE %s OR provider LIKE %s'
JOB_SEARCH = 'SELECT * FROM Job WHERE name LIKE %s OR company LIKE %s OR description LIKE %s OR provider LIKE %s OR location LIKE %s OR jobtype LIKE %s'

SUBJECT_FIELDS = ('id', 'subject', 'provider', 'image', 'course-ids', 'job-ids','num-courses')
# need to add provider to gitbook
COURSE_FIELDS = ('id', 'course', 'desc', 'image', 'instructor', 'link', 'price', 'provider', 'job-ids', 'subject-id','num-relevant-jobs')
JOB_FIELDS = ('id', 'name', 'company', 'desc', 'image', 'link', 'provider', 'course-ids', 'subject-ids', 'location', 'jobtype','num-related-courses')

FIELDS = (SUBJECT_FIELDS,COURSE_FIELDS,JOB_FIELDS)

SUBJECT_FILTERS = {'num-courses': 'range',
                   'provider': 'exact',
                   'sort_by': 'exact',
                   'desc': 'exact'
                  }
COURSE_FILTERS = {'provider': 'exact',
                  'num-relevant-jobs': 'range',
                  'price': 'range',
                  'sort_by': 'exact',
                  'desc': 'exact'
                  }
JOB_FILTERS = {'company': 'exact',
               'num-related-courses': 'range',
               'location': 'exact',
               'course': 'exact',
               'provider': 'exact',
               'jobtype': 'exact',
               'sort_by': 'exact',
               'desc': 'exact'  
              }

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
            if k == 'price':
                sub[k] = float(sub[k])
            if k == 'course-ids' or k == 'job-ids' or k == 'subject-ids':
                if v and not v == 'None' :
                    sub[k] = [int(x) for x in v.split(',')]
                else:
                    sub[k] = []
        sub = clean_data(type_,sub)
        results.append(sub)
    return json.dumps(results)

def execute(statement, *formatted):
    print(statement)
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

    for param in args:
        if 'Id' in param or 'limit' in param or 'sort_by' in param or 'desc' in param:
            continue
        if param not in filters:
            raise ValueError(param +'_invalid_filter')
        if param in filters:
            query += ' and ('
            values = args.getlist(param)
            first = True
            filter_type = filters[param]
            param = param.replace('-','_')
            for value in values:
                column = table + '.' + param
                if first:
                    first = False
                else:
                    query += ' or'
                if filter_type == 'exact':
                    query += ' (' + column + ' = ' + "'" + value + "'" + ')'
                elif filter_type == 'range':
                    range_ = value.split('..')
                    if len(range_) != 2:
                        raise ValueError(param + '_invalid_range')
                    else:
                        try:
                            if range_[0]=='':
                                min_ = 0
                            else:
                                min_ = int(range_[0])
                            if range_[1]=='':
                                max_ = 2000
                            else:
                                max_ = int(range_[1])
                            if min_>max_:
                                raise ValueError(param + '_invalid_range')
                        except ValueError:
                            raise ValueError(param + '_range_not_integers')
                    
                    query += ' (' + column + ' BETWEEN ' + str(min_) + ' AND ' + str(max_) + ')'
            query += ')'
    return query

def sort_by(args, type_):
    ret = 'id'
    if 'sort_by' in args:
        sort_val = args['sort_by']
        if type_ == 0:
            if sort_val not in SUBJECT_FIELDS:
                return ret
        elif type_ == 1:
            if sort_val not in COURSE_FIELDS:
                return ret
        elif type_ == 2:
            if sort_val not in JOB_FIELDS:
                return ret
        sort_val = sort_val.replace('-','_')
        ret = sort_val
    if 'desc' in args:
        if args['desc'].upper() == 'TRUE':
            ret += ' DESC NULLS LAST'
    else:
        ret += ' NULLS FIRST'

    return ret

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
    # check filters
    try:
        where_clause = filter_query(request.args,0)
    except Exception as e:
        resp.data = '{"error": "' + str(e) + '"}'
        return resp

    sort_ = sort_by(request.args, 0)

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
            res = execute('SELECT * FROM Subject WHERE (Subject.id = %s)' + where_clause + ' ORDER BY' + limitQuery, (subjectId))
            resp.data = process_results(res,0)
            return resp
        except ValueError:
            return '{"error": "subject_id_not_integer"}'
    elif 'courseId' in request.args:
        try:
            courseId = int(request.args['courseId'])
            res = execute('SELECT * FROM Subject JOIN Course ON subject_id = Subject.id WHERE (Course.id = %s)' + where_clause + ' ORDER BY ' + sort_ + limitQuery, (courseId))
            resp.data = process_results(res,0)
            return resp
        except ValueError:
            return '{"error": "course_id_not_integer"}'
    elif 'jobId' in request.args:
        try:
            jobId = int(request.args['jobId'])
            res = execute('SELECT * FROM Subject JOIN Subject_Job ON Subject.id = Subject_Job.subject_id WHERE (job_id = %s)' + where_clause + ' ORDER BY ' + sort_ + limitQuery, (jobId))
            resp.data = process_results(res,0)
            return resp
        except ValueError:
            return '{"error": "job_id_not_integer"}'
    else:
        if len(where_clause)>4:
            where_clause = where_clause[4:]
            res = execute('SELECT * FROM Subject WHERE' + where_clause + ' ORDER BY ' + sort_ + limitQuery)
        else:
            res = execute('SELECT * FROM Subject ORDER BY ' + sort_ + limitQuery)
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

    sort_ = sort_by(request.args, 1)

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
            res = execute('SELECT * FROM Course WHERE (Course.id = %s)' + where_clause + ' ORDER BY ' + sort_ + limitQuery, (courseId))
            resp.data = process_results(res,1)
            return resp
        except ValueError:
            return '{"error": "course_id_not_integer"}'
    elif 'subjectId' in request.args:
        try:
            subjectId = int(request.args['subjectId'])
            res = execute('SELECT * FROM Course WHERE (Course.subject_id = %s)' + where_clause + ' ORDER BY ' + sort_ + limitQuery, (subjectId))
            resp.data = process_results(res,1)
            return resp
        except ValueError:
            return '{"error": "subject_id_not_integer"}'
    elif 'jobId' in request.args:
        try:
            jobId = int(request.args['jobId'])
            res = execute('SELECT * FROM Course JOIN Course_Job ON Course.id = Course_Job.course_id WHERE (Course_Job.job_id = %s)' + where_clause + ' ORDER BY ' + sort_ + limitQuery, (jobId))
            resp.data = process_results(res,1)
            return resp
        except ValueError:
            return '{"error": "job_id_not_integer"}'
    else:
        if len(where_clause)>4:
            where_clause = where_clause[4:]
            res = execute('SELECT * FROM Course WHERE' + where_clause + ' ORDER BY ' + sort_ + limitQuery)
        else:
            res = execute('SELECT * FROM Course ORDER BY ' + sort_ + limitQuery)
        resp.data = process_results(res,1)
        return resp

@app.route('/jobs')
def jobs():
    res = None
    resp = Response()
    resp.headers['Content-Type'] = 'application/json'
    limit, limitQuery = 0, ''
    # check filters
    try:
        where_clause = filter_query(request.args,2)
    except Exception as e:
        resp.data = '{"error": "' + str(e) + '"}'
        return resp

    sort_ = sort_by(request.args, 2)

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
            res = execute('SELECT * FROM Job WHERE (Job.id = %s)' + where_clause + ' ORDER BY ' + sort_ + limitQuery, (jobId))
            resp.data = process_results(res,2)
            return resp
        except ValueError:
            return '{"error": "job_id_not_integer"}'
    elif 'subjectId' in request.args:
        try:
            subjectId = int(request.args['subjectId'])
            res = execute('SELECT *\
                FROM Job JOIN Subject_Job ON Subject_Job.job_id = Job.id WHERE (subject_id = %s) ' + where_clause + ' ORDER BY ' + sort_ + limitQuery, (subjectId))
            resp.data = process_results(res,2)
            return resp
        except ValueError:
            return '{"error": "subject_id_not_integer"}'
    elif 'courseId' in request.args:
        try:
            courseId = int(request.args['courseId'])
            res = execute('SELECT *\
                FROM Job JOIN Course_Job ON Course_Job.job_id = Job.id (WHERE course_id = %s) ' + where_clause + ' ORDER BY ' + sort_ + limitQuery, (courseId))
            resp.data = process_results(res,2)
            return resp
        except ValueError:
            return '{"error": "course_id_not_integer"}'
    else:
        if len(where_clause)>4:
            where_clause = where_clause[4:]
            res = execute('SELECT * FROM Job WHERE' + where_clause + ' ORDER BY ' + sort_ + limitQuery)
        else:
            res = execute('SELECT * FROM Job ORDER BY ' + sort_ + limitQuery)
        resp.data = process_results(res,2)
        return resp

def search(phrase):
    phrase = '%' + phrase + '%'
    course_data = execute(COURSE_SEARCH, phrase, phrase, phrase)
    subject_data = execute(SUBJECT_SEARCH, phrase, phrase)
    job_data = execute(JOB_SEARCH, phrase, phrase, phrase, phrase, phrase, phrase)
    course_processed = process_results(course_data,1)
    subject_processed = process_results(subject_data,0)
    job_processed = process_results(job_data,2)
    return '{"courses":' + course_processed + ',"subjects":' + subject_processed + ',"jobs":' + job_processed + '}'
    
@app.route('/search')
def queue():
    resp = Response()
    resp.headers['Content-Type'] = 'application/json'
    if 'q' in request.args:
        phrase = request.args['q']
        resp.data = search(phrase)
    else:
        resp.data = '{"error":"no_search_params"}'
    return resp
    
if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)