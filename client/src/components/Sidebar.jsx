import React, { useState } from "react";
import {
  GraduationCap,
  Home,
  Users,
  BookOpen,
  Calendar,
  FileText,
  Settings,
  UserPlus,
  PlusSquare,
  Image,
  CopySlash,
  BadgeDollarSign,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (onToggle) onToggle(next);
  };

  const getNavigationItems = () => {
    const commonItems = [
      { name: "Dashboard", icon: Home, path: `/${user?.role}/dashboard` },
    ];

    switch (user?.role) {
      case "principal":
        return [
          ...commonItems,
          { name: "Overview", icon: FileText, path: "#" },
          { name: "Staff Management", icon: Users, path: "#" },
          { name: "Reports", icon: FileText, path: "#" },
          { name: "Settings", icon: Settings, path: "#" },
        ];
      case "admin":
        return [
          ...commonItems,
          { name: "Register User", icon: UserPlus, path: "/admin/register-user" },
          { name: "Manage Users", icon: Users, path: "/admin/manage-users" },
          { name: "Register Department", icon: PlusSquare, path: "/admin/register-department" },
          { name: "Register Batches", icon: BookOpen, path: "/admin/batches" },
          { name: "Fees", icon: CopySlash, path: "/admin/fees" },
          { name: "Student Fee", icon: BadgeDollarSign, path: "/admin/studentfees" },
          { name: "HomeCarousel", icon: Image, path: "/admin/hero-carousel" },
          { name: "Recruiters", icon: Image, path: "/admin/recruiters" },
          { name: "Reports", icon: FileText, path: "/admin/reports" },
          { name: "Settings", icon: Settings, path: "#" },
          { name: "Attendance", icon: FileText, path: "/admin/attendance" },
        ];
      case "teacher":
        return [
          ...commonItems,
          { name: "My Classes", icon: BookOpen, path: "/teacher/classes" },
          { name: "Students", icon: Users, path: "/teacher/students" },
          { name: "Attendance", icon: Calendar, path: "/teacher/attendance/" },
          { name: "Attendance Reports", icon: Calendar, path: "/admin/reports" },
          {name:"Register student", icon: UserPlus, path: "/teacher/register-student"},
          { name: "Grades", icon: FileText, path: "#" },
          { name: "Profile", icon: GraduationCap, path: "/teacher/profile" },
        ];
      default:
        return commonItems;
    }
  };

  const navItems = getNavigationItems();

  return (
    <>
      <style>{`
        :root {
          --sidebar-width: 250px;
          --sidebar-collapsed: 80px;

          /* Material 3 Colors */
          --bg-main: #f1f5f9;
          --card-bg: #ffffff;
          --text-dark: #334155;
          --accent: #0ea5e9;
          --accent-light: #e0f7ff;
        }

        .sidebar-container {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: var(--sidebar-width);
          background: var(--bg-main);
          color: var(--text-dark);
          display: flex;
          flex-direction: column;
          transition: width 0.35s ease-in-out;
          z-index: 1050;
          box-shadow: 5px 0 25px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .sidebar-container.closed {
          width: var(--sidebar-collapsed);
        }

        /* HEADER */
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: var(--card-bg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .sidebar-header.closed {
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-logo {
          color: var(--accent);
        }

        .sidebar-title {
          font-weight: 700;
          font-size: 1.25rem;
          margin: 0;
        }

        .toggle-btn {
          background: var(--accent);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(14,165,233,0.35);
          transition: 0.2s;
        }

        .toggle-btn:hover {
          transform: scale(1.06);
          background: #0284c7;
        }

        /* NAVIGATION */
        .sidebar-scrollable {
          flex-grow: 1;
          padding: 10px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          margin-bottom: 10px;
          background: var(--card-bg);
          border-radius: 14px;
          font-weight: 600;
          text-decoration: none;
          color: var(--text-dark);
          box-shadow: 0 3px 12px rgba(0,0,0,0.06);
          transition: all 0.25s ease;
        }

        .nav-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 18px rgba(0,0,0,0.10);
        }

        /* UPDATED: ACTIVE STYLE — NO LEFT BORDER */
        .nav-item.active {
          background: var(--accent-light);
          color: var(--accent);
          box-shadow: 0 8px 20px rgba(14,165,233,0.18);
        }

        .nav-icon {
          min-width: 22px;
          color: var(--accent);
        }
      `}</style>

      <div className={`sidebar-container ${!isOpen ? "closed" : ""}`}>
        {/* HEADER */}
        <div className={`sidebar-header ${!isOpen ? "closed" : ""}`}>
          {isOpen ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <GraduationCap className="sidebar-logo" size={34} />
                <h2 className="sidebar-title">SSR</h2>
              </div>
              <button className="toggle-btn" onClick={toggleSidebar}>
                <X size={20} />
              </button>
            </>
          ) : (
            <>
              <button className="toggle-btn" onClick={toggleSidebar}>
                <Menu size={22} />
              </button>
              <GraduationCap className="sidebar-logo" size={32} />
            </>
          )}
        </div>

        {/* NAVIGATION */}
        <div className="sidebar-scrollable">
          <nav className="sidebar-nav">
            {navItems.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              >
                <item.icon className="nav-icon" size={20} />
                {isOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
