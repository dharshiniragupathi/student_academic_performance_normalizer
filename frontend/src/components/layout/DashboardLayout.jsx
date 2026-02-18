import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import logoImage from "../../assets/logo.png";
import "./layout.css";

function DashboardLayout() {
  const role = localStorage.getItem("role");
  const roleLabel =
    role === "admin"
      ? "Admin Panel"
      : role === "staff"
        ? "Staff Panel"
        : role === "student"
          ? "Student Panel"
          : "Dashboard";

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-content">
        <header className="dashboard-topbar">
          <div className="topbar-brand-wrap">
            <img src={logoImage} alt="SPN Logo" className="topbar-logo" />
            <span className="topbar-brand">Student Performance Normalizer</span>
          </div>
          <span className="topbar-role">{roleLabel}</span>
        </header>
        <div className="dashboard-page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
