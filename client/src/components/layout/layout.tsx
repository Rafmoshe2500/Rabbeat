// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/navbar";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
