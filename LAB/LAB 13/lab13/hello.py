from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
template = Jinja2Templates(directory="html")
import starlette.status as status
import ZODB, ZODB.FileStorage
import persistent
import transaction
import BTrees._OOBTree

storage = ZODB.FileStorage.FileStorage('mydata.fs')
db = ZODB.DB(storage)
connection = db.open()
root = connection.root

class Course(persistent.Persistent):
    def __init__(self, id, name = "", credit = 0):
        self.credit = credit
        self.id = id
        self.name = name
        self._gradeScheme = [
        ]

    def setGradeScheme(self, scheme):
        self._gradeScheme = scheme

    def scoreGrading(self, score):
        for grade_range in self.gradeScheme:
            if grade_range["min"] <= score <= grade_range["max"]:
                return grade_range["Grade"]
        return "F"

    def setGradeScheme(self, scheme):
        for grade_range in scheme:
            if "Grade" in grade_range and "min" in grade_range and "max" in grade_range:
                if grade_range["min"] <= grade_range["max"]:
                    self.gradeScheme = scheme
                    return
                else:
                    print("Invalid grade range: min should be less than or equal to max")
                    return
            else:
                print("Invalid grade scheme format")
                return
    
    def getCredit(self):
        return self.credit
    
    def setName(self, name):
        self.name = name

    def __str__(self):
        return "ID: %8s    Course Name: %-30s,  Credit %d" % (str(self.id), self.name.ljust(30), self.credit)
    
    def printDetail(self):
        print(self.__str__())

class Student(persistent.Persistent):
    def __init__(self, id, password, name=""):
        self.enrolls = []
        self.id = id
        self.password = password
        self.name = name

    def enrollCourse(self, course, score = 0):
        enroll = Enrollment(course, self, score)
        self.enrolls.append(enroll)

    def getEnrollment(self, course):
        if course in self.enrolls:
            return course
        else:
            return None
        
    def printTranscript(self):
        print("\tTranscript")
        print(f"ID:\t{self.id} Name: {self.name}")
        print("Course list")
        score = 0
        credit = 0
        for enrollment in self.enrolls:
            course = enrollment.course
            grade = enrollment.getGrade()
            print("\tID: %8s   Course: %-30s, Credit %2d,  Score: %3d   Grade: %3s" % (course.id, course.name[:30], course.credit, enrollment.score, grade))
            credit += course.credit
            if grade == "A":
                score += 4 * course.credit
            elif grade == "B":
                score += 3 * course.credit
            elif grade == "C":
                score += 2 * course.credit
            elif grade == "D":
                score += 1 * course.credit
            elif grade == "F":
                score += 0 * course.credit
        gpa = score / credit if credit != 0 else 0
        print(f"Total GPA is: {gpa:.2f}")

    def setName(self, name):
        self.name = name


class Enrollment(persistent.Persistent):
    def __init__(self, course, student, score):
        self.course = course
        self.grade = ""
        self.student = student
        self.score = score

    def getCourse(self):
        return self.course

    def setScore(self, score):
        self.score = score

    def getGrade(self):
        for grade_range in self.course.gradeScheme:
            if grade_range["min"] <= self.score <= grade_range["max"]:
                self.grade = grade_range["Grade"]
                return grade_range["Grade"]
        return "F"

    def getScore(self):
        return self.score

    def printDetail(self):
        print(f"ID\t{self.course.id}  Course:{self.course.name}, Credit {self.course.credit}  Grade:  {self.grade}")


root.courses = BTrees.OOBTree.BTree()
root.courses[101] = Course(101,"Computer Programming",4)
root.courses[201] = Course(201,"Web Programming",4)
root.courses[202] = Course(202,"Software Engineering Principle",5)
root.courses[301] = Course(301,"Artificial Intelligent",3)
    
comProg = root.courses[101]
comProg.setGradeScheme([
    {"Grade": "A", "min": 85, "max": 100},
    {"Grade": "B", "min": 75, "max": 84},
    {"Grade": "C", "min": 65, "max": 74},
    {"Grade": "D", "min": 55, "max": 64},
    {"Grade": "F", "min": 0, "max": 54}
])

webProg = root.courses[201]
webProg.setGradeScheme([
    {"Grade": "A", "min": 80, "max": 100},
    {"Grade": "B", "min": 70, "max": 79},
    {"Grade": "C", "min": 60, "max": 69},
    {"Grade": "D", "min": 50, "max": 59},
    {"Grade": "F", "min": 0, "max": 49}
])
software = root.courses[202]
software.setGradeScheme([
    {"Grade": "A", "min": 90, "max": 100},
    {"Grade": "B", "min": 80, "max": 89},
    {"Grade": "C", "min": 70, "max": 79},
    {"Grade": "D", "min": 60, "max": 69},
    {"Grade": "F", "min": 0, "max": 59}
])
ai = root.courses[301]
ai.setGradeScheme([
    {"Grade": "A", "min": 75, "max": 100},
    {"Grade": "B", "min": 65, "max": 74},
    {"Grade": "C", "min": 55, "max": 64},
    {"Grade": "D", "min": 45, "max": 54},
    {"Grade": "F", "min": 0, "max": 44}
])
root.students = BTrees.OOBTree.BTree()
root.students[1614] = Student(1614, "nice","Mr. Nice Na Nice")
Nice= root.students[1614]
Nice.enrollCourse(comProg)
Nice.enrollCourse(webProg)
Nice.enrollCourse(software)
Nice.enrollCourse(ai)
transaction.commit()

app = FastAPI()

@app.get("/", response_class=HTMLResponse)
async def loginpage():
    html_content = """
    <!DOCTYPE html>
        <html>
            <body>
                <form action="/login" method="post">
                    <h1>ID:</h1>
                    <label for="id"></label>
                    <input type="text" id="id" name="id">
                    <h1>Password:</h1>
                    <label for="password"></label>
                    <input type="password" id="password" name="password"><br><br>
                    <input type="submit" value="Submit">
                </form>
            </body>
        </html>
    """
    return HTMLResponse(content=html_content)

@app.post("/login", response_class=HTMLResponse)
async def logindone(id: str = Form(...), password: str = Form(...)):
    student = root.students.get(int(id))
    if student and student.password == password:
        redirect_url = "/form"
        return RedirectResponse(url=redirect_url,status_code=status.HTTP_302_FOUND)
    else:
        html_content = """
        <!DOCTYPE html>
            <html>
                <body>
                    <h1>Login</h1>
                    <form action="/login" method="post">
                        <h1>ID:</h1>
                        <label for="id"></label>
                        <input type="text" id="id" name="id">
                        <h1>Password:</h1>
                        <label for="password"></label>
                        <input type="password" id="password" name="password"><br><br>
                        <input type="submit" value="Submit">
                        <p style="color:red;">Invalid ID or password. Please try again.</p>
                    </form>
                </body>
            </html>
        """
        return html_content

@app.get("/form", response_class=HTMLResponse)
async def form(request:Request):
    student = root.students.get(1614)
    if student:
        student_info = {
            "id": student.id,
            "name": student.name,
            "enrolled_courses": [{"course_id": e.course.id, "course_name": e.course.name, "credit": e.course.credit} for e in student.enrolls]
        }
    else:
        student_info = {}
    return template.TemplateResponse("form.html", {"request": request, "student": student_info})
