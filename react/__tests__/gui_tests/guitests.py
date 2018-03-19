#python guitests.py to run
#need to pip install selenium
#right now it is throwing errors

# dependencies required: 
# pip install pyvirtualdisplay selenium  
from unittest import main, TestCase
from selenium import webdriver
from pyvirtualdisplay import Display

class HomePageTest(TestCase):
	def setUp(self):
		self.display = Display(visible=0, size=(1920, 1080))
		self.display.start()
		self.driver = webdriver.Chrome("../chromedriver 2")
		self.driver.get('http://localhost:3000')

	def test_home_page_browser_tab_title(self):
		# self.navigate_to_site()
		self.assertEqual(self.driver.title, "learning2earn")

	def tearDown(self):
		self.driver.quit()
		self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
	main()



# apt-get install xvfb xserver-xephyr 
