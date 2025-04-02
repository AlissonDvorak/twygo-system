# # configs para dev
# from pymongo import MongoClient
# import gridfs
# import os
# from dotenv import load_dotenv

# load_dotenv()

# MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
# DB_NAME = os.getenv("DB_NAME", "twygo")

# client = MongoClient(MONGO_URL)
# db = client[DB_NAME]
# fs = gridfs.GridFS(db)  

# def get_db():
    
#     return db, fs


from pymongo import MongoClient
import os
import gridfs
from dotenv import load_dotenv

load_dotenv(override=True)


def get_db():
    username = os.getenv("MONGO_INITDB_ROOT_USERNAME", os.getenv("MONGO_USERNAME"))
    password = os.getenv("MONGO_INITDB_ROOT_PASSWORD", os.getenv("MONGO_PASSWORD"))
    client = MongoClient(f"mongodb://{username}:{password}@mongodb:27018/")
    db = client["twygo"]
    fs = gridfs.GridFS(db)
    return db, fs

db, fs = get_db()