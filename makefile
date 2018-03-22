gui_testing:
	sudo apt-get install xserver-xephyr
	sudo apt-get install xvfb
	pip install pyvirtualdisplay selenium

travis:
	cd react/; npm install
	cd react/; npm test
	cd react/__tests__/gui_tests; make travis
	@echo