import bcrypt

from models.mongo import UserRegister, UserCredentials, User, TeacherProfile
from tools.consts import DEFAULT_PROFILE
from tools.utils import mongo_db
from workflows.base import BaseWorkflow


class RegisterWorkflow(BaseWorkflow):
    def __init__(self, user: UserRegister):
        self.__user = user

    def _compare_password(self):
        return self.__user.password == self.__user.confirm_password

    def __hash_password(self) -> str:
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(self.__user.password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')

    def _add_cred_to_mongo(self, user_cred: UserCredentials):
        return mongo_db.add_user_cred(user_cred)

    def _add_user_to_mongo(self, user: User):
        profile = TeacherProfile(id=user.id, **DEFAULT_PROFILE)
        result = mongo_db.add_teacher_profile(profile)
        if result:
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
