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
  type: 'student' | 'teacher';
}

type UserRegister = User & {
  password: string;
  confirm_password: string;
}

type UserCredentials = {
  email: string;
  password: string;
}

type Recommendation = {
  studentId: string;
  text: string;
};

type teacherProfile = User & {
  image: string;
  aboutMe: string;
  versions: Array<string>;
  sampleIds: Array<string>;
  recommendations: Array<Recommendation>;
}

type updateProfile = {
  id: string;
  key: keyof teacherProfile;
  value: string | string[] | Recommendation[];
};

type Student = {
  firstName: string,
  lastName: string,
  phoneNumber: string,
}