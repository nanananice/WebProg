from fastapi import FastAPI

# from pydantic import BaseModel

# class Person(BaseModel):
#     id: int 
#     name: str
#     surname:str

app = FastAPI()

students = {
    29 : { "ID": 29, "first_name": "Kazuha", "last_name": "Kaedehara" },
    30 : { "ID": 30, "first_name": "Albedo", "last_name": "Rhinedottir" },
}

@app.get("/students/all")
async def getallstudents():
    return students


@app.get("/students/{id}")
async def getstudentid(id: int):
    if id in students:
        return students[id]
    else:
        return {"error": "student not found"}


@app.post("/students/new/")
async def addstudent(newstudent: dict):
    if newstudent["ID"] in students:
        return {"error": "student already exist"}
    else:
        students[newstudent["ID"]] = newstudent
        return students
    

@app.post("/students/new/{name}/{surname}/{id}")
async def addstudent2(name: str, surname: str, id: int):
    if id in students:
        return {"error": "student already exist"}
    else:
        students[id] = {
            "ID": id,
            "first_name": name,
            "last_name": surname
        }
        return students
    
@app.post("/students/newForm")
async def addstudent3(student_id: int, first_name: str, last_name: str ):
    if student_id in students:
        return {"error": "student already exist"}
    else:
        students[student_id] = {
            "ID": student_id,
            "first_name": first_name,
            "last_name": last_name
        }
        return students