# MongoDB connection setup
from urllib.parse import quote_plus

MONGO_HOST = "10.10.248.125"
MONGO_PORT = "21771"
MONGO_USER = quote_plus("admin")
MONGO_PASSWORD = quote_plus("bartar20@CS")
MONGO_DB_NAME = "RabbeatDB"
MONGO_URI = f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB_NAME}?authSource=admin"

