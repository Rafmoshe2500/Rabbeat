import bcrypt

from models.mongo import UserRegister, UserCredentials, User
from tools.utils import mongo_db


class RegisterWorkflow:
    def __init__(self, user: UserRegister):
        self.__user = user

    def _compare_password(self):
        return self.__user.password == self.__user.confirm_password

    def __hash_password(self) -> str:
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(self.__user.password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')

    def _add_cred_to_mongo(self, user_cred: UserCredentials):
        return mongo_db.add_user_cred(user_cred.dict())

    def _add_user_to_mongo(self, user: User):
        return mongo_db.add_user(user)

    def run(self):
        if self._compare_password():
            user_cred = UserCredentials(email=self.__user.email, password=self.__hash_password())
            user = User(**self.__user.dict(exclude={'password', 'confirm_password'}))
            if self._add_cred_to_mongo(user_cred):
                result = self._add_user_to_mongo(user)
                if result:
                    return result
                else:
                    mongo_db.remove_user_cred(user_cred)
        return None

# TODO Finish register user with credential table + user table
# TODO Login route check email and password in credential table and return user from user table
