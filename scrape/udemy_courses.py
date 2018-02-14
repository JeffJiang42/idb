import requests
import json
from bs4 import BeautifulSoup
import pandas as pd

def getUdemyDescription(url):
    '''
    Scrape the description not found in api
    Param:
        url - url of the udemy course
    Return:
        description - extracted headline
    '''
    # pretend we're not robots
    user_header = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:50.0) Gecko/20100101 Firefox/50.0'}
    url = 'http://udemy.com' + url
    req = requests.get(url,headers = user_header)
    soup = BeautifulSoup(req.text,'lxml')
    # steal the headline as description
    description = soup.body.find("div",class_ = "clp-lead__headline").text
    return description.strip()
    

def getUdemyInfo(entry,udemy_info):
    '''
    Given a course from Udemy API, extract info and save in dict
    Param:
        entry - json dict containing api information from udemy
        udemy_info - python dict containing aggregate information
    Return:
        null
    '''
    # should only see courses
    assert entry['_class'] == 'course'
    
    # get the information
    udemy_info['Course'].append(entry['title'])
    udemy_info['Price'].append(entry['price'])
    udemy_info['Link'].append(entry['url'])
    if len(entry['visible_instructors']) != 0:
        udemy_info['Instructor'].append(entry['visible_instructors'][0]['title'])
    udemy_info['Image'].append(entry['image_125_H'])
    udemy_info['Description'].append(getUdemyDescription(entry['url']))
    
if __name__ == "__main__":
    # max entries 100 / page
    url = "https://www.udemy.com/api-2.0/courses/?page=1&page_size=100"
    # data obtainable from api
    udemy_info = {
        'Course': [],
        'Price': [],
        'Description': [],
        'Instructor': [],
        'Link': [],
        'Image': []
    }
    # api key (don't steal please)
    headers = {"Authorization": "Basic ak9uRVliaFh1eHlKeFl4UXl0WTEzcm1MWHF5a01ldk96QldqNFZiTjpTZUtienJESFdyd3UyUEEzaWI3UDgwanBZYlVZd2pCMGdHcDZ2OGowVmVjNmdVc3dGd1NvRkxHWjZRYVVFZHI2NldHdnhKdzZTdDFzbkRWRzA0aU9wb0NvbDVFbkxORE1wQWNlRkJ1bnl2OUJxQ3Z6NmJtRWthbGplOGJIakNIYw==",
    "Accept": "application/json, text/plain, */*"}
    first = True
    while True:
        try:
            # progress
            print(url)
            # scrape and format for us to pass in
            r = requests.get(url,headers = headers)
            soup= BeautifulSoup(r.text,'lxml')
            url = json.loads(soup.body.p.text)['next']
            results = json.loads(soup.body.p.text)['results']
            # extract info
            for entry in results:
                getUdemyInfo(entry,udemy_info)
            # just use some data for IDB1
            if first:
                df = pd.DataFrame.from_dict(udemy_info)
                df.to_csv("udemy_courses_temp.csv")
                first = False
        except Exception as e:
            # uh oh
            print(e)
            break
    # save to csv
    df = pd.DataFrame.from_dict(udemy_info)
    df.to_csv("udemy_courses.csv")
            