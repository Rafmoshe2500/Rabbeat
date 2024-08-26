# MongoDB connection setup
from urllib.parse import quote_plus

import keyring

MONGO_HOST = "10.10.248.125"
MONGO_PORT = "21771"
MONGO_USER = quote_plus("admin")
MONGO_PASSWORD = quote_plus("bartar20@CS")
MONGO_DB_NAME = "RabbeatDB"
MONGO_URI = f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB_NAME}?authSource=admin"

TEXT_VARIANTS = ['both', 'none', 'nikud', 'teamim']
PROJECT_ID = keyring.get_password('key', 'google')
SECRET_KEY = keyring.get_password('jwt', 'key')
GOD = 'יהוה'


DEFAULT_PROFILE = {
    'image': '',
    'recommendations': [],
    'sampleIds': [],
    'versions': [],
    'aboutMe': ''
}

MB = 1024 * 1024