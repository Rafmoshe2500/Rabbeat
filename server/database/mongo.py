from pymongo import ASCENDING, MongoClient
from pymongo.errors import ConnectionFailure

from tools.consts import MONGO_DB_NAME, MONGO_URI

try:
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB_NAME]
    # Create unique indexes
    db.users.create_index([("id", ASCENDING)], unique=True)
    db.users.create_index([("email", ASCENDING)], unique=True)
    print("Connected to MongoDB")
except ConnectionFailure:
    print("Failed to connect to MongoDB")