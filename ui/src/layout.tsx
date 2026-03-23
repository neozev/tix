import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";

export default function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}