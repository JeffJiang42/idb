import unittest
import json
import main

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
        print(main.best_cache)
        self.assertFalse(len(res) == 1 and res[0][0] == 'error')
        self.assertTrue(test_phrase in main.best_cache)
        self.assertTrue(main.best_cache[test_phrase] == res)

if __name__ == '__main__':
    unittest.main()