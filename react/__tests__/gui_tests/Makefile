.DEFAULT_GOAL := all

PFILES :=                   \
    test_carousel 			\
    test_about				\
    test_navbar				\
    test_subjects			\
    test_courses			\
    test_courses_filter_search\
    test_subjects_filter_search\



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
	make clean
	ls -al
	chmod +x ../linux_chrome
	python test_carousel.py
	python test_navbar.py
	python test_subjects.py
	python test_subjects_filter_search.py
	python test_courses.py
	python test_courses_filter_search.py
	python test_jobs.py
	python test_about.py

	ls -al