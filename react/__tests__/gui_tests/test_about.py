# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

class UntitledTestCase(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome("../chromedriver2")
        self.driver.implicitly_wait(30)
        self.base_url = "https://www.katalon.com/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_untitled_test_case(self):
        driver = self.driver
        driver.get("http://localhost:3000/")
        driver.find_element_by_link_text("About").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[2]/div/p/a/b").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[2]/div/p[2]/a/b").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[2]/div/p[3]/a/b").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[2]/div[2]/p/a/b").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[2]/div[2]/p[2]/a/b").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[2]/div[2]/p[5]/a/b").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[2]/div[2]/p[12]/a/b").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[2]/div[3]/p/a[2]/b").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div/div[3]/div/div/div/h4").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div/div[7]/h3").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div/div[7]/h3").click()
        # ERROR: Caught exception [ERROR: Unsupported command [doubleClick | //div[@id='root']/div/div/div/div[7]/h3 | ]]
        driver.find_element_by_xpath("//div[@id='root']/div/div/div/div[3]/div/div").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div/div[4]/div/div/div/p[2]").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div/div[4]/div/div/div/p[2]").click()
        # ERROR: Caught exception [ERROR: Unsupported command [doubleClick | //div[@id='root']/div/div/div/div[4]/div/div/div/p[2] | ]]
        driver.find_element_by_xpath("//div[@id='root']/div/div/div/div[4]/div/div/div/p").click()
    
    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True
    
    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException as e: return False
        return True
    
    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True
    
    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
