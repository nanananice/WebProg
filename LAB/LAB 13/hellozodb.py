import ZODB, ZODB.FileStorage
import transaction
import BTrees._OOBTree
from fastapi import FastAPI, Body
from fastapi import FastAPI, Request

app = FastAPI()

storage = ZODB.FileStorage.FileStorage('mydata.fs')
db = ZODB.DB(storage)
connection = db.open()
root = connection.root
root.students = BTrees._OOBTree.BTree()

@app.post("student/new/")
async def create_student(body = Body(...)):
    sid = int(body["ID"])
    root.students[sid] = body
    transaction.commit()
    return root.students[sid]

@app.on_event("shutdown")
def shutdown_event():
    db.close()
    storage.close
