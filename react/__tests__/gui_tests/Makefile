.DEFAULT_GOAL := all

PFILES :=                   \
    test_carousel 			\
    test_about				\
    test_navbar				\
    test_subjects			\
    test_courses			\
    test_courses_filter_sort\
    test_subjects_filter_sort\
    test_jobs_filter_sort\
    test_search_page.py\




%.jsx: %.js
	-jshint $<
	istanbul cover _mocha -- $<


all:

clean:
	rm -f  .coverage
	rm -f  .pylintrc
	rm -rf .mypy_cache

#docker:
#	docker run -it -v $(PWD):/usr/cs373 -w /usr/cs373 gpdowning/gcc


#$(JSFILES:=.jsx) 

travis:
	- chmod +x ../linux_chrome
	- python3 test_carousel.py
	- python3 test_navbar.py
	- python3 test_subjects.py
	- python3 test_subjects_filter_sort.py
	- python3 test_courses.py
	- python3 test_jobs.py
	- python3 test_jobs_filter_sort.py
	- python3 test_about.py
	- python3 test_search_page.py

