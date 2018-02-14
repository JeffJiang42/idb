from flask import Flask, Response, render_template
from l2e_api import endpoints
from github_info import getCommits, getIssues
import datetime
import json

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

    william_bio = "William is a CS Major. That is all he has to say"

    brandon_bio = "Brandon is a third year CS Major at UT Austin. \
    Brandon likes a lot of things, including but not limited to hiking, \
    video games, beer, soccer, anime, photography, piano, ultimate frisbee, \
    meeting people, etc."

    kurtis_bio = "Kurtis is a third year CS/Math Major at UT Austin. \
    He likes to play Super Smash Bros. Melee (Marth of course) in his spare time."

    spencer_bio = "Spencer is a third year CS major. He likes to keep his bio minimal"

    jeff_resp = "Frontend"
    kurtis_resp = "Fronted + Backend"
    william_resp = "Backend + API"
    brandon_resp = "Frontend"
    spencer_resp = "Backend"

    jeff_commits, kurtis_commits, william_commits, brandon_commits, spencer_commits = getCommits()
    jeff_issues, kurtis_issues, william_issues, brandon_issues, spencer_issues = getIssues()

    totals = [jeff_commits + kurtis_commits + william_commits + brandon_commits + spencer_commits, \
    jeff_issues + kurtis_issues + william_issues + brandon_issues + spencer_issues]

    info = [{
    'name': 'Jeffrey Jiang',
    'commits': jeff_commits,
    'issues': jeff_issues,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/EA09WOz.jpg',
    'bio': jeff_bio,
    'resp': jeff_resp
    }, {
    'name': 'Kurtis David',
    'commits': kurtis_commits,
    'issues': kurtis_issues,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/cUfxaZU.jpg',
    'bio': kurtis_bio,
    'resp':kurtis_resp
    },{
    'name': 'William Chia',
    'commits': william_commits,
    'issues': william_issues,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/0PUOsTj.jpg',
    'bio': william_bio,
    'resp': william_resp
    },{
    'name': 'Brandon Chan',
    'commits': brandon_commits,
    'issues': brandon_issues,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/3LhRT5l.jpg',
    'bio': brandon_bio,
    'resp': brandon_resp
    },{
    'name': 'Spencer Huff',
    'commits': spencer_commits,
    'issues': spencer_issues,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/1seLbaU.jpg',
    'bio': spencer_bio,
    'resp': spencer_resp
    }]

    return render_template('about.html', heading="About learning2earn",
        data=info, total_stats=totals, title="About")

@app.route("/Jobs")
def jobs():

    info = [{
        'name': 'JavaScript: Understanding the Weird Parts',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/364426_2991_5.jpg',
        'Tier': 'Paid'
    }, {
        'name': 'Artificial Intelligence: Reinforcement Learning in Python',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/1080408_2645_3.jpg',
        'Tier': 'Paid'
    }, {
        'name': 'Algorithms',
        'Provider': 'Khan Academy',
        'image': 'https://cdn.kastatic.org/genfiles/topic-icons/icons/algorithms.png-a4492d-416.png',
        'Tier': 'Free'
    }]

    return render_template('db_page.html', heading="Jobs"
        , data = info, data_length = len(info), keys = ['Provider','Tier'], 
        title="Jobs")

@app.route("/Courses")
def courses():

    info = [{
        'name': 'JavaScript: Understanding the Weird Parts',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/364426_2991_5.jpg',
        'Tier': 'Paid'
    }, {
        'name': 'Artificial Intelligence: Reinforcement Learning in Python',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/1080408_2645_3.jpg',
        'Tier': 'Paid'
    }, {
        'name': 'Algorithms',
        'Provider': 'Khan Academy',
        'image': 'https://cdn.kastatic.org/genfiles/topic-icons/icons/algorithms.png-a4492d-416.png',
        'Tier': 'Free'
    }]
    return render_template('db_page.html', heading="Courses"
        , data = info, data_length = len(info), keys = ['Provider','Tier'], 
        title="Courses")


@app.route("/Subjects")
def subjects():

    info = [{
        'name': 'JavaScript: Understanding the Weird Parts',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/364426_2991_5.jpg',
        'Tier': 'Paid'
    }, {
        'name': 'Artificial Intelligence: Reinforcement Learning in Python',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/1080408_2645_3.jpg',
        'Tier': 'Paid'
    }, {
        'name': 'Algorithms',
        'Provider': 'Khan Academy',
        'image': 'https://cdn.kastatic.org/genfiles/topic-icons/icons/algorithms.png-a4492d-416.png',
        'Tier': 'Free'
    }]

    return render_template('db_page.html', heading="Subjects", 
        data = info, data_length = len(info), keys = ['Provider','Tier'], 
        title="Subjects")
#below are functions that an instance of a category.
subjects = {
    'JavaScript: Understanding the Weird Parts': {
        'keys': ['Provider','Tier','Price','Instructor','Link','Description'],
        'name': 'JavaScript: Understanding the Weird Parts',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/364426_2991_5.jpg',
        'Tier': 'Paid',
        'Price': 174.99,
        'Instructor': 'Anthony Alicea',
        'Link': 'udemy.com/understand-javascript/',
        'Description': 'An advanced JavaScript course for everyone! Scope, closures, prototypes, \'this\', build your own framework, and more.'
    },
    'Artificial Intelligence: Reinforcement Learning in Python': {
        'keys': ['Provider','Tier','Price','Instructor','Link','Description'],
        'name': 'Artificial Intelligence: Reinforcement Learning in Python',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/1080408_2645_3.jpg',
        'Tier': 'Paid',
        'Price': 179.99,
        'Instructor': 'Lazy Programmer Inc.',
        'Link': 'udemy.com/artificial-intelligence-reinforcement-learning-in-python/',
        'Description': 'Complete guide to artificial intelligence and machine learning, prep for deep reinforcement learning'
    
    },
    'Algorithms': {
        'keys': ['Provider','Tier','Price','Instructor','Link','Description'],
        'name': 'Algorithms',
        'Provider': 'Khan Academy',
        'image': 'https://cdn.kastatic.org/genfiles/topic-icons/icons/algorithms.png-a4492d-416.png',
        'Tier': 'Free',
        'Price': 0.0,
        'Instructor': 'Tom Cormen and Devin Balkcom',
        'Link': 'https://www.khanacademy.org/computing/computer-science/algorithms',
        'Description': 'We\'ve partnered with Dartmouth college professors Tom Cormen and Devin Balkcom to teach introductory computer science algorithms, including searching, sorting, recursion, and graph theory. Learn with a combination of articles, visualizations, quizzes, and coding challenges.'
    }
}

@app.route("/Subjects/<page>")
def subject_instance(page):

    keys = subjects[page]['keys']
    return render_template('data.html', pageData = subjects[page], pageKeys = keys)

jobs = {
    'JavaScript: Understanding the Weird Parts': {
        'keys': ['Provider','Tier','Instructor','Link','Description','Price'],
        'name': 'JavaScript: Understanding the Weird Parts',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/364426_2991_5.jpg',
        'Tier': 'Paid',
        'Price': 174.99,
        'Instructor': 'Anthony Alicea',
        'Link': 'udemy.com/understand-javascript/',
        'Description': 'An advanced JavaScript course for everyone! Scope, closures, prototypes, \'this\', build your own framework, and more.'
    },
    'Artificial Intelligence: Reinforcement Learning in Python': {
        'keys': ['Provider','Tier','Instructor','Link','Description','Price'],
        'name': 'Artificial Intelligence: Reinforcement Learning in Python',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/1080408_2645_3.jpg',
        'Tier': 'Paid',
        'Price': 179.99,
        'Instructor': 'Lazy Programmer Inc.',
        'Link': 'udemy.com/artificial-intelligence-reinforcement-learning-in-python/',
        'Description': 'Complete guide to artificial intelligence and machine learning, prep for deep reinforcement learning'
    
    },
    'Algorithms': {
        'keys': ['Provider','Tier','Instructor','Link','Description','Price'],
        'name': 'Algorithms',
        'Provider': 'Khan Academy',
        'image': 'https://cdn.kastatic.org/genfiles/topic-icons/icons/algorithms.png-a4492d-416.png',
        'Tier': 'Free',
        'Price': 0.0,
        'Instructor': 'Tom Cormen and Devin Balkcom',
        'Link': 'https://www.khanacademy.org/computing/computer-science/algorithms',
        'Description': 'We\'ve partnered with Dartmouth college professors Tom Cormen and Devin Balkcom to teach introductory computer science algorithms, including searching, sorting, recursion, and graph theory. Learn with a combination of articles, visualizations, quizzes, and coding challenges.'
    }
}

@app.route("/Jobs/<page>")
def jobs_instance(page):

    keys = jobs[page]['keys']
    return render_template('data.html', pageData = jobs[page], pageKeys = keys)


courses = {
    'JavaScript: Understanding the Weird Parts': {
        'keys': ['Provider','Tier','Price','Instructor','Link','Description','Price'],
        'name': 'JavaScript: Understanding the Weird Parts',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/364426_2991_5.jpg',
        'Tier': 'Paid',
        'Price': "$174.99",
        'Instructor': 'Anthony Alicea',
        'Link': 'udemy.com/understand-javascript/',
        'Description': 'An advanced JavaScript course for everyone! Scope, closures, prototypes, \'this\', build your own framework, and more.'
    },
    'Artificial Intelligence: Reinforcement Learning in Python': {
        'keys': ['Provider','Tier','Price','Instructor','Link','Description'],
        'name': 'Artificial Intelligence: Reinforcement Learning in Python',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/1080408_2645_3.jpg',
        'Tier': 'Paid',
        'Price': "$179.99",
        'Instructor': 'Lazy Programmer Inc.',
        'Link': 'udemy.com/artificial-intelligence-reinforcement-learning-in-python/',
        'Description': 'Complete guide to artificial intelligence and machine learning, prep for deep reinforcement learning'
    
    },
    'Algorithms': {
        'keys': ['Provider','Tier','Price','Instructor','Link','Description'],
        'name': 'Algorithms',
        'Provider': 'Khan Academy',
        'image': 'https://cdn.kastatic.org/genfiles/topic-icons/icons/algorithms.png-a4492d-416.png',
        'Tier': 'Free',
        'Price': "$0.00",
        'Instructor': 'Tom Cormen and Devin Balkcom',
        'Link': 'https://www.khanacademy.org/computing/computer-science/algorithms',
        'Description': 'We\'ve partnered with Dartmouth college professors Tom Cormen and Devin Balkcom to teach introductory computer science algorithms, including searching, sorting, recursion, and graph theory. Learn with a combination of articles, visualizations, quizzes, and coding challenges.'
    }
}

@app.route("/Courses/<page>")
def courses_instance(page):

    keys = courses[page]['keys']
    return render_template('data.html', pageData = courses[page], pageKeys = keys)


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
