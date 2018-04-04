FROM tiangolo/uwsgi-nginx-flask:python3.6

RUN pip install --upgrade pip && \
    pip --version             && \
    pip install autopep8      && \
    pip install coverage      && \
    pip install requests      && \
    pip install bs4	          && \
    pip install pandas        && \
    pip install -U flask_cors && \
	pip install psycopg2

COPY . .
