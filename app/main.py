from flask import Flask, Response, render_template
from l2e_api import endpoints
import datetime

app = Flask(__name__)

@app.template_filter()
def datetimefilter(value, format='%Y/%m/%d %H:%M'):
    """convert a datetime to a different format."""
    return value.strftime(format)

app.jinja_env.filters['datetimefilter'] = datetimefilter

@app.route("/")
def template_test():
    return render_template('index.html', title="Hello!")

@app.route("/about")
def about():

    info = [{
    'name': 'Jeffrey Jiang',
    'commits': 420,
    'issues': 57,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/EA09WOz.jpg'
    }, {
    'name': 'Kurtis David',
    'commits': 420,
    'issues': 57,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/cUfxaZU.jpg'
    },{
    'name': 'William Chia',
    'commits': 420,
    'issues': 57,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/DeF2saL.jpg'
    },{
    'name': 'Brandon Chan',
    'commits': 420,
    'issues': 57,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/DeF2saL.jpg'
    },{
    'name': 'Spencer Huff',
    'commits': 420,
    'issues': 57,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/DeF2saL.jpg'
    }]

    return render_template('about.html', heading="About learning2earn",
        data=info, data_length = len(info), title="About",current_time=datetime.datetime.now())

@app.route("/jobs")
def jobs():

    info = [{
        'name': 'Computer Science',
        'subtopics': 10,
        'courses': 20,
        'related_jobs': 20
    }, {
        'name': 'Mathematics',
        'subtopics': 5,
        'courses': 10,
        'related_jobs': 10
    }, {
        'name': 'Physics',
        'subtopics': 10,
        'courses': 10,
        'related_jobs': 5
    }]

    return render_template('db_page.html', heading="Jobs",
        data=info, data_length = len(info), title="Jobs", current_time=datetime.datetime.now())

@app.route("/courses")
def courses():

    info = [{
        'name': 'Computer Science',
        'subtopics': 10,
        'courses': 20,
        'related_jobs': 20
    }, {
        'name': 'Mathematics',
        'subtopics': 5,
        'courses': 10,
        'related_jobs': 10
    }, {
        'name': 'Physics',
        'subtopics': 10,
        'courses': 10,
        'related_jobs': 5
    }]

    return render_template('db_page.html', heading="Courses"
        , data = info, data_length = len(info), title="Courses", current_time=datetime.datetime.now())

@app.route("/subjects")
def subjects():

    info = [{
        'name': 'Computer Science',
        'subtopics': 10,
        'courses': 20,
        'related_jobs': 20
    }, {
        'name': 'Mathematics',
        'subtopics': 5,
        'courses': 10,
        'related_jobs': 10
    }, {
        'name': 'Physics',
        'subtopics': 10,
        'courses': 10,
        'related_jobs': 5
    }]

    return render_template('db_page.html', heading="Subjects"
        , data = info, data_length = len(info), title="Subjects", current_time=datetime.datetime.now())

@app.route("/api/<endpoint>")
def api(endpoint=None):
    data = '{"error":"not found"}'
    if endpoint in endpoints:
        data = endpoints[endpoint]()
    res = Response(data)
    res.headers['Content-Type'] = 'application/json'
    return res

if __name__ == '__main__':
    app.run(debug=True)
