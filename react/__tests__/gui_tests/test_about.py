# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re
from pyvirtualdisplay import Display

class About(unittest.TestCase):
    def setUp(self):
        self.display = Display(visible=0, size=(1920, 1080))
        self.display.start()
        self.driver = webdriver.Chrome('../linux_chrome')
        self.driver.implicitly_wait(30)
        self.base_url = "https://www.katalon.com/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_about(self):
        driver = self.driver
        driver.get("http://learning2earn.me/")
        driver.find_element_by_link_text("About").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[2]/div/p/a/b").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[2]/div/p[2]/a/b").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[2]/div/p[3]/a/b").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[2]/div[2]/p[4]/a/b").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div/div[2]/div[2]/p[12]/a/b").click()
        driver.find_element_by_xpath("//img[contains(@src,'https://i.imgur.com/g16hr23.png')]").click()
        driver.find_element_by_link_text("About").click()
    
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
