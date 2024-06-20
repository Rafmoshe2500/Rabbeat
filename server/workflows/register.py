import bcrypt

from models.mongo import UserRegister, UserCredentials


class Register:
    def __init__(self, user: UserRegister):
        self.__user = user

    def _compare_password(self):
        return self.__user.password == self.__user.confirm_password

    def __hash_password(self) -> str:
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(self.__user.password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')

    def _add_cred_to_mongo(self):
        pass

    def _add_user_to_mongo(self):
        pass

    def register(self):
        if self._compare_password():
            user_cred = UserCredentials(email=self.__user.email, password=self.__hash_password())


