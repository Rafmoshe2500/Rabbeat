import bcrypt

from models.user import UserCredentials
from database.mongo import mongo_db
from workflows.base import BaseWorkflow


class LoginWorkflow(BaseWorkflow):

    def __init__(self, user_cred: UserCredentials):
        self.__user_cred = user_cred

    def __get_user_credentials(self):
        return mongo_db.get_user_cred_by_email(self.__user_cred.email)

    def __check_password(self, hashed_password) -> bool:
        return bcrypt.checkpw(self.__user_cred.password.encode('utf-8'), hashed_password.encode('utf-8'))

    def __get_user_details(self):
        return mongo_db.get_user_by_email(self.__user_cred.email)

    def run(self):
        user_cred = self.__get_user_credentials()
        if self.__check_password(user_cred['password']):
            return self.__get_user_details()
        return None
