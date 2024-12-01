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

    def __str__(self):
        return "ID: %8s Course Name: %s, Credit %d" % (str(self.id), self.name, self.credit)
    
    def getCredit(self):
        return self.credit
    
    def setName(self, name):
        self.name = name

    def printDetail(self):
        print(self.__str__())

class Student(persistent.Persistent):
    def __init__(self, id, name = ""):
        self.enrolls = []
        self.id = id
        self.name = name
        
    def enrollCourse(self, course ,grade):
        enroll = Enrollment(course, grade ,self)
        self.enrolls.append(enroll)

    def getEnrollment(self, course):
        if course in self.enrolls:
            return course
        else:
            return None
        
    
    def printTranscript(self):
        print("\t Transcript\n")
        print(f"ID:\t{self.id} Name: {self.name}\n")
        print("Course list\n")
        score = 0
        credit = 0
        for course in self.enrolls:
            course.printDetail()
            print()
            credit += course.course.credit
            if course.grade == "A":
                score += 4 * course.course.credit
            if course.grade == "B+":
                score += 3.5 * course.course.credit
            if course.grade == "B":
                score += 3 * course.course.credit
            if course.grade == "C+":
                score += 2.5 * course.course.credit
            if course.grade == "C":
                score += 2 * course.course.credit
            if course.grade == "D+":
                score += 1.5 * course.course.credit
            if course.grade == "D":
                score += 1 * course.course.credit
            if course.grade == "F":
                score += 0 * course.course.credit
        gpa = score/credit
        course.setGrade(gpa)
        print(f"GPA: {gpa}")

        
    
    def setName(self, name):
        self.name = name
        

class Enrollment(persistent.Persistent):
    def __init__(self, course, grade,student):
        self.course = course
        self.grade = grade
        self.student = student
    
    def getCourse(self):
        return self.course

    def getGrade(self):
        return self.grade

    def getCourse(self):
        return self.course

    def printDetail(self):
        print(f"ID\t{self.course.id}  Course:{self.course.name}, Credit {self.course.credit}  Grade:  {self.grade}")

    def setGrade(self,grade):
        self.grade = grade

root.courses = BTrees.OOBTree.BTree()
root.courses[101] = Course(101,"Computer Programming",4)
root.courses[201] = Course(201,"Web Programming",4)
root.courses[202] = Course(202,"Software Engineering Principle",5)
root.courses[301] = Course(301,"Artificial Intelligent",3)

comProg = root.courses[101]
webProg = root.courses[201]
software = root.courses[202]
ai = root.courses[301]

root.students = BTrees.OOBTree.BTree()
root.students[1101] = Student(1101,"Mr. Christian de Neuvillette")
root.students[1102] = Student(1102,"Mr. Zhong li")
root.students[1103] = Student(1103,"Mr. Dvalinn Durinson")

christian = root.students[1101]
christian.enrollCourse(comProg,"B")
christian.enrollCourse(webProg,"B")
christian.enrollCourse(ai,"C")

zhong = root.students[1102]
zhong.enrollCourse(comProg,"A")
zhong.enrollCourse(webProg,"B")
zhong.enrollCourse(software,"D")

dvalinn = root.students[1103]
dvalinn.enrollCourse(comProg,"C")
dvalinn.enrollCourse(webProg,"A")
dvalinn.enrollCourse(software,"B")
dvalinn.enrollCourse(ai,"C")

transaction.commit()


if __name__ == "__main__":
    courses = root.courses
    for c in courses:
        course = courses[c]
        course.printDetail()
    print()

    students = root.students
    for s in students:
        student = students[s]
        student.printTranscript()
        print()