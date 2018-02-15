import requests
import random

def recommend():
    global mylist
    mylist = None
    if not mylist:
        res = requests.get('https://raw.githubusercontent.com/nestor94/animender/master/data/anime.csv')
        mylist = res.text.split('\n')
    return '{"random_anime":"' + random.choice(mylist).split(',')[1] + '"}'
        
def nut():
    return '{"nut":1}'

endpoints = {
    'getnut': nut,
    'recommend': recommend
}
