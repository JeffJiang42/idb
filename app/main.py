from flask import Flask, Response, render_template
from l2e_api import endpoints
from bs4 import BeautifulSoup
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

    william_bio = "William is a third year CS Major. \
    He likes playing piano and guitar, cooking, and also plays some Melee."

    brandon_bio = "Brandon is a third year CS Major at UT Austin. \
    Brandon likes a lot of things, including but not limited to hiking, \
    video games, beer, soccer, anime, photography, piano, ultimate frisbee, \
    meeting people, etc."

    kurtis_bio = "Kurtis is a third year CS/Math Major at UT Austin. \
    He likes to play Super Smash Bros. Melee (Marth of course) in his spare time."

    spencer_bio = "Spencer is a junior CS major at UT Austin. He likes to cook \
    and hang out with his cats in his free time."

    jeff_resp = "Frontend"
    kurtis_resp = "Frontend + Backend = Full Stack"
    william_resp = "Backend + API + Full Stack"
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

jobs_dict = {
    'Front-end Developer (WordPress)': {
        'keys': ['Provider','Company','Link','Description','Related Subjects','Related Courses'],
        'name': 'Front-end Developer (WordPress)',
        'Provider': 'Authentic Jobs',
        'image': 'https://authenticjobs.s3.amazonaws.com/uploads/logos/1408dcfca73e5380d8c35dee5e3c409b/thumb/logo_2.jpg',
        'Company': 'Jacob Simon Design',
        'Link': 'authenticjobs.com/jobs/30303/front-end-developer-wordpress',
        'Description': "I'm looking for an experienced WordPress developer that has built custom-themed sites from the ground up. I get a plethora of work, but the majority of it is WordPress at the moment. If you have additional skillsets it's very possible they'll be called upon at some point.  I prefer a very relaxed, stress-free outlook to the development process. That being said, delivering high quality work on time should be second nature for you. Projects will be supplied on a contract basis with a clear scope of work that leaves no question regarding expectations for each party involved.  Required Skills   WordPress custom theme development (front-end and back-end) and all things associated: Advanced Custom Fields, Custom Post Types, CMS training, etc. PHP, HTML5, Sass/LESS, MySQL, JavaScript (jQuery) Git + version controlComfortable with Sketch + Photoshop (design handoff). Effective communication + clear English. Bonus Skills.  E-commerce (WooCommerce, Shopify)  Other CMS platforms (Magento, Drupal)  Accessibility best practices    UX/Design experience (Sketch, Photoshop)    Animation libraries (WebGL, GSAP)     Mailchimp      When you apply   please include your hourly rate and samples of your work.",
        'Related Subjects': 'Web Development',
        'Related Courses': 'JavaScript: Understanding the Weird Parts'
    },
    'Facebook Ads Manager': {
        'keys': ['Provider','Company','Link','Description','Related Subjects','Related Courses'],
        'name': 'Facebook Ads Manager',
        'Provider': 'Authentic Jobs',
        'image': 'http://www.emilyhirsh.com/theme/logo.png',
        'Company': 'Emily Hirsh, Inc.',
        'Link': 'authenticjobs.com/jobs/30248/facebook-ads-manager',
        'Description': "We're looking for a rockstar Facebook Ads Manager to join our team. Emily Hirsh, Inc. is a leading digital advertising and sales funnel strategy agency, primarily working with entrepreneurs and infopreneurs to scale their business and increase their revenue by providing strategic planning and management of their digital media buying. We continue to grow rapidly and need another Facebook Ads Manager to help support our team. We are looking for someone who has...1-2 years experience creating and managing client campaigns in Facebook Ads Manager and/or Power Editor. An ability to analyze and optimize client campaigns daily, including troubleshooting and issues and ideating new strategies. Familiarity with Pixel placement and management. Experience with client communication, including email correspondence and monthly strategy calls The ability to manage their time and priorities on a day to day basis. Excellent attention to detail.  This is a remote position that requires 30-40 hours a week. We are looking for American or Canadian candidates who are available during US office hours and who are able to attend daily video meetings and accomodate monthly client calls.",
        'Related Subjects': 'Data & Analytics',
        'Related Courses': 'Artificial Intelligence: Reinforcement Learning in Python'
    },
    'iOS (Objective-C-Swift) Developer for Reactive Native projects': {
        'keys': ['Provider','Company','Link','Description','Related Subjects','Related Courses'],
        'name': 'iOS (Objective-C-Swift) Developer for Reactive Native projects',
        'Provider': 'Authentic Jobs',
        'image': 'http://64interactive.com/images/6b6956fc.logo.svg',
        'Company': '64 Interactive, LLC',
        'Link': 'authenticjobs.com/jobs/30225/ios-objective-c-swift-developer-for-reactive-native-projects',
        'Description': "Overview: I'm a front-end developer who routinely has projects that require custom components in iOS. I'm looking for someone that I could contract out to build a native component that I can integrate into my Reactive Native view layer. I don't care if it's built in Swift or Objective-c - all I care is that I can pass in my parameters/props from React and your components can return the data I need. About you You speak fluent english. You enjoy working with other developers. You have lots of experience building apps in Xcode. You have worked as a contractor before, understand how to manage yourself, and can deliver your work on time (based on your estimates). Bonuses You have worked with React Native and created custom components (https://facebook.github.io/react-native/docs/native-components-ios.html)  You have experience in Javascript",
        'Related Subjects': 'Computer science',
        'Related Courses': 'Algorithms'
    }
}

@app.route("/Jobs")
def jobs():

    keys = ['Provider','Company']

    info = []

    for job in jobs_dict:
        tmp = jobs_dict[job]
        curr = {'name':job,
                'image': tmp['image'],
                'Provider': tmp['Provider'],
                'Company': tmp['Company'],
        }
        info.append(curr)

    return render_template('db_page.html', heading="Jobs"
        , data = info, data_length = len(info), keys = keys,
        title="Jobs")


courses_dict = {
    'JavaScript: Understanding the Weird Parts': {
        'keys': ['Provider','Tier','Price','Instructor','Link','Description','Subjects','Related Jobs'],
        'name': 'JavaScript: Understanding the Weird Parts',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/364426_2991_5.jpg',
        'Tier': 'Paid',
        'Price': "$174.99",
        'Instructor': 'Anthony Alicea',
        'Link': 'udemy.com/understand-javascript/',
        'Description': 'An advanced JavaScript course for everyone! Scope, closures, prototypes, \'this\', build your own framework, and more.',
        'Subjects': 'Web Development',
        'Related Jobs': 'Front-end Developer (WordPress)'
    },
    'Artificial Intelligence: Reinforcement Learning in Python': {
        'keys': ['Provider','Tier','Price','Instructor','Link','Description','Subjects','Related Jobs'],
        'name': 'Artificial Intelligence: Reinforcement Learning in Python',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/125_H/1080408_2645_3.jpg',
        'Tier': 'Paid',
        'Price': "$179.99",
        'Instructor': 'Lazy Programmer Inc.',
        'Link': 'udemy.com/artificial-intelligence-reinforcement-learning-in-python/',
        'Description': 'Complete guide to artificial intelligence and machine learning, prep for deep reinforcement learning',
        'Subjects': 'Data & Analytics',
        'Related Jobs': 'Facebook Ads Manager'
    },
    'Algorithms': {
        'keys': ['Provider','Tier','Price','Instructor','Link','Description','Subjects','Related Jobs'],
        'name': 'Algorithms',
        'Provider': 'Khan Academy',
        'image': 'https://cdn.kastatic.org/genfiles/topic-icons/icons/algorithms.png-a4492d-416.png',
        'Tier': 'Free',
        'Price': "$0.00",
        'Instructor': 'Tom Cormen and Devin Balkcom',
        'Link': 'www.khanacademy.org/computing/computer-science/algorithms',
        'Description': 'We\'ve partnered with Dartmouth college professors Tom Cormen and Devin Balkcom to teach introductory computer science algorithms, including searching, sorting, recursion, and graph theory. Learn with a combination of articles, visualizations, quizzes, and coding challenges.',
        'Subjects': 'Computer science',
        'Related Jobs': 'iOS (Objective-C-Swift) Developer for Reactive Native projects'
    }
}

@app.route("/Courses")
def courses():

    keys = ['Provider','Tier']

    info = []

    for course in courses_dict:
        tmp = courses_dict[course]
        curr = {'name':course,
                'image': tmp['image'],
                'Provider': tmp['Provider'],
                'Tier': tmp['Tier'],
        }
        info.append(curr)

    return render_template('db_page.html', heading="Courses"
        , data = info, data_length = len(info), keys = keys,
        title="Courses")

subjects_dict = {
    'Computer science': {
        'keys': ['Provider','Link','Description','# Courses','Courses','Related Jobs'],
        'name': 'Computer science',
        'Provider': 'Khan Academy',
        'image': 'https://cdn.kastatic.org/genfiles/topic-icons/icons/computer_programming.png-7da73e-128c.png',
        'Link': 'khanacademy.org/computing/computer-science',
        'Description': 'Learn select topics from computer science - algorithms (how we solve common problems in computer science and measure the efficiency of our solutions), cryptography (how we protect secret information), and information theory (how we encode and compress information).',
        'Courses': 'Algorithms',
        '# Courses': 1,
        'Related Jobs': 'iOS (Objective-C-Swift) Developer for Reactive Native projects'
    },
    'Web Development': {
        'keys': ['Provider','Link','Description','# Courses','Courses','Related Jobs'],
        'name': 'Web Development',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/480x270/1512962_9f57.jpg',
        'Link': 'www.udemy.com/courses/development/web-development',
        'Description': 'Learn web development from Udemy',
        'Courses': 'JavaScript: Understanding the Weird Parts',
        '# Courses': 1,
        'Related Jobs': 'Front-end Developer (WordPress)'
    },
    'Data & Analytics': {
        'keys': ['Provider','Link','Description','# Courses','Courses','Related Jobs'],
        'name': 'Data & Analytics',
        'Provider': 'Udemy',
        'image': 'https://udemy-images.udemy.com/course/480x270/1499380_7a57_2.jpg',
        'Link': 'www.udemy.com/courses/business/data-and-analytics/',
        'Description': 'Learn data & analytics from Udemy',
        'Courses': 'Artificial Intelligence: Reinforcement Learning in Python',
        '# Courses': 1,
        'Related Jobs': 'Facebook Ads Manager'
    }
}

@app.route("/Subjects")
def subjects():

    keys = ['Provider','# Courses']

    info = []

    for subject in subjects_dict:
        tmp = subjects_dict[subject]
        curr = {'name':subject,
                'image': tmp['image'],
                'Provider': tmp['Provider'],
                '# Courses': tmp['# Courses'],
        }
        info.append(curr)

    return render_template('db_page.html', heading="Subjects",
        data = info, data_length = len(info), keys = keys,
        title="Subjects")
#below are functions that an instance of a category.

@app.route("/Subjects/<page>")
def subject_instance(page):

    keys = subjects_dict[page]['keys']
    return render_template('data.html', pageData = subjects_dict[page], pageKeys = keys)

@app.route("/Jobs/<page>")
def jobs_instance(page):

    keys = jobs_dict[page]['keys']
    return render_template('data.html', pageData = jobs_dict[page], pageKeys = keys)

@app.route("/Courses/<page>")
def courses_instance(page):

    keys = courses_dict[page]['keys']
    return render_template('data.html', pageData = courses_dict[page], pageKeys = keys)

def clean_up_text(text):
    markup = text
    soup = BeautifulSoup(markup)
    soup.get_text()
    return soup.i.get_text()

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
