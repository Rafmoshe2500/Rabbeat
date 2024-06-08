import Home from "../pages/home";
import LessonView from "../pages/lesson-view";
import Login from "../pages/login";
import NotFound from "../pages/not-found";
import Profile from "../pages/profile";
import Register from "../pages/register";
import SelfTesting from "../pages/self-testing";
import StudentPersonalArea from "../pages/student-personal-area";
import TeacherPersonalArea from "../pages/teacher-personal-area";
import UploadLessonPage from "../pages/upload-lesson";

const baseRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
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
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

// routes = [
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "/login",
//         element: <Login />,
//       },
//       {
//         path: "/register",
//         element: <Register />,
//       },
//       {
//         path: "/profile",
//         element: <Profile />,
//       },
//       {
//         path: "/student-self-testing",
//         element: <SelfTesting />,
//       },
//       {
//         path: "/student-personal-area",
//         element: <StudentPersonalArea currLesson={currLesson} />,
//       },
//       {
//         path: "/teacher-personal-area",
//         element: <TeacherPersonalArea />,
//       },
//       {
//         path: "/lesson/:id",
//         element: <LessonView currLesson={currLesson} />,
//       },
//       {
//         path: "/upload-lesson",
//         element: <UploadLessonPage setCurrLesson={handleAudioRecorded} />,
//       },
//       {
//         path: "*",
//         element: <NotFound />,
//       },
//     ],
//   },
// ];
