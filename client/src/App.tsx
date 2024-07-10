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

const App: React.FC = () => {
  const { userDetails } = useUser();
  let routes: RouteObject[] = [];

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
    routes = [
      {
        path: "/",
        element: <Layout />,
        children: unloggedRoutes
      },
    ];
  }

  const router = createBrowserRouter(routes);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
