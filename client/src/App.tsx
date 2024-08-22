import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";
import "regenerator-runtime/runtime";
import "./App.css";
import Layout from "./components/layout/layout";
import { studentRoutes, teacherRoutes, unloggedRoutes } from "./utils/routes.utils";
import { useUser } from "./contexts/user-context";
import { useMemo } from "react";
import { ThemeProvider } from '@mui/material/styles'; // Add this import
import CssBaseline from '@mui/material/CssBaseline'; // Add this import
import theme from './theme'; // Add this import

const App: React.FC = () => {
  const { userDetails } = useUser();
  
  const { router } = useMemo(() => {
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
  }, [userDetails]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} key={userDetails ? userDetails.id : 'logged-out'} />
    </ThemeProvider>
  );
};

export default App;