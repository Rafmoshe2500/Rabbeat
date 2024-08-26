from database.mongo import mongo_db
from models.profile import UpdateProfile

users = mongo_db.get_all_users()
for user in users:
    date = user['birthDay']
    if len(date.split('-')[0]) == 2:
        print(user['firstName'])
        d = date.split('-')
        new_d = '-'.join(reversed(d))
        mongo_db.update_user(user['id'], UpdateProfile(key='birthDay', value=new_d))
