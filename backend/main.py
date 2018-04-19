from helper1 import *

app = Flask(__name__)
CORS(app)

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
        where_clause,where_data = filter_query(request.args,0)
    except Exception as e:
        resp.data = '{"error": "' + str(e) + '"}'
        return resp
    try:
        sort_ = sort_by(request.args, 0)
    except Exception as e:
        resp.data = '{"error": "' + str(e) + '"}'
        return resp

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
            res = execute('SELECT * FROM Subject WHERE (Subject.id = %s)' + where_clause + ' ORDER BY ' + sort_ + limitQuery , subjectId,*where_data)
            resp.data = process_results(res,0)
            return resp
        except ValueError:
            return '{"error": "subject_id_not_integer"}'
    elif 'courseId' in request.args:
        try:
            courseId = int(request.args['courseId'])
            res = execute('SELECT * FROM Subject JOIN Course ON subject_id = Subject.id WHERE (Course.id = %s)' + where_clause + ' ORDER BY ' + sort_ + limitQuery, courseId,*where_data)
            resp.data = process_results(res,0)
            return resp
        except ValueError:
            return '{"error": "course_id_not_integer"}'
    elif 'jobId' in request.args:
        try:
            jobId = int(request.args['jobId'])
            res = execute('SELECT * FROM Subject JOIN Subject_Job ON Subject.id = Subject_Job.subject_id WHERE (job_id = %s)' + where_clause + ' ORDER BY ' + sort_ + limitQuery, jobId,*where_data)
            resp.data = process_results(res,0)
            return resp
        except ValueError:
            return '{"error": "job_id_not_integer"}'
    else:
        if len(where_data)>0:
            where_clause = where_clause[4:]
            res = execute('SELECT * FROM Subject WHERE' + where_clause + ' ORDER BY ' + sort_ + limitQuery, *where_data)
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
        where_clause,where_data = filter_query(request.args,1)
    except Exception as e:
        resp.data = '{"error": "' + str(e) + '"}'
        return resp

    try:
        sort_ = sort_by(request.args, 1)
    except Exception as e:
        resp.data = '{"error": "' + str(e) + '"}'
        return resp

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
            res = execute('SELECT * FROM Course WHERE (Course.id = %s)' + where_clause + ' ORDER BY ' + sort_ + limitQuery, courseId,*where_data)
            resp.data = process_results(res,1)
            return resp
        except ValueError:
            return '{"error": "course_id_not_integer"}'
    elif 'subjectId' in request.args:
        try:
            subjectId = int(request.args['subjectId'])
            res = execute('SELECT * FROM Course WHERE (Course.subject_id = %s)' + where_clause + ' ORDER BY ' + sort_ + limitQuery, subjectId,*where_data)
            resp.data = process_results(res,1)
            return resp
        except ValueError:
            return '{"error": "subject_id_not_integer"}'
    elif 'jobId' in request.args:
        try:
            jobId = int(request.args['jobId'])
            res = execute('SELECT * FROM Course JOIN Course_Job ON Course.id = Course_Job.course_id WHERE (Course_Job.job_id = %s)' + where_clause + ' ORDER BY ' + sort_ + limitQuery, jobId,*where_data)
            resp.data = process_results(res,1)
            return resp
        except ValueError:
            return '{"error": "job_id_not_integer"}'
    else:
        if len(where_data)>0:
            where_clause = where_clause[4:]
            res = execute('SELECT * FROM Course WHERE' + where_clause + ' ORDER BY ' + sort_ + limitQuery, *where_data)
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
        where_clause,where_data = filter_query(request.args,2)
    except Exception as e:
        resp.data = '{"error": "' + str(e) + '"}'
        return resp

    try:
        sort_ = sort_by(request.args, 2)
    except Exception as e:
        resp.data = '{"error": "' + str(e) + '"}'
        return resp

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
            res = execute('SELECT * FROM Job WHERE (Job.id = %s)' + where_clause + ' ORDER BY ' + sort_ + limitQuery, jobId,*where_data)
            resp.data = process_results(res,2)
            return resp
        except ValueError:
            return '{"error": "job_id_not_integer"}'
    elif 'subjectId' in request.args:
        try:
            subjectId = int(request.args['subjectId'])
            res = execute('SELECT *\
                FROM Job JOIN Subject_Job ON Subject_Job.job_id = Job.id WHERE (subject_id = %s) ' + where_clause + ' ORDER BY ' + sort_ + limitQuery, subjectId,*where_data)
            resp.data = process_results(res,2)
            return resp
        except ValueError:
            return '{"error": "subject_id_not_integer"}'
    elif 'courseId' in request.args:
        try:
            courseId = int(request.args['courseId'])
            res = execute('SELECT *\
                FROM Job JOIN Course_Job ON Course_Job.job_id = Job.id WHERE (course_id = %s) ' + where_clause + ' ORDER BY ' + sort_ + limitQuery, courseId,*where_data)
            resp.data = process_results(res,2)
            return resp
        except ValueError:
            return '{"error": "course_id_not_integer"}'
    else:
        if len(where_data)>0:
            where_clause = where_clause[4:]
            res = execute('SELECT * FROM Job WHERE' + where_clause + ' ORDER BY ' + sort_ + limitQuery,*where_data)
        else:
            res = execute('SELECT * FROM Job ORDER BY ' + sort_ + limitQuery)
        resp.data = process_results(res,2)
        return resp

@app.route('/search')
def queue():
    resp = Response()
    resp.headers['Content-Type'] = 'application/json'
    if 'q' in request.args and request.args['q']:
        phrase = request.args['q']
        resp.data = search(phrase)
    else:
        resp.data = '{"error":"no_search_params"}'
    return resp

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)