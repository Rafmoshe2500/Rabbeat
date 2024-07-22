import Home from "../pages/home";
import LessonView from "../pages/lesson-view";
import NotFound from "../pages/not-found";
import Profile from "../pages/profile";
import StudentPersonalArea from "../pages/student-personal-area";
import TeacherPersonalArea from "../pages/teacher-personal-area";
import UploadLessonPage from "../pages/upload-lesson";
import TeacherSearch from "../pages/search";
import AuthForm from "../pages/auth";
import TeacherStudents from "../pages/teacher-students"

const commonRoutes = [
  {
    path: "/search",
    element: <TeacherSearch />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile/:id",
    element: <Profile />,
  },
];

const baseRoutes = [
  ...commonRoutes,
  {
    path: "/lesson/:id",
    element: <LessonView />,
  },
];

export const studentRoutes = [
  ...baseRoutes,
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
  {
    path: "/my-students",
    element: <TeacherStudents />
  }
];

export const unloggedRoutes = [
  ...commonRoutes,
  {
    path: "/login",
    element: <AuthForm />,
  },
  {
    path: "/register",
    element: <AuthForm />,
  },
  {
    path: "/auth",
    element: <AuthForm />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
