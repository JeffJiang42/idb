import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='build')

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if(path == ""):
        return send_from_directory('build', 'index.html')
    else:
        if(os.path.exists("build/" + path)):
            return send_from_directory('build', path)
        else:
            return send_from_directory('build', 'index.html')


if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)
