from flask import Flask, Response, render_template
from l2e_api import endpoints
from github_info import getCommits
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

    jeff_bio = "Jeffrey is a third year Math/CS Major at UT Austin. \
    His life is consumed by his interest in both subjects. In the rare \
    occasion he has free time, he spends it learning guitar."

    william_bio = "William is a CS Major."

    brandon_bio = "Brandon is a third year CS Major at UT Austin. \
    Brandon likes a lot of things, including but not limited to hiking, \
    video games, beer, soccer, anime, photography, piano, ultimate frisbee, \
    meeting people, etc."

    kurtis_bio = "Kurtis is a third year CS/Math Major at UT Austin. \
    He likes to play Super Smash Bros. Melee (Marth of course) in his spare time."

    jeff_commits, kurtis_commits, william_commits, brandon_commits, spencer_commits = getCommits()

    spencer_bio = "Insert Bio"

    info = [{
    'name': 'Jeffrey Jiang',
    'commits': jeff_commits,
    'issues': 57,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/EA09WOz.jpg',
    'bio': jeff_bio
    }, {
    'name': 'Kurtis David',
    'commits': kurtis_commits,
    'issues': 57,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/cUfxaZU.jpg',
    'bio': kurtis_bio
    },{
    'name': 'William Chia',
    'commits': william_commits,
    'issues': 57,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/DeF2saL.jpg',
    'bio': william_bio
    },{
    'name': 'Brandon Chan',
    'commits': brandon_commits,
    'issues': 57,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/3LhRT5l.jpg',
    'bio': brandon_bio
    },{
    'name': 'Spencer Huff',
    'commits': spencer_commits,
    'issues': 57,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/DeF2saL.jpg',
    'bio': spencer_bio
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


dataTemplate = {
    'name': 'my name',
    'description': 'your description',
    'other information': 'his/her information',
    'image': 'our image'
}

@app.route("/data")
def data():
    return render_template('data.html', pageData = dataTemplate)


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
