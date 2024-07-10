import Home from "../pages/home";
import LessonView from "../pages/lesson-view";
import NotFound from "../pages/not-found";
import Profile from "../pages/profile";
import SelfTesting from "../pages/self-testing";
import StudentPersonalArea from "../pages/student-personal-area";
import TeacherPersonalArea from "../pages/teacher-personal-area";
import UploadLessonPage from "../pages/upload-lesson";
import AuthForm from "../pages/auth"

const baseRoutes = [
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile/:id",
    element: <Profile />,
  },
  {
    path: "/lesson/:id",
    element: <LessonView />,
  },
];

export const studentRoutes = [
  ...baseRoutes,
  {
    path: "/student-self-testing",
    element: <SelfTesting />,
  },
  {
    path: "/student-personal-area",
    element: <StudentPersonalArea />,
  },
];

export const teacherRoutes = [
  ...baseRoutes,
  {
    path: "/teacher-personal-area",
    element: <TeacherPersonalArea />,
  },
  {
    path: "/upload-lesson",
    element: <UploadLessonPage />,
  },
];

export const unloggedRoutes = [
  {
    path: "/login",
    element: <AuthForm />
  },
  {
    path: "/register",
    element: <AuthForm />
  },
  {
    path: "/auth",
    element: <AuthForm />
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
