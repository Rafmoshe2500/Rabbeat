import Home from "../pages/home";
import StudentLessonView from "../pages/student-lesson-view";
import NotFound from "../pages/not-found";
import Profile from "../pages/profile";
import StudentPersonalArea from "../pages/student-personal-area";
import TeacherPersonalArea from "../pages/teacher-personal-area";
import UploadLessonPage from "../pages/upload-lesson";
import TeacherSearch from "../pages/search";
import AuthForm from "../pages/auth";
import TeacherStudents from "../pages/teacher-students";
import MyStudentLessons from "../pages/my-students-lessons";
import MyStudentLesson from "../pages/my-student-lesson";
import TeacherLessonView from "../pages/teacher-lesson-view";

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
    element: <StudentLessonView />,
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
    path: "/teacher-personal-area/lesson/:id",
    element: <TeacherLessonView />,
  },
  {
    path: "/upload-lesson",
    element: <UploadLessonPage />,
  },
  {
    path: "/my-students",
    element: <TeacherStudents />,
  },
  {
    path: "/my-students/:id",
    element: <MyStudentLessons />,
  },
  {
    path: "/my-students/:userName/lessons/:lessonId",
    element: <MyStudentLesson />,
  },
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
