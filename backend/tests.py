import unittest
import json
import re
import main
from werkzeug.datastructures import ImmutableMultiDict
from helper import *

class APIAuxFunctionTest(unittest.TestCase):
    
    # Tests if things are processed correctly
    def test_process1(self):
        test_phrase = [(1, 'x', 'x', 'x', '1, 2, 3, 4', '1, 2, 3, 4')]
        serialized_json = main.process_results(test_phrase, 0)
        res = json.loads(serialized_json)
        self.assertTrue(len(res) == 1)
        self.assertTrue('job-ids' in res[0])
        self.assertTrue(len(res[0]['job-ids']) == 4)
    
    # corner case if no related courses, or just one
    def test_process2(self):
        test_phrase = [(1, 'x', 'x', 'x', None, '1')]
        serialized_json = main.process_results(test_phrase, 0)
        res = json.loads(serialized_json)
        self.assertTrue(len(res) == 1)
        self.assertTrue('job-ids' in res[0])
        self.assertTrue(len(res[0]['job-ids']) == 1)
        self.assertTrue(len(res[0]['course-ids']) == 0)
    
    # check cache
    def test_execute(self):
        test_phrase = b'SELECT * FROM Course LIMIT 5'
        res = main.execute(test_phrase)

        # print(main.best_cache)
        self.assertFalse(len(res) == 1 and res[0][0] == 'error')
        self.assertTrue(test_phrase in main.best_cache)
        self.assertTrue(main.best_cache[test_phrase] == res)

    # check desired results of image cleanup
    def test_image1(self):
        sub = {'name': 'x', 'image': 'https://udemy-images.udemy.com/course/125_H/364426_2991_5.jpg',
               'provider': 'Udemy'}
        type_ = 1
        type_2 = 0

        res = main.clean_data(type_,sub)
        self.assertTrue('125_H' not in res['image'])
        self.assertTrue(res['image'] == sub['image'].replace('125_H','480x270'))

        res2 = main.clean_data(type_2,sub)
        self.assertTrue('125_H' not in res2['image'])
        self.assertTrue(res2['image'] == sub['image'].replace('125_H','480x270'))

    # check desired results of image cleanup
    def test_image2(self):
        sub = {'name': 'x_','image': 'https://d2fcz5no062gar.cloudfront.nethttps://authenticjobs.s3.amazonaws.com/uploads/logos/lbvf6cci6jno2f4tzl2nsoip4xoam1n9/thumb/logo.png',
               'provider': 'Authentic Jobs'}
        sub_empty = {'name': 'x_','image': 'https://d2fcz5no062gar.cloudfront.net/uploads/logos/lbvf6cci6jno2f4tzl2nsoip4xoam1n9/thumb/company-blank.png',
                'provider': 'Authentic Jobs'}
        type_ = 2
        res = main.clean_data(type_,sub)
        self.assertTrue(len(res['image'].split("https://"))<=2)
        self.assertTrue(res['image'] == sub['image'].replace('https://authenticjobs.s3.amazonaws.com',''))

        res2 = main.clean_data(type_,sub_empty)
        self.assertTrue('company-blank.png' not in res2['image'])
        self.assertTrue(res2['image'] == 'https://i.vimeocdn.com/portrait/3831018_300x300')

    # check desired results of image cleanup
    def test_image3(self):
        sub = {'name': 'x', 'image': 'null',
               'provider': 'Github Jobs'}
        type_ = 2
        res = main.clean_data(type_,sub)
        self.assertTrue(res['image'] != 'null')
        self.assertTrue(res['image'] == 'https://pbs.twimg.com/profile_images/625760778554093568/dM7xD4SQ_400x400.png')

    # check desired results of parsing name
    def test_name_parse1(self):
        sub = {'name': 'lmao_390', 'image': 'x',
               'provider': 'Authentic Jobs'}
        type_ = 2
        res = main.clean_data(type_,sub)
        self.assertTrue(res['name']=='lmao')
        # multiple underscores
        sub2 = {'name': 'lmao_lmao_lmao_390', 'image': 'x',
               'provider': 'Authentic Jobs'}
        res2 = main.clean_data(type_,sub2)
        self.assertTrue(res2['name']=='lmao_lmao_lmao')


    # check desired results of sorting
    # valid param ascending
    def test_sort_by1(self):

        args = ImmutableMultiDict([('sort_by', 'provider')])
        type_ = 0
        sort_str = main.sort_by(args, type_)
        self.assertTrue(sort_str == 'provider NULLS FIRST')

        args = ImmutableMultiDict([('sort_by', 'price')])
        type_ = 1
        sort_str = main.sort_by(args, type_)
        self.assertTrue(sort_str == 'price NULLS FIRST')

        args = ImmutableMultiDict([('sort_by', 'jobtype')])
        type_ = 2
        sort_str = main.sort_by(args, type_)
        self.assertTrue(sort_str == 'jobtype NULLS FIRST')

    # check desired results of sorting
    # valid param descending
    def test_sort_by2(self):
        args = ImmutableMultiDict([('sort_by', 'provider'), ('desc','TRUE')])
        type_ = 0
        sort_str = main.sort_by(args, type_)
        self.assertTrue(sort_str == 'provider DESC NULLS LAST')

        args = ImmutableMultiDict([('sort_by', 'price'), ('desc','TRUE')])
        type_ = 1
        sort_str = main.sort_by(args, type_)
        self.assertTrue(sort_str == 'price DESC NULLS LAST')

        args = ImmutableMultiDict([('sort_by', 'jobtype'), ('desc','TRUE')])
        type_ = 2
        sort_str = main.sort_by(args, type_)
        self.assertTrue(sort_str == 'jobtype DESC NULLS LAST')

    # check desired results of sorting
    # invalid param
    def test_sort_by3(self):
        args = ImmutableMultiDict([('sort_by', 'test')])
        type_ = 0
        exception_str = ''
        sort_str = ''
        try:
            sort_str = main.sort_by(args, type_)
        except Exception as e:
            exception_str = str(e)
        self.assertTrue(exception_str == 'test_invalid_parameter')

        args = ImmutableMultiDict([('sort_by', 'test')])
        type_ = 1
        exception_str = ''
        sort_str = ''
        try:
            sort_str = main.sort_by(args, type_)
        except Exception as e:
            exception_str = str(e)
        self.assertTrue(exception_str == 'test_invalid_parameter')

        args = ImmutableMultiDict([('sort_by', 'test')])
        type_ = 2
        exception_str = ''
        sort_str = ''
        try:
            sort_str = main.sort_by(args, type_)
        except Exception as e:
            exception_str = str(e)
        self.assertTrue(exception_str == 'test_invalid_parameter')

    # check desired results of sorting
    # valid param with dashes
    def test_sort_by4(self):
        args = ImmutableMultiDict([('sort_by', 'subject-id')])
        type_ = 1
        sort_str = main.sort_by(args, type_)
        self.assertTrue(sort_str == 'subject_id NULLS FIRST')

        args = ImmutableMultiDict([('sort_by', 'num-related-courses')])
        type_ = 2
        sort_str = main.sort_by(args, type_)
        self.assertTrue(sort_str == 'num_related_courses NULLS FIRST')

    def test_search1(self):
        args = 'please-return-no-results-8y56VS^VSd65sdE'
        res = main.search(args)
        self.assertTrue(len(res) > 0)
    
    # test spaces
    def test_search2(self):
        args = 'to choose'
        res = json.loads(main.search(args))
        self.assertTrue('jobs' in res)
        if len(res['jobs']) > 0:
            self.assertTrue(re.search(args, json.dumps(res['jobs'][0]), re.IGNORECASE))
        elif len(res['courses']) > 0:
            self.assertTrue(re.search(args, json.dumps(res['courses'][0]), re.IGNORECASE))
        elif len(res['subjects']) > 0:
            self.assertTrue(re.search(args, json.dumps(res['subjects'][0]), re.IGNORECASE))
        else:
            self.assertTrue(False)
            
    # test special characters
    def test_search3(self):
        args='\''
        res = main.search(args)
        self.assertTrue(args in res)

    # check desired results of filtering
    # single valid param
    def test_filter_query1(self):
        args = ImmutableMultiDict([('provider', 'Udemy')])
        type_ = 0
        where_clause, data = main.filter_query(args, type_)
        self.assertTrue(where_clause == ' and ( (UPPER(Subject.provider) = %s))')
        self.assertTrue(len(data) == 1)
        self.assertTrue(data[0] == 'UDEMY')

        args = ImmutableMultiDict([('provider', 'Udemy')])
        type_ = 1
        where_clause, data = main.filter_query(args, type_)
        self.assertTrue(where_clause == ' and ( (UPPER(Course.provider) = %s))')
        self.assertTrue(len(data) == 1)
        self.assertTrue(data[0] == 'UDEMY')

        args = ImmutableMultiDict([('provider', 'Github Jobs')])
        type_ = 2
        where_clause, data = main.filter_query(args, type_)
        self.assertTrue(where_clause == ' and ( (UPPER(Job.provider) = %s))')
        self.assertTrue(len(data) == 1)
        self.assertTrue(data[0] == 'GITHUB JOBS')

    # check desired results of filtering
    # single valid range params
    def test_filter_query2(self):
        args = ImmutableMultiDict([('num-courses', '0..10')])
        type_ = 0
        where_clause, data = main.filter_query(args, type_)
        self.assertTrue(where_clause == ' and ( (Subject.num_courses BETWEEN %s AND %s))')
        self.assertTrue(len(data) == 2)

        args = ImmutableMultiDict([('price', '100..200')])
        type_ = 1
        where_clause, data = main.filter_query(args, type_)
        self.assertTrue(where_clause == ' and ( (Course.price BETWEEN %s AND %s))')
        self.assertTrue(len(data) == 2)

        args = ImmutableMultiDict([('num-related-courses', '5..100')])
        type_ = 2
        where_clause, data = main.filter_query(args, type_)
        self.assertTrue(where_clause == ' and ( (Job.num_related_courses BETWEEN %s AND %s))')
        self.assertTrue(len(data) == 2)

    # check desired results of filtering
    # valid param, value doesnt exist
    def test_filter_query3(self):
        args = ImmutableMultiDict([('provider', 'test')])
        type_ = 0
        where_clause, data = main.filter_query(args, type_)
        self.assertTrue(where_clause == ' and ( (UPPER(Subject.provider) = %s))')
        self.assertTrue(len(data) == 1)
        self.assertTrue(data[0] == 'TEST')

        args = ImmutableMultiDict([('provider', 'test')])
        type_ = 1
        where_clause, data = main.filter_query(args, type_)
        self.assertTrue(where_clause == ' and ( (UPPER(Course.provider) = %s))')
        self.assertTrue(len(data) == 1)
        self.assertTrue(data[0] == 'TEST')

        args = ImmutableMultiDict([('provider', 'test')])
        type_ = 2
        where_clause, data = main.filter_query(args, type_)
        self.assertTrue(where_clause == ' and ( (UPPER(Job.provider) = %s))')
        self.assertTrue(len(data) == 1)
        self.assertTrue(data[0] == 'TEST')

    # check desired results of filtering
    # multiple valid params
    def test_filter_query4(self):
        args = ImmutableMultiDict([('provider', 'Udemy'), ('num-courses', '0..10')])
        type_ = 0
        where_clause, data = main.filter_query(args, type_)
        self.assertTrue(where_clause == ' and ( (UPPER(Subject.provider) = %s)) and ( (Subject.num_courses BETWEEN %s AND %s))')
        self.assertTrue(len(data) == 3)
        self.assertTrue(data[0] == 'UDEMY')
        self.assertTrue(data[1] == 0 and data[2] == 10)

        args = ImmutableMultiDict([('provider', 'Khan Academy'), ('price', '0..0')])
        type_ = 1
        where_clause, data = main.filter_query(args, type_)
        self.assertTrue(where_clause == ' and ( (UPPER(Course.provider) = %s)) and ( (Course.price BETWEEN %s AND %s))')
        self.assertTrue(len(data) == 3)
        self.assertTrue(data[0] == 'KHAN ACADEMY')
        self.assertTrue(data[1] == 0 and data[2] == 0)

        args = ImmutableMultiDict([('provider', 'Github Jobs'), ('num-related-courses', '0..100')])
        type_ = 2
        where_clause, data = main.filter_query(args, type_)
        self.assertTrue(where_clause == ' and ( (UPPER(Job.provider) = %s)) and ( (Job.num_related_courses BETWEEN %s AND %s))')
        self.assertTrue(len(data) == 3)
        self.assertTrue(data[0] == 'GITHUB JOBS')
        self.assertTrue(data[1] == 0 and data[2] == 100)

    # check desired results of filtering
    # invalid param
    def test_filter_query5(self):
        args = ImmutableMultiDict([('test', 'hello')])
        type_ = 0
        where_clause = ''
        data = []
        error_str = ''
        try:
            where_clause, data = main.filter_query(args, type_)
        except Exception as e:
            error_str = str(e)
        self.assertTrue(error_str == 'test_invalid_filter')

        args = ImmutableMultiDict([('test', 'hello')])
        type_ = 1
        where_clause = ''
        data = []
        error_str = ''
        try:
            where_clause, data = main.filter_query(args, type_)
        except Exception as e:
            error_str = str(e)
        self.assertTrue(error_str == 'test_invalid_filter')

        args = ImmutableMultiDict([('test', 'hello')])
        type_ = 2
        where_clause = ''
        data = []
        error_str = ''
        try:
            where_clause, data = main.filter_query(args, type_)
        except Exception as e:
            error_str = str(e)
        self.assertTrue(error_str == 'test_invalid_filter')

if __name__ == '__main__':
    unittest.main()
