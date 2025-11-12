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
      case 'principal':
        return [
          ...commonItems,
          { name: 'Overview', icon: FileText, path: '#' },
          { name: 'Staff Management', icon: Users, path: '#' },
          { name: 'Reports', icon: FileText, path: '#' },
          { name: 'Settings', icon: Settings, path: '#' },
        ];
      case 'admin':
        return [
          ...commonItems,
          { name: 'Register User', icon: UserPlus, path: '/admin/register-user' },
          { name: 'Manage Users', icon: Users, path: '/admin/manage-users' },
          { name: 'Register Department', icon: PlusSquare, path: '/admin/register-department' }, // Added Department Registration
          { name: 'Register Batches', icon: BookOpen, path: '/batches' },
          {name:'Fees',icon: CopySlash,path:'/admin/fees'},
          {name:'studentfee',icon:BadgeDollarSign,path:'/admin/studentfees'},
          {name:'HomeCarousel',icon:Image,path:'/admin/hero-carousel'},
          { name: 'Reports', icon: FileText, path: '#' },
          { name: 'Settings', icon: Settings, path: '#' },
           {name:'Attendance ',icon:FileText,path:'/teacher/attendance'}
        ];
      case 'teacher':
        const teacherItems = [
          ...commonItems,
          { name: 'My Classes', icon: BookOpen, path: '#' },
          { name: 'Students', icon: Users, path: '#' },
          { name: 'Attendance', icon: Calendar, path: '' },
          { name: 'Grades', icon: FileText, path: '#' },

    
        ];

      default:
        return commonItems;
    }
  };

  const navItems = getNavigationItems();

  return (
    <>
      <style>
        {`
        :root {
          --sidebar-width: 250px;
          --sidebar-collapsed: 80px;
        }

        /* ✅ FIXED FULL HEIGHT SIDEBAR */
        .sidebar-container {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: var(--sidebar-width);
          background: linear-gradient(180deg, #5e35b1, #1e88e5);
          color: white;
          display: flex;
          flex-direction: column;
          transition: width 0.4s ease-in-out;
          z-index: 1050;
          box-shadow: 4px 0 18px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }

        .sidebar-container.closed {
          width: var(--sidebar-collapsed);
        }

        /* Scroll only inner navigation */
        .sidebar-scrollable {
          flex-grow: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 4px;
        }

        .sidebar-scrollable::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-scrollable::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 6px;
        }

        .sidebar-scrollable::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        /* HEADER SECTION */
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .sidebar-header.closed {
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-bottom: none;
        }

        .sidebar-logo {
          color: #ffeb3b;
        }

        .sidebar-title {
          font-weight: 700;
          font-size: 1.3rem;
          margin: 0;
          transition: opacity 0.3s ease;
        }

        .sidebar-container.closed .sidebar-title {
          opacity: 0;
          pointer-events: none;
        }

        /* TOGGLE BUTTON */
        .toggle-btn {
          background: linear-gradient(135deg, #512da8, #1e88e5);
          border: none;
          color: #fff;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-btn:hover {
          background: #673ab7;
          transform: scale(1.05);
        }

        .sidebar-header.closed .toggle-btn {
          align-self: center;
          margin-bottom: 0.3rem;
        }

        /* NAVIGATION LINKS */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          padding: 0.3rem 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #f3f3f3;
          text-decoration: none;
          padding: 12px 14px;
          border-radius: 10px;
          transition: all 0.3s ease;
          margin-bottom: 6px;
          font-weight: 500;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(4px);
        }

        .nav-item.active {
          background: linear-gradient(90deg, #ffd54f, #ffb300);
          color: #222;
          font-weight: 600;
        }

        .nav-icon {
          min-width: 22px;
        }

        /* ✅ RESPONSIVE BEHAVIOR */
        @media (max-width: 992px) {
          .sidebar-container {
            width: var(--sidebar-collapsed);
          }

          .sidebar-container.open {
            width: var(--sidebar-width);
          }
        }
        `}
      </style>

      <div className={`sidebar-container ${!isOpen ? "closed" : ""}`}>
        {/* HEADER */}
        <div className={`sidebar-header ${!isOpen ? "closed" : ""}`}>
          {isOpen ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <GraduationCap className="sidebar-logo" size={35} />
                <h2 className="sidebar-title">SSR</h2>
              </div>
              <button className="toggle-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                <X size={20} />
              </button>
            </>
          ) : (
            <>
              <button className="toggle-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                <Menu size={22} />
              </button>
              <GraduationCap className="sidebar-logo" size={34} />
            </>
          )}
        </div>

        {/* SCROLLABLE NAVIGATION */}
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
