from flask import Flask
from l2e_api import endpoints

app = Flask('learning2earn')

@app.route('/')
def hello():
	return "$$$ get cash fast $$$"

@app.route('/api/<endpoint>')
def api(endpoint=None):
        if endpoint in endpoints:
                return endpoints[endpoint]()
        else:
                return '{"error":"doesn\'t exist"}'

if __name__ == "__main__":
	app.run()
