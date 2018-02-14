import requests
import json
from bs4 import BeautifulSoup
import pandas as pd

def getUdemyDescription(url):
    user_header = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:50.0) Gecko/20100101 Firefox/50.0'}
    url = 'http://udemy.com' + url
    req = requests.get(url,headers = user_header)
    soup = BeautifulSoup(req.text,'lxml')
    
    description = soup.body.find("div",class_ = "clp-lead__headline").text
    return description.strip()
    

def getUdemyInfo(entry,udemy_info):
    assert entry['_class'] == 'course'
    
    udemy_info['Course'].append(entry['title'])
    udemy_info['Price'].append(entry['price'])
    udemy_info['Link'].append(entry['url'])
    if len(entry['visible_instructors']) != 0:
        udemy_info['Instructor'].append(entry['visible_instructors'][0]['title'])
    udemy_info['Image'].append(entry['image_125_H'])
    udemy_info['Description'].append(getUdemyDescription(entry['url']))
    
if __name__ == "__main__":
    url = "https://www.udemy.com/api-2.0/courses/"
    udemy_info = {
        'Course': [],
        'Price': [],
        'Description': [],
        'Instructor': [],
        'Link': [],
        'Image': []
    }
    while True:
        try:
            r = requests.get(url,headers = headers)
            soup= BeautifulSoup(r.text,'lxml')
            url = json.loads(soup.body.p.text)['next']
            results = json.loads(soup.body.p.text)['results']
            for entry in results:
                getUdemyInfo(entry,udemy_info)
        except Exception as e:
            break
    
    df = pd.DataFrame.from_dict(udemy_info)
    df.DataFrame.to_csv("udemy_courses.csv")
            