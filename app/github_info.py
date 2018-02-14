import requests
import json

def getCommits():
    url = "https://api.github.com/repos/iambrandonchan/learning2earn/contributors"
    r = requests.get(url)

    if r.status_code == 200:
        #successful call

        jeff_commits = 0
        kurtis_commits = 0
        william_commits = 0
        brandon_commits = 0
        spencer_commits = 0

        info = r.json()
        for contributor in info:
            if contributor['login'] == 'JeffJiang42':
                jeff_commits = contributor['contributions']
            if contributor['login'] == 'kurtisdavid':
                kurtis_commits = contributor['contributions']
            if contributor['login'] == 'Acciaccatura':
                william_commits = contributor['contributions']
            if contributor['login'] == 'bchan565':
                brandon_commits = contributor['contributions']
            if contributor['login'] == 'spencerhuff':
                spencer_commits = contributor['contributions']

        return jeff_commits, kurtis_commits, william_commits, brandon_commits, spencer_commits
