
.DEFAULT_GOAL := all

PFILES :=                   \
    react/__tests__/test_carousel.py 			\

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
	chmod +x react/__tests__/linux_chrome
	make run
	ls -al