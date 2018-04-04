FROM tiangolo/uwsgi-nginx-flask:python3.6

RUN pip3 install --upgrade pip && \
    pip3 --version             && \
    pip3 install autopep8      && \
    pip3 install coverage      && \
    pip3 install requests      && \
    pip3 install bs4	          && \
    pip3 install pandas        && \
    pip3 install -U flask_cors && \
	pip3 install psycopg2

COPY . .
