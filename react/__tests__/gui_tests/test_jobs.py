# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re
from pyvirtualdisplay import Display


class UntitledTestCase(unittest.TestCase):
    def setUp(self):
        self.display = Display(visible=0, size=(1920, 1080))
        self.display.start()
        self.driver = webdriver.Chrome('../linux_chrome')
        self.driver.delete_all_cookies()
        
        self.driver.implicitly_wait(30)
        self.base_url = "https://www.katalon.com/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_untitled_test_case(self):
        driver = self.driver
        driver.get("http://www.learning2earn.me/")
        driver.find_element_by_link_text("Jobs").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[3]/div/div/a/div").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div/div/div/div[2]/div/ul/div/div/a/div").click()
        driver.find_element_by_link_text("Jobs").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[3]/div[3]/div/a/div/div/h4").click()
        driver.find_element_by_link_text("Jobs").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[2]/h1").click()
        driver.find_element_by_link_text("Jobs").click()
    
    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True
    
    # def is_alert_present(self):
    #     try: self.driver.switch_to_alert()
    #     except NoAlertPresentException as e: return False
    #     return True
    
    # def close_alert_and_get_its_text(self):
    #     try:
    #         alert = self.driver.switch_to_alert()
    #         alert_text = alert.text
    #         if self.accept_next_alert:
    #             alert.accept()
    #         else:
    #             alert.dismiss()
    #         return alert_text
    #     finally: self.accept_next_alert = True
    
    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
