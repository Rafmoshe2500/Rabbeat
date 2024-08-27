// type User = {
//   id: string;
//   name: string;
//   email: string;
//   type: "student" | "teacher";
//   // Add other user details as needed
// };

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthDay: string;
  type: "student" | "teacher";
};

type UserRegister = User & {
  password: string;
  confirm_password: string;
};

type UserCredentials = {
  email: string;
  password: string;
};

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  expired_date: string;
  updated: boolean;
};


type AssociateNewStudent = {
  studentId: string;
  teacherId: string;
  expired_date: string;
}

type SearchStudent = {
  id: string;
  name: string;
  email: string;
}