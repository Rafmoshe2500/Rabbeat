# Helper function to convert ObjectId to string
from database.mongo import MongoDBApi
from tools.consts import MONGO_URI, MONGO_DB_NAME


def object_id_str(obj):
    return {**obj, "_id": str(obj["_id"])}


mongo_db = MongoDBApi(MONGO_DB_NAME, MONGO_URI)
