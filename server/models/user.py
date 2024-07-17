from pydantic import BaseModel, EmailStr


class User(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: EmailStr
    phoneNumber: str
    address: str
    birthDay: str
    type: str  # (student/teacher)


class UserRegister(User):
    password: str
    confirm_password: str


class UserCredentials(BaseModel):
    email: EmailStr
    password: str
