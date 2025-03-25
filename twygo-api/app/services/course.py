from app.db.mongo import get_db
from app.models.course import Course
from bson import ObjectId
from datetime import datetime
from fastapi.encoders import jsonable_encoder

db, _ = get_db()  

def create_course(course_data: Course):
    course_dict = course_data.dict()
    result = db.courses.insert_one(course_dict)
    return str(result.inserted_id)

def objectid_to_str(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError("Object is not an ObjectId")

def get_active_courses():
    today = datetime.utcnow()
    courses = db.courses.find({"end_date": {"$gte": today}})
    # Convert ObjectId to string for serialization
    return [jsonable_encoder(course, custom_encoder={ObjectId: objectid_to_str}) for course in courses]

def get_course_by_id(course_id: str):
    return db.courses.find_one({"_id": ObjectId(course_id)})

def update_course(course_id: str, update_data: dict):
    return db.courses.update_one({"_id": ObjectId(course_id)}, {"$set": update_data})

def delete_course(course_id: str):
    return db.courses.delete_one({"_id": ObjectId(course_id)})