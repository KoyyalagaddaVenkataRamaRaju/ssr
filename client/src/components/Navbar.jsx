import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  const menuItems = [
    { title: "Home", link: "/" },
    {
      title: "About",
      dropdown: ["About Us", "Vision & Mission", "Chairman Message"],
    },
    {
      title: "Academics",
      dropdown: ["UG Programs", "PG Programs", "Departments", "Faculty"],
    },
    {
      title: "Admissions",
      dropdown: ["How to Apply", "Eligibility", "Fee Structure", "Scholarships"],
    },
    {
      title: "Research",
      dropdown: ["Research Centers", "Publications", "Projects"],
    },
    {
      title: "Placements",
      dropdown: ["Placement Cell", "Training", "Recruiters", "Records"],
    },
    {
      title: "Statutory",
      dropdown: ["IQAC", "NAAC", "NBA", "Committees"],
    },
    { title: "Contact Us", link: "/contact" },
  ];

  return (
    <>
      <style>
        {`
        /* ---------------- TOP BAR ---------------- */
        .top-bar {
          width: 100%;
          background: #7A54B1;
          color: white;
          padding: 6px 15px;
          font-size: 12px;
        }

        .top-bar-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 100%;
        }

        .top-left {
          display: flex;
          gap: 18px;
          align-items: center;
        }

        .top-right button {
          background: #fff;
          color: #7A54B1;
          border: none;
          padding: 5px 15px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .top-right button:hover {
          background: #f2f2f2;
        }

        @media(max-width: 600px) {
          .top-left span {
            display: none;
          }
        }

        /* ---------------- MAIN NAVBAR ---------------- */
        .navbar-ssr {
          width: 100%;
          padding: 8px 0;
          background: white;
          box-shadow: 0px 3px 8px rgba(0,0,0,0.08);
          position: sticky;
          top: 0;
          z-index: 999;
        }

        .nav-inner {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 12px !important;
        }

        /* LOGO */
        .brand-box {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .brand-circle {
          width: 45px;
          height: 45px;
          background: #7A54B1;
          color: white;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 22px;
          font-weight: 700;
        }

        .brand-title {
          font-size: 18px;
          margin: 0;
          font-weight: 700;
          color: #7A54B1;
        }

        .brand-sub {
          font-size: 11px;
          margin: 0;
          color: #555;
        }

        /* DESKTOP MENU */
        .nav-menu {
          display: flex;
          gap: 22px;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
        }

        .nav-item {
          position: relative;
        }

        .nav-link {
          text-decoration: none;
          font-size: 15px;
          color: #333;
          font-weight: 500;
          padding: 10px 0;
          cursor: pointer;
          transition: 0.3s;
        }

        .nav-link:hover {
          color: #7A54B1;
        }

        /* DROPDOWN */
        .dropdown-box {
          position: absolute;
          top: 115%;
          left: 0;
          width: 200px;
          background: white;
          border-radius: 6px;
          padding: 8px 0;
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
          transition: 0.3s ease;
          border-top: 3px solid #7A54B1;
          opacity: 0;
          visibility: hidden;
          transform: translateY(12px);
        }

        .dropdown-active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-link {
          display: block;
          padding: 10px 15px;
          font-size: 14px;
          color: #444;
          text-decoration: none;
        }

        .dropdown-link:hover {
          background: rgba(122,84,177,0.1);
          color: #7A54B1;
        }

        /* --------------- MOBILE --------------- */
        .mobile-toggle {
          display: none;
          font-size: 26px;
          color: #7A54B1;
          cursor: pointer;
        }

        @media (max-width: 992px) {
          .mobile-toggle {
            display: block;
          }

          .nav-menu {
            display: none;
            flex-direction: column;
            background: white;
            width: 100%;
            padding: 12px 0;
            box-shadow: 0 10px 25px rgba(0,0,0,0.12);
            border-radius: 0 0 8px 8px;
            margin-top: 10px;
          }

          .nav-menu.active {
            display: flex;
          }

          .nav-item {
            width: 100%;
            padding-left: 18px;
          }

          .dropdown-box {
            position: relative;
            box-shadow: none;
            width: 100%;
            border-top: none;
          }
        }
        `}
      </style>

      {/* ---------------- TOP BAR ---------------- */}
      <div className="top-bar">
        <div className="top-bar-inner">

          <div className="top-left">
            <span>📞 +91 98765 43210</span>
            <span>✉️ info@ssrcollege.edu</span>
          </div>

          <div className="top-right">
            <button>Apply Now</button> &nbsp;
            <button>Login</button>
          </div>

        </div>
      </div>

      {/* ---------------- MAIN NAVBAR ---------------- */}
      <div className="navbar-ssr">
        <div className="nav-inner">

          {/* LOGO */}
          <Link to="/" className="brand-box">
            <div className="brand-circle">S</div>
            <div>
              <p className="brand-title">SSR</p>
              <p className="brand-sub">Degree College</p>
            </div>
          </Link>

          {/* MOBILE ICON */}
          <div className="mobile-toggle" onClick={toggleMobileMenu}>☰</div>

          {/* MENU */}
          <ul className={`nav-menu ${mobileOpen ? "active" : ""}`}>
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="nav-item"
                onMouseEnter={() => setDropdownOpen(index)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <span className="nav-link">
                  {item.title} {item.dropdown && "▾"}
                </span>

                {item.dropdown && (
                  <div
                    className={`dropdown-box ${
                      dropdownOpen === index ? "dropdown-active" : ""
                    }`}
                  >
                    {item.dropdown.map((sub, sIndex) => (
                      <a key={sIndex} href="#" className="dropdown-link">
                        {sub}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

        </div>
      </div>
    </>
  );
};

export default Navbar;
