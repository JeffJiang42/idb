import psycopg2
import os
import json
from flask import Flask, request, Response
from flask_cors import CORS
import re
from werkzeug.datastructures import ImmutableMultiDict

# search queries
SUBJECT_SEARCH = 'SELECT * FROM Subject WHERE subject ILIKE %s OR provider ILIKE %s'
COURSE_SEARCH = 'SELECT * FROM Course WHERE description ILIKE %s OR course ILIKE %s OR provider ILIKE %s'
JOB_SEARCH = 'SELECT * FROM Job WHERE name ILIKE %s OR company ILIKE %s OR description ILIKE %s OR provider ILIKE %s OR location ILIKE %s OR jobtype ILIKE %s'

# api model fields
SUBJECT_FIELDS = ('id', 'subject', 'provider', 'image', 'course-ids', 'job-ids','num-courses')
COURSE_FIELDS = ('id', 'course', 'desc', 'image', 'instructor', 'link', 'price', 'provider', 'job-ids', 'subject-id','num-relevant-jobs')
JOB_FIELDS = ('id', 'name', 'company', 'desc', 'image', 'link', 'provider', 'course-ids', 'subject-ids', 'location', 'jobtype','num-related-courses')
FIELDS = (SUBJECT_FIELDS,COURSE_FIELDS,JOB_FIELDS)

# possible model filters
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
               'provider': 'exact',
               'jobtype': 'exact',
               'sort_by': 'exact',
               'desc': 'exact'  
              }
FILTERS = (SUBJECT_FILTERS,COURSE_FILTERS,JOB_FILTERS)

# Model names
TABLES = ('Subject','Course','Job')

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

    returns a serialized JSON string
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
    global conn
    for x in range(0, 3):
        try:
            with conn.cursor() as cur:
                statement = cur.mogrify(statement, formatted)
                # print(statement)
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

def filter_logic(query,parts,filter_type,column,value):
    """
    update WHERE clause based on passed in filter_type and value

    query -- current built WHERE clause
    parts -- value array that corresponds to formatters in query
    filter_type -- type of filter passed in (exact/range)
    column -- table column
    value -- value passed in to parameter

    returns updated WHERE clause with added value
    """
    if filter_type == 'exact':
        query += ' (UPPER(' + column + ') = %s)'
        parts.append(value.upper())
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
        query += ' (' + column + ' BETWEEN %s AND %s)'
        parts.extend([min_,max_])
    # print(query)
    print(parts)
    print(query)
    return query

def filter_query(args,type_):
    """
    generate WHERE clause to be added to SQL query

    args -- request args passed in by API call
    type_ -- the type according to the FIELDS tuple

    returns WHERE clause if valid parameters
    """
    filters = FILTERS[type_]
    table = TABLES[type_]
    query = ''
    parts = []
    # print(query)
    for param in args:
        # already handled
        if 'Id' in param or 'limit' in param or 'sort_by' in param or 'desc' in param:
            continue
        # invalid
        if param not in filters:
            raise ValueError(param +'_invalid_filter')
        if param in filters:
            # type in dict
            filter_type = filters[param]
            # intersection
            query += ' and ('
            values = args.getlist(param)
            # db format
            param = param.replace('-','_')
            first = True
            for value in values:
                #value = value
                column = table + '.' + param
                # union of same column values
                if first:
                    first = False
                else:
                    query += ' or'
                # update query
                query = filter_logic(query,parts,filter_type,column,value)
            # end of parameter
            query += ')'
    return query,parts


def sort_by(args, type_):
    # default sort is by id
    ret = TABLES[type_] + '.id'
    fields = FIELDS[type_]
    if 'sort_by' in args:
        sort_val = args.getlist('sort_by')
        if len(sort_val)>1:
            raise ValueError("too_many_sorts")
        sort_val = sort_val[0]
        #throws an error if attempting to sort by an invalid field
        if sort_val not in fields:
            raise ValueError(sort_val + "_invalid_parameter")
        sort_val = sort_val.replace('-','_')
        ret = sort_val
    # default SQL sort is ascending, so only need to add if descending
    if 'desc' in args:
        if args['desc'].upper() == 'TRUE':
            # add NULLS LAST/FIRST so that NULL values are treated as zeroes 
            # instead of infinity when sorting
            ret += ' DESC NULLS LAST'
    else:
        ret += ' NULLS FIRST'

    return ret


def search(phrase):
    phrase = '%' + phrase + '%'
    course_data = execute(COURSE_SEARCH, phrase, phrase, phrase)
    subject_data = execute(SUBJECT_SEARCH, phrase, phrase)
    job_data = execute(JOB_SEARCH, phrase, phrase, phrase, phrase, phrase, phrase)
    course_processed = process_results(course_data,1)
    subject_processed = process_results(subject_data,0)
    job_processed = process_results(job_data,2)
    return '{"courses":' + course_processed + ',"subjects":' + subject_processed + ',"jobs":' + job_processed + '}'

