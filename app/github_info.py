import requests
import json

def getCommits():
    url = "https://api.github.com/repos/JeffJiang42/idb/stats/contributors"
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
            info = r.json()
            for contributor in info:
                if contributor['author']['login'] == 'JeffJiang42':
                    jeff_commits = contributor['total']

                if contributor['author']['login'] == 'kurtisdavid':
                    kurtis_commits = contributor['total']

                if contributor['author']['login'] == 'Acciaccatura':
                    william_commits = contributor['total']

                if contributor['author']['login'] == 'bchan565':
                    brandon_commits = contributor['total']

                if contributor['author']['login'] == 'spencerhuff':
                    spencer_commits = contributor['total']

    total = jeff_commits + kurtis_commits + william_commits + brandon_commits + spencer_commits
    return jeff_commits, kurtis_commits, william_commits, brandon_commits, spencer_commits, total

def getIssues():
    url = "https://api.github.com/repos/JeffJiang42/idb/issues?state=all"
    r = requests.get(url)

    if r.status_code == 200:
        #successful call

        jeff_issues = 0
        kurtis_issues = 0
        william_issues = 0
        brandon_issues = 0
        spencer_issues = 0

        info = r.json()
        for issue in info:
            creator = issue['user']['login']
            if creator == 'JeffJiang42':
                jeff_issues += 1
            if creator == 'kurtisdavid':
                kurtis_issues += 1
            if creator == 'Acciaccatura':
                william_issues += 1
            if creator == 'iambrandonchan':
                brandon_issues = brandon_issues + 1
            if creator == 'spencerhuff':
                spencer_issues += 1
        total = jeff_issues + kurtis_issues + william_issues + brandon_issues + spencer_issues
        return jeff_issues, kurtis_issues, william_issues, brandon_issues, spencer_issues, total
