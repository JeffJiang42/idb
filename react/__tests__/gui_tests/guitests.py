#python guitests.py to run
#need to pip install selenium
#right now it is throwing errors

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import unittest, time, re

class WebdriverTest1(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "http://en.wikipedia.org"
       
    def test_Wikipedia(self):
        driver = self.driver
        driver.get(self.base_url + "/wiki/Main_Page")
        driver.find_element_by_id("searchInput").clear()
        driver.find_element_by_id("searchInput").send_keys("India")
        driver.find_element_by_id("searchButton").click()    
   
    def tearDown(self):
        self.driver.quit()       

if __name__ == "__main__":
    unittest.main()