.DEFAULT_GOAL := all

PFILES :=                   \
    test_carousel 			\
    test_about				\
    test_navbar				\


%.jsx: %.js
	-jshint $<
	istanbul cover _mocha -- $<

.pylintrc:
	pylint --disable=locally-disabled --reports=no --generate-rcfile > $@

%.pyx: %.py .pylintrc
	-mypy     $<
	-pylint   $<
	-coverage run    --branch $<
	-coverage report -m --omit="*/lib/*"

all:

clean:
	rm -f  .coverage
	rm -f  .pylintrc
	rm -rf .mypy_cache

#docker:
#	docker run -it -v $(PWD):/usr/cs373 -w /usr/cs373 gpdowning/gcc

run: $(PFILES:=.pyx)

#$(JSFILES:=.jsx) 

travis:
	make clean
	ls -al
	chmod +x ../linux_chrome
	make run
	ls -al