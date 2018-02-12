from flask import Flask, render_template
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
    return render_template('template.html', my_string="Wheeeee!", 
        my_list=[0,1,2,3,4,5], title="Index", current_time=datetime.datetime.now())

@app.route("/about")
def about():
    return render_template('template.html', my_string="Bar", 
        my_list=[12,13,14,15,16,17], title="About", current_time=datetime.datetime.now())


@app.route("/jobs")
def jobs():
    return render_template('template.html', my_string="Foo", 
        my_list=[6,7,8,9,10,11], title="Jobs", current_time=datetime.datetime.now())

@app.route("/courses")
def courses():
    return render_template('template.html', my_string="FooBar"
        , my_list=[18,19,20,21,22,23], title="Courses", current_time=datetime.datetime.now())

@app.route("/degrees")
def degrees():
    return render_template('template.html', my_string="FooBar"
        , my_list=[18,19,20,21,22,23], title="Degree", current_time=datetime.datetime.now())
		
@app.route('/api/<endpoint>')
def api(endpoint=None):
        if endpoint in endpoints:
                return endpoints[endpoint]()
        else:
                return '{"error":"doesn\'t exist"}'

if __name__ == '__main__':
    app.run(debug=True)
