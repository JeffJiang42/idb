#!/bin/bash
#Use this to restart locally, will be at localhost
#run as sudo ./restart.sh
git pull
docker kill $(docker ps -q)
docker build -t my_flask_app .
docker run  -d --restart=always -p 80:80 -t my_flask_app
