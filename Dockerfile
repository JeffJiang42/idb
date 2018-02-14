FROM tiangolo/uwsgi-nginx-flask:flask

RUN pip install --upgrade pip && \
    pip --version             && \
    pip install autopep8      && \
    pip install coverage      && \
    pip install requests      && \
    pip install bs4	      && \
    pip install pandas

COPY ./app /app
