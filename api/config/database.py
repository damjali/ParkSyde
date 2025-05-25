# from pymongo import MongoClient

# import os
# from dotenv import load_dotenv

# load_dotenv()

# MONGO_URI = os.getenv("MONGO_URI")
# client = MongoClient(MONGO_URI)

# db = client.parksydedb

# cars_collection = db["cars"]
# users_collection = db["users"]

# db.cars.create_index("plateNumber", unique=True)
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

load_dotenv()
URL_DATABASE = os.getenv("URL_DATABASE")

engine = create_engine(URL_DATABASE)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()