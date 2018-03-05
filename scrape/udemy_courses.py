import requests
import json
from bs4 import BeautifulSoup
import pandas as pd

# api key (don't steal please)
headers = {"Authorization": "Basic ak9uRVliaFh1eHlKeFl4UXl0WTEzcm1MWHF5a01ldk96QldqNFZiTjpTZUtienJESFdyd3UyUEEzaWI3UDgwanBZYlVZd2pCMGdHcDZ2OGowVmVjNmdVc3dGd1NvRkxHWjZRYVVFZHI2NldHdnhKdzZTdDFzbkRWRzA0aU9wb0NvbDVFbkxORE1wQWNlRkJ1bnl2OUJxQ3Z6NmJtRWthbGplOGJIakNIYw==",
"Accept": "application/json, text/plain, */*"}
course_fields = "?fields[course]=headline,avg_rating,primary_category,primary_subcategory"

def getUdemyCourse(id_):
    '''
    Scrape specific course info from api
    Param:
        id_ - unique pk of udemy course
    Return:
        info - dict containing additional info from api
        success - tell if something happened
    '''
    url = "https://www.udemy.com/api-2.0/courses/" + str(id_) + course_fields
    r = requests.get(url,headers = headers)
    soup = BeautifulSoup(r.text,'lxml')
    info = json.loads(soup.body.p.text)
    success = True
    try:
        info['primary_category_id'] = info['primary_category']['id']
        info['primary_category'] = info['primary_category']['title']
        info['primary_subcategory_id'] = info['primary_subcategory']['id']
        info['primary_subcategory'] = info['primary_subcategory']['title']
    except:
        success = False
    return info, success
    

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

    norms = ['Course','Price','Link','Instructor','Image']
    
    # get the information
    udemy_info['Course'].append(entry['title'])
    udemy_info['Price'].append(entry['price'])
    udemy_info['Link'].append(entry['url'])
    if len(entry['visible_instructors']) != 0:
        udemy_info['Instructor'].append(entry['visible_instructors'][0]['title'])
    udemy_info['Image'].append(entry['image_125_H'])
    info, success = getUdemyCourse(entry['id'])
    if success:
        udemy_info['Description'].append(info['headline'])
        udemy_info['Rating'].append(info['avg_rating'])
        udemy_info['PrimaryCategory'].append(info['primary_category'])
        udemy_info['PrimaryCategoryID'].append(info['primary_category_id'])
        udemy_info['PrimarySubcategory'].append(info['primary_subcategory'])
        udemy_info['PrimarySubcategoryID'].append(info['primary_subcategory_id'])
    else:
        # incomplete info so skip this course
        for key in norms:
            del udemy_info[key][-1]

    
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
        'Image': [],
        'Rating': [],
        'PrimaryCategory': [],
        'PrimaryCategoryID': [],
        'PrimarySubcategory': [],
        'PrimarySubcategoryID': []
    }
    it = 1
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
            # save occasionally
            if it % 10 == 0:
                df = pd.DataFrame.from_dict(udemy_info)
                df.to_csv("udemy_courses_temp2.csv")
            it += 1
        except Exception as e:
            # uh oh
            print(e)
            break
    # save to csv
    df = pd.DataFrame.from_dict(udemy_info)
    df.to_csv("udemy_courses.csv")