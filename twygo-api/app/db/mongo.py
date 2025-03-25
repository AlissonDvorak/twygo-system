from pymongo import MongoClient
import gridfs
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "twygo")

client = MongoClient(MONGO_URL)
db = client[DB_NAME]
fs = gridfs.GridFS(db)  

def get_db():
    
    return db, fs