import React, { useState } from "react";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import "regenerator-runtime/runtime";
import "./App.css";
import Layout from "./components/layout/layout";
import {
  studentRoutes,
  teacherRoutes,
  unloggedRoutes,
} from "./utils/routes.utils";
import { useUser } from "./contexts/user-context";
import ChatComponent from './components/chatbot/ChatComponent';

const App: React.FC = () => {
  const login = true;
  const { userDetails } = useUser();
  let routes: RouteObject[] = [];

  const [currLesson, setCurrLesson] = useState<FormattedLesson>();
  // const defaultText = "מתי שחר הולכת לישון"
  // const defaultText = "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ.";

  const handleAudioRecorded = (lesson: FormattedLesson) => {
    setCurrLesson(lesson);
  };

  if (userDetails) {
    routes = [
      {
        path: "/",
        element: <Layout />,
        children:
          userDetails.type === "student" ? studentRoutes : teacherRoutes,
      },
    ];
  } else {
    routes = unloggedRoutes;
  }

  const router = createBrowserRouter(routes);

  return (
    <>
      <RouterProvider router={router} />
      <div>
        <ChatComponent />
      </div>
    </>
  );
};

export default App;
