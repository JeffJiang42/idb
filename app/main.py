from flask import Flask, Response, render_template
from l2e_api import endpoints
from github_info import getCommits, getIssues
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
    jeff_issues, kurtis_issues, william_issues, brandon_issues, spencer_issues = getIssues()

    spencer_bio = "Insert Bio"

    info = [{
    'name': 'Jeffrey Jiang',
    'commits': jeff_commits,
    'issues': jeff_issues,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/EA09WOz.jpg',
    'bio': jeff_bio
    }, {
    'name': 'Kurtis David',
    'commits': kurtis_commits,
    'issues': kurtis_issues,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/cUfxaZU.jpg',
    'bio': kurtis_bio
    },{
    'name': 'William Chia',
    'commits': william_commits,
    'issues': william_issues,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/0PUOsTj.jpg',
    'bio': william_bio
    },{
    'name': 'Brandon Chan',
    'commits': brandon_commits,
    'issues': brandon_issues,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/3LhRT5l.jpg',
    'bio': brandon_bio
    },{
    'name': 'Spencer Huff',
    'commits': spencer_commits,
    'issues': spencer_issues,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/1seLbaU.jpg',
    'bio': spencer_bio
    }]

    return render_template('about.html', heading="About learning2earn",
        data=info, data_length = len(info), title="About",current_time=datetime.datetime.now())

@app.route("/Jobs")
def jobs():

    info = [{
        'name': 'JavaScript: Understanding the Weird Parts',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/364426_2991_5.jpg',
        'Tier': 'Paid',
        'Price': 174.99,
        'Instructor': 'Anthony Alicea',
        'Link': 'udemy.com/understand-javascript/',
        'Description': 'An advanced JavaScript course for everyone! Scope, closures, prototypes, \'this\', build your own framework, and more.'
    }, {
        'name': 'Artificial Intelligence: Reinforcement Learning in Python',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/1080408_2645_3.jpg',
        'Tier': 'Paid',
        'Price': 179.99,
        'Instructor': 'Lazy Programmer Inc.',
        'Link': 'udemy.com/artificial-intelligence-reinforcement-learning-in-python/',
        'Description': 'Complete guide to artificial intelligence and machine learning, prep for deep reinforcement learning'
    }, {
        'name': 'Algorithms',
        'Provider': 'Khan Academy',
        'image': 'https://cdn.kastatic.org/genfiles/topic-icons/icons/algorithms.png-a4492d-416.png',
        'Tier': 'Free',
        'Price': 0.0,
        'Instructor': 'Tom Cormen and Devin Balkcom',
        'Link': 'https://www.khanacademy.org/computing/computer-science/algorithms',
        'Description': 'We\'ve partnered with Dartmouth college professors Tom Cormen and Devin Balkcom to teach introductory computer science algorithms, including searching, sorting, recursion, and graph theory. Learn with a combination of articles, visualizations, quizzes, and coding challenges.'
    }]

    return render_template('db_page.html', heading="Jobs"
        , data = info, data_length = len(info), keys = ['Provider','Tier','Instructor','Link','Description','Price'], 
        title="Jobs")

@app.route("/Courses")
def courses():

    info = [{
        'name': 'JavaScript: Understanding the Weird Parts',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/364426_2991_5.jpg',
        'Tier': 'Paid',
        'Price': 174.99,
        'Instructor': 'Anthony Alicea',
        'Link': 'udemy.com/understand-javascript/',
        'Description': 'An advanced JavaScript course for everyone! Scope, closures, prototypes, \'this\', build your own framework, and more.'
    }, {
        'name': 'Artificial Intelligence: Reinforcement Learning in Python',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/1080408_2645_3.jpg',
        'Tier': 'Paid',
        'Price': 179.99,
        'Instructor': 'Lazy Programmer Inc.',
        'Link': 'udemy.com/artificial-intelligence-reinforcement-learning-in-python/',
        'Description': 'Complete guide to artificial intelligence and machine learning, prep for deep reinforcement learning'
    }, {
        'name': 'Algorithms',
        'Provider': 'Khan Academy',
        'image': 'https://cdn.kastatic.org/genfiles/topic-icons/icons/algorithms.png-a4492d-416.png',
        'Tier': 'Free',
        'Price': 0.0,
        'Instructor': 'Tom Cormen and Devin Balkcom',
        'Link': 'https://www.khanacademy.org/computing/computer-science/algorithms',
        'Description': 'We\'ve partnered with Dartmouth college professors Tom Cormen and Devin Balkcom to teach introductory computer science algorithms, including searching, sorting, recursion, and graph theory. Learn with a combination of articles, visualizations, quizzes, and coding challenges.'
    }]

    return render_template('db_page.html', heading="Courses"
        , data = info, data_length = len(info), keys = ['Provider','Tier','Instructor','Link','Description','Price'], 
        title="Courses")

@app.route("/Subjects")
def subjects():

    info = [{
        'name': 'JavaScript: Understanding the Weird Parts',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/364426_2991_5.jpg',
        'Tier': 'Paid',
        'Price': 174.99,
        'Instructor': 'Anthony Alicea',
        'Link': 'udemy.com/understand-javascript/',
        'Description': 'An advanced JavaScript course for everyone! Scope, closures, prototypes, \'this\', build your own framework, and more.'
    }, {
        'name': 'Artificial Intelligence: Reinforcement Learning in Python',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/1080408_2645_3.jpg',
        'Tier': 'Paid',
        'Price': 179.99,
        'Instructor': 'Lazy Programmer Inc.',
        'Link': 'udemy.com/artificial-intelligence-reinforcement-learning-in-python/',
        'Description': 'Complete guide to artificial intelligence and machine learning, prep for deep reinforcement learning'
    }, {
        'name': 'Algorithms',
        'Provider': 'Khan Academy',
        'image': 'https://cdn.kastatic.org/genfiles/topic-icons/icons/algorithms.png-a4492d-416.png',
        'Tier': 'Free',
        'Price': 0.0,
        'Instructor': 'Tom Cormen and Devin Balkcom',
        'Link': 'https://www.khanacademy.org/computing/computer-science/algorithms',
        'Description': 'We\'ve partnered with Dartmouth college professors Tom Cormen and Devin Balkcom to teach introductory computer science algorithms, including searching, sorting, recursion, and graph theory. Learn with a combination of articles, visualizations, quizzes, and coding challenges.'
    }]

    return render_template('db_page.html', heading="Subjects", 
        data = info, data_length = len(info), keys = ['Provider','Tier','Instructor','Link','Description','Price'], 
        title="Subjects")

dataTemplate = {
    'name': 'my name',
    'description': 'your description',
    'other information': 'his/her information',
    'image': 'our image'
}

#below are functions that an instance of a category.

@app.route("/Subjects/<page>")
def subject_instance(page):
    return render_template('data.html', pageData = dataTemplate)

@app.route("/Jobs/<page>")
def jobs_instance(page):
    return render_template('data.html', pageData = dataTemplate)

@app.route("/Courses/<page>")
def courses_instance(page):
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
