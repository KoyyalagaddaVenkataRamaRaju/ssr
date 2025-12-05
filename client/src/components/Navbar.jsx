import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllDepartments } from "../services/departmentService";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [departments, setDepartments] = useState([]);

  const location = useLocation();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await getAllDepartments();
      setDepartments(res.data || []);
    } catch (error) {
      console.log("Error fetching departments:", error);
    }
  };

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
  const toggleMobileDropdown = (index) =>
    setMobileDropdown(mobileDropdown === index ? null : index);

  const menuItems = [
    { title: "Home", link: "/" },
    {
      title: "About",
      dropdown: ["About Us", "Vision & Mission", "Chairman Message"],
    },
    { title: "Departments", dynamic: true },
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
    { title: "Contact Us", link: "/contact" },
  ];

  const getRouteForDropdown = (main, sub) => {
    if (main === "About") {
      if (sub === "About Us") return "/about";
      if (sub === "Vision & Mission") return "/about/vision-mission";
      if (sub === "Chairman Message") return "/about/chairman-message";
    }
    return "#";
  };

  return (
    <>
      <style>{`
      body{
      overflow-x:hidden !important;
      }


        /* -------------------- ACTIVE STATE (DESKTOP) -------------------- */
        .active-link { color: #ff7b29 !important; font-weight: 600; }
        .active-dropdown { color: #ff7b29 !important; background: rgba(255,123,41,0.12); }

        /* -------------------- MOBILE ACTIVE STATES -------------------- */
        .active-mobile {
          color: #ff7b29 !important;
          font-weight: 700;
        }
        .mobile-subitem.active-mobile {
          color: #ff7b29 !important;
          background: rgba(255,123,41,0.12);
          font-weight: 600;
        }

        @media (max-width: 992px) {
          .mobile-toggle { display: block !important; }
          .nav-menu { display: none !important; }
          .top-bar { display: none !important; }
        }

        /* -------------------- MOBILE MENU OVERLAY -------------------- */
        .menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 2900;
          opacity: 0;
          pointer-events: none;
          transition: 0.3s ease;
        }
        .menu-overlay.show {
          opacity: 1;
          pointer-events: all;
        }

        /* -------------------- MOBILE SLIDE MENU -------------------- */
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 82%;
          max-width: 400px;
          background: #fff;
          transform: translateX(-100%);
          transition: transform .3s ease;
          padding: 20px;
          z-index: 3000;
          overflow-y: auto;
          box-shadow: 3px 0 18px rgba(0,0,0,0.2);
        }
        .mobile-menu.open { transform: translateX(0); }

        .mobile-header {
          display:flex;
          justify-content: space-between;
          align-items:center;
          margin-bottom:15px;
          padding-bottom:10px;
          border-bottom:1px solid #eee;
        }

        .mobile-close-btn {
          background:#7A54B1;
          color:white;
          border:none;
          padding:6px 12px;
          border-radius:6px;
          font-size:18px;
          cursor:pointer;
        }

        .mobile-item {
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:15px 0;
          border-bottom:1px solid #f0f0f0;
          font-size:17px;
          font-weight:600;
        }

        .mobile-submenu {
          background:#fafafa;
          border-radius:6px;
          margin-bottom:10px;
          overflow:hidden;
        }

        .mobile-subitem {
          padding:12px 16px;
          display:block;
          text-decoration:none;
          color:#444;
          border-bottom:1px solid #eee;
          font-size:15px;
        }

        .mobile-cta {
          display:flex;
          gap:10px;
          margin: 15px 0;
        }
        .mobile-cta-btn {
          flex:1;
          background:#7A54B1;
          color:white;
          padding:10px 0;
          border-radius:6px;
          text-align:center;
          font-size:15px;
          text-decoration:none;
        }
      `}</style>

      {/* TOP BAR */}
      <div
        className="top-bar"
        style={{
          background: "#7A54B1",
          color: "white",
          padding: "12px 15px",
          fontSize: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>📞 +91 98765 43210 | ✉️ info@ssrcollege.edu</span>

          <div>
            <Link to="/admission-form" style={{ background: "#fff", color: "#7A54B1", padding: "5px 15px", borderRadius: 4, textDecoration:"none" }}>
              Apply Now
            </Link>
            &nbsp;
            <Link to="/login" style={{ background: "#fff", color: "#7A54B1", padding: "5px 15px", borderRadius: 4, textDecoration:"none" }}>
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* DESKTOP NAVBAR */}
      <div
        className="navbar-ssr"
        style={{
          width: "100%",
          background: "white",
          padding: "8px 0",
          boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 999,
        }}
      >
        <div className="nav-inner"
          style={{ display: "flex", justifyContent: "space-between", padding: "0 12px" }}
        >
          {/* LOGO */}
          <Link to="/" style={{ display: "flex", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 45, height: 45, background: "#7A54B1", borderRadius: "50%",
              display: "flex", justifyContent: "center", alignItems: "center",
              color: "white", fontWeight: 700, fontSize: 22
            }}>S</div>

            <div>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#7A54B1" }}>SSR</p>
              <p style={{ margin: 0, fontSize: 11, color: "#555" }}>Degree College</p>
            </div>
          </Link>

          {/* MOBILE ICON */}
          <div
            className="mobile-toggle"
            onClick={toggleMobileMenu}
            style={{ display: "none", fontSize: 26, cursor: "pointer", color: "#7A54B1" }}
          >☰</div>

          {/* DESKTOP MENU */}
          <ul className="nav-menu" style={{ display: "flex", gap: 22 }}>
            {menuItems.map((item, index) => (
              <li key={index}
                onMouseEnter={() => setDropdownOpen(index)}
                onMouseLeave={() => setDropdownOpen(null)}
                style={{ position: "relative" }}
              >
                {item.link ? (
                  <Link
                    to={item.link}
                    className={`nav-link ${location.pathname === item.link ? "active-link" : ""}`}
                    style={{ textDecoration: "none", color: "#333" }}
                  >{item.title}</Link>
                ) : (
                  <span style={{ cursor: "pointer" }}>{item.title} ▾</span>
                )}

                {(item.dropdown || item.dynamic) && (
                  <div
                    style={{
                      position: "absolute",
                      top: "115%",
                      background: "white",
                      width: 220,
                      borderRadius: 6,
                      padding: "8px 0",
                      borderTop: "3px solid #7A54B1",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                      opacity: dropdownOpen === index ? 1 : 0,
                      visibility: dropdownOpen === index ? "visible" : "hidden",
                      transform: dropdownOpen === index ? "translateY(0)" : "translateY(12px)",
                      transition: "0.3s",
                    }}
                  >
                    {item.dropdown &&
                      item.dropdown.map((sub, sIdx) => {
                        const route = getRouteForDropdown(item.title, sub);
                        return (
                          <Link
                            key={sIdx}
                            to={route}
                            style={{
                              padding: "10px 15px",
                              display: "block",
                              textDecoration: "none",
                              color: "#333",
                            }}
                            className={`dropdown-link ${
                              location.pathname === route ? "active-dropdown" : ""
                            }`}
                          >
                            {sub}
                          </Link>
                        );
                      })}

                    {item.dynamic &&
                      departments.map((dep) => (
                        <Link
                          key={dep._id}
                          to={`/departments/${dep._id}`}
                          style={{
                            padding: "10px 15px",
                            display: "block",
                            textDecoration: "none",
                            color: "#333",
                          }}
                          className={`dropdown-link ${
                            location.pathname === `/departments/${dep._id}`
                              ? "active-dropdown"
                              : ""
                          }`}
                        >
                          {dep.departmentName}
                        </Link>
                      ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* OVERLAY */}
      <div
        className={`menu-overlay ${mobileOpen ? "show" : ""}`}
        onClick={() => setMobileOpen(false)}
      ></div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-header">
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{
              width: 42, height: 42, background: "#7A54B1",
              borderRadius: "50%", display: "flex", justifyContent: "center",
              alignItems: "center", color: "white", fontWeight: 700
            }}>S</div>

            <strong style={{ color: "#7A54B1" }}>SSR</strong>
          </div>

          <button className="mobile-close-btn" onClick={() => setMobileOpen(false)}>
            ✕
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="mobile-cta">
          <Link to="/apply" className="mobile-cta-btn" onClick={() => setMobileOpen(false)}>
            Apply Now
          </Link>
          <Link to="/login" className="mobile-cta-btn" onClick={() => setMobileOpen(false)}>
            Login
          </Link>
        </div>

        {/* MOBILE MENU LIST */}
        {menuItems.map((item, index) => {
          const mainActive =
            item.link && location.pathname === item.link ? "active-mobile" : "";

          return (
            <div key={index}>
              <div className="mobile-item">

                {item.link ? (
                  <Link
                    to={item.link}
                    onClick={() => setMobileOpen(false)}
                    className={mainActive}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <span>{item.title}</span>
                )}

                {(item.dropdown || item.dynamic) && (
                  <span
                    className="plus-icon"
                    onClick={() => toggleMobileDropdown(index)}
                  >
                    {mobileDropdown === index ? "–" : "+"}
                  </span>
                )}
              </div>

              {(item.dropdown || item.dynamic) && mobileDropdown === index && (
                <div className="mobile-submenu">

                  {/* Static submenu */}
                  {item.dropdown &&
                    item.dropdown.map((sub) => {
                      const route = getRouteForDropdown(item.title, sub);
                      return (
                        <Link
                          key={sub}
                          to={route}
                          onClick={() => setMobileOpen(false)}
                          className={`mobile-subitem ${
                            location.pathname === route ? "active-mobile" : ""
                          }`}
                        >
                          {sub}
                        </Link>
                      );
                    })}

                  {/* Dynamic Departments */}
                  {item.dynamic &&
                    departments.map((dep) => {
                      const depRoute = `/departments/${dep._id}`;
                      return (
                        <Link
                          key={dep._id}
                          to={depRoute}
                          onClick={() => setMobileOpen(false)}
                          className={`mobile-subitem ${
                            location.pathname === depRoute ? "active-mobile" : ""
                          }`}
                        >
                          {dep.departmentName}
                        </Link>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Navbar;
