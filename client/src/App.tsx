import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";
import "regenerator-runtime/runtime";
import "./App.css";
import Layout from "./components/layout/layout";
import { studentRoutes, teacherRoutes, unloggedRoutes } from "./utils/routes.utils";
import { useUser } from "./contexts/user-context";
import { useMemo } from "react"; // Add this import

const App: React.FC = () => {
  const { userDetails } = useUser();
  
  // Use useMemo to create routes and router
  const { routes, router } = useMemo(() => {
    let routes: RouteObject[] = [];

    if (userDetails) {
      routes = [
        {
          path: "/",
          element: <Layout />,
          children: userDetails.type === "student" ? studentRoutes : teacherRoutes,
        },
      ];
    } else {
      routes = [
        {
          path: "/",
          element: <Layout />,
          children: unloggedRoutes,
        },
      ];
    }

    const router = createBrowserRouter(routes);
    return { routes, router };
  }, [userDetails]); // Dependency array includes userDetails

  return (
    <RouterProvider router={router} key={userDetails ? userDetails.id : 'logged-out'} />
  );
};

export default App;