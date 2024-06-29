// type User = {
//   id: string;
//   name: string;
//   email: string;
//   type: "student" | "teacher";
//   // Add other user details as needed
// };

type User = {
  _id: string
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthDay: string;
  type: 'student' | 'teacher';
}

type UserRegister = Omit<User, '_id'> & {
  password: string;
  confirm_password: string;
}

type UserCredentials = {
  email: string;
  password: string;
}