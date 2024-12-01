from fastapi import FastAPI, Request, Form, HTTPException, Cookie, Response
from fastapi.responses import HTMLResponse
from fastapi.responses import RedirectResponse
import ZODB, ZODB.FileStorage
import persistent
import transaction
import BTrees._OOBTree
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import re
import uuid

template = Jinja2Templates(directory="templates")

app = FastAPI()

storage = ZODB.FileStorage.FileStorage('mydata.fs')
db = ZODB.DB(storage)
connection = db.open()
root = connection.root

class Student(persistent.Persistent):
    def __init__(self, email, password, fullname):
        self.email = email
        self.password = password
        self.fullname = fullname

    def get_email(self):
        return self.email
    
    def get_password(self):
        return self.password
    
    def get_fullname(self):
        return self.fullname
    
    def login(self, password):
        return self.password == password

class Reservation(persistent.Persistent):
    def __init__(self, date, time_slot, name, phone):
        self.date = date
        self.time_slot = time_slot
        self.name = name
        self.phone = phone

    def get_details(self):
        return {"time_slot": self.time_slot, "name": self.name}

if not hasattr(root, 'reservations'):
    root.reservations = BTrees._OOBTree.BTree()
    transaction.commit()

if not hasattr(root, 'students'):
    root.students = BTrees._OOBTree.BTree()
    transaction.commit()

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/login", response_class=HTMLResponse)
async def get_login(request: Request):
    auth_token = request.cookies.get('auth_token')
    is_logged_in = auth_token is not None
    return template.TemplateResponse("login.html", {"request": request, "is_logged_in": is_logged_in})


@app.get("/register",response_class=HTMLResponse)
async def get_register(request:Request):
    token = request.query_params.get('token')
    is_logged_in = token is not None  
    return template.TemplateResponse("register.html", {"request": request, "is_logged_in": is_logged_in})


@app.get("/", response_class=HTMLResponse)
async def get_home(request: Request, auth_token: str = Cookie(None), guest_login: str = Cookie(None)):
    is_logged_in = auth_token is not None and guest_login is None
    return template.TemplateResponse("homepage.html", {"request": request, "is_logged_in": is_logged_in})



@app.get("/news",response_class=HTMLResponse)
async def get_news(request:Request, auth_token: str = Cookie(None)):
    is_logged_in = auth_token is not None 
    return template.TemplateResponse("news.html", {"request": request, "is_logged_in": is_logged_in})


@app.get("/news-detail-1",response_class=HTMLResponse)
async def get_news1(request:Request , auth_token: str = Cookie(None)):
    is_logged_in = auth_token is not None 
    return template.TemplateResponse("news-detail-1.html", {"request": request, "is_logged_in": is_logged_in})


@app.get("/news-detail-2",response_class=HTMLResponse)
async def get_news2(request:Request, auth_token: str = Cookie(None)):
    is_logged_in = auth_token is not None 
    return template.TemplateResponse("news-detail-2.html", {"request": request, "is_logged_in": is_logged_in})


@app.get("/news-detail-3",response_class=HTMLResponse)
async def get_news3(request:Request, auth_token: str = Cookie(None)):
    is_logged_in = auth_token is not None 
    return template.TemplateResponse("news-detail-3.html", {"request": request, "is_logged_in": is_logged_in})


@app.get("/news-detail-4",response_class=HTMLResponse)
async def get_news4(request:Request, auth_token: str = Cookie(None)):
   
    is_logged_in = auth_token is not None  
    return template.TemplateResponse("news-detail-4.html", {"request": request, "is_logged_in": is_logged_in})



@app.get("/curriculum", response_class=HTMLResponse)
async def get_curriculum(request: Request, auth_token: str = Cookie(None)):
    is_logged_in = auth_token is not None 
    return template.TemplateResponse("curriculum.html", {"request": request, "is_logged_in": is_logged_in})



@app.get("/reservepage", response_class=HTMLResponse)
async def get_reserve(request: Request, auth_token: str = Cookie(None)):
    is_logged_in = auth_token is not None 
    return template.TemplateResponse("reserve.html", {"request": request, "is_logged_in": is_logged_in})


@app.get("/addmission1",response_class=HTMLResponse)
async def get_curriculum(request:Request, auth_token: str = Cookie(None)):
    
    is_logged_in = auth_token is not None 
    return template.TemplateResponse("ad1.html", {"request": request, "is_logged_in": is_logged_in})


@app.get("/addmission2",response_class=HTMLResponse)
async def get_curriculum(request:Request, auth_token: str = Cookie(None)):
    is_logged_in = auth_token is not None 
    return template.TemplateResponse("ad2.html", {"request": request, "is_logged_in": is_logged_in})


@app.post("/reserve")
async def make_reservation(date: str = Form(...), time_slot: str = Form(...), name: str = Form(...), phone: str = Form(...)):
    new_reservation_id = str(uuid.uuid4())

    for reservation in root.reservations.values():
        if reservation.date == date and reservation.time_slot == time_slot:
            raise HTTPException(status_code=400, detail="This time slot is already booked.")

    new_reservation = Reservation(date, time_slot, name, phone)
    root.reservations[new_reservation_id] = new_reservation
    transaction.commit()

    return {"message": "Reservation successful"}



@app.get("/available-slots/{date}")
async def get_available_slots(date: str):
    all_slots = [f"{hour}:00 - {hour+2}:00" for hour in range(9, 21, 2)]
    reservations = [reservation.get_details() for reservation in root.reservations.values() if reservation.date == date]

    return {"available_slots": all_slots, "reservations": reservations}



@app.post("/login", response_class=HTMLResponse)
async def login(response: Response, request: Request, email: str = Form(...), password: str = Form(...)):
    student = root.students.get(email)
    if student and student.login(password):
        token = str(uuid.uuid4())
        response = RedirectResponse(url="/", status_code=303)
        response.set_cookie(key="auth_token", value=token, httponly=True)
        return response   

    return template.TemplateResponse("login.html", {
        "request": request,
        "error": "Incorrect email or password."
    })



@app.post("/register")
async def register(
    request: Request,
    fullname: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    confirm: str = Form(...)
):
    
    if not re.match(r'^(?=.*[A-Za-z])(?=.*\d).{8,}$', password):
        return template.TemplateResponse("register.html", {
        "request": request,
        "error": "Password must contain both letters and numbers and be at least 8 characters long."
    })



    if password != confirm:
            return template.TemplateResponse("register.html", {
            "request": request,
            "error": "The passwords do not match. Please try again."
        })


 
    if email in root.students:
        return template.TemplateResponse("register.html", {
            "request": request,
            "error": "Email is already registered."
        })

    student = Student(email, password, fullname)
    root.students[email] = student
    transaction.commit()

    response = RedirectResponse(url="/login", status_code=303)
    return response

@app.get("/logout")
async def logout(response: Response):
    response = RedirectResponse(url="/login", status_code=303)
    response.delete_cookie("auth_token")
    return response


@app.get("/guest-login")
async def guest_login(response: Response):
    return RedirectResponse(url="/", status_code=303)


@app.get("/about",response_class=HTMLResponse)
async def get_curriculum(request:Request):
    return template.TemplateResponse("about.html", {"request": request})
