import requests

name = 'naaaazda'
surname = 'nicedaaa22dsda'
id = '121231212123124812331111'

def post1():
    url = 'http://161.246.5.61:11614/students/newForm/?student_name=' + name + '&student_surname=' + surname + '&student_id=' + id
    requests.post(url)
    print('1 done')

def post2():
    url = 'http://161.246.5.61:11614/students/new/' + name + '/' + surname +'/' + id
    requests.post(url)
    print('2 done')

def post3():
    url = 'http://161.246.5.61:11614/students/new/'
    data = {
        "name": name,
        "surname": surname,
        "ID": id
    }
    requests.post(url,json=data)
    print('3 done')
   

def get1():
    url = 'http://161.246.5.61:11614/students/html'
    response = requests.get(url)
    if response.status_code == 200:
        print("1:",response.text)
    else:
        print('fail:',response.status_code)

def get2():
    find = '852'
    url = 'http://161.246.5.61:11614/students/html/' + find
    response = requests.get(url)
    if response.status_code == 200:
        print("2:",response.text)
    else:
        print('fail:',response.status_code)


get1()
get2()