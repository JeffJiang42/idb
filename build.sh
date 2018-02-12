#!/bin/bash
#Use this to build locally, will be at localhost
#run as sudo ./build.sh
docker build -t my_flask_app .
docker run  -d --restart=always -p 80:80 -t my_flask_app
