import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  const location = useLocation();

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
  const toggleMobileDropdown = (index) =>
    setMobileDropdown(mobileDropdown === index ? null : index);

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
        .active-link {
          color: #ff7b29 !important;
          font-weight: 600;
        }
        .active-dropdown {
          color: #ff7b29 !important;
          background: rgba(255, 123, 41, 0.12);
        }

        .mobile-menu .active-link {
          color: #ff7b29 !important;
        }

        @media (max-width: 992px) {
          .mobile-toggle {
            display: block !important;
          }
          .nav-menu {
            display: none !important;
          }
          .top-bar {
            display: none !important;
          }
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 85%;
          max-width: 420px;
          background: #fff;
          transform: translateX(-100%);
          transition: transform 0.28s ease;
          padding: 20px;
          overflow-y: auto;
          z-index: 3000;
          box-shadow: 2px 0 20px rgba(0,0,0,0.12);
        }
        .mobile-menu.open {
          transform: translateX(0);
        }

        .mobile-item {
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:14px 0;
          font-size:17px;
          font-weight:600;
          border-bottom:1px solid #eee;
        }

        .mobile-cta {
          margin-top: 12px;
          display: flex;
          gap: 10px;
        }

        .mobile-cta-btn {
          flex: 1;
          background:#7A54B1;
          color:white;
          border:none;
          padding:8px 0;
          border-radius:6px;
          font-size:15px;
          text-align:center;
          cursor:pointer;
          text-decoration:none;
          display:block;
        }

        .mobile-cta-btn:hover {
          background:#643e94;
        }

        .plus-icon { font-size:20px; color:#7A54B1; cursor:pointer; }
        .mobile-submenu { background:#fafafa; }
        .mobile-subitem {
          padding:12px 0 12px 16px;
          border-bottom:1px solid #e8e8e8;
          font-size:15px;
          text-decoration:none;
          display:block;
          color:#333;
        }
      `}</style>

      {/* TOP BAR */}
      <div
        className="top-bar"
        style={{
          background: "#7A54B1",
          color: "white",
          padding: "12px 15px",
          fontSize: "12px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 18 }}>
            <span>📞 +91 98765 43210</span>
            <span>✉️ info@ssrcollege.edu</span>
          </div>

          <div>
            <Link to="/apply" style={{ background: "#fff", color: "#7A54B1", padding: "5px 15px", borderRadius: 4, textDecoration:"none" }}>
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
        <div className="nav-inner" style={{ display: "flex", justifyContent: "space-between", padding: "0 12px" }}>
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

          <div className="mobile-toggle"
            onClick={toggleMobileMenu}
            style={{ display: "none", fontSize: 26, cursor: "pointer", color: "#7A54B1" }}
          >
            ☰
          </div>

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
                  >
                    {item.title}
                  </Link>
                ) : (
                  <span>{item.title} ▾</span>
                )}

                {item.dropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "115%",
                      background: "white",
                      width: 200,
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
                    {item.dropdown.map((sub, sIdx) => {
                      const route = getRouteForDropdown(item.title, sub);
                      return (
                        <Link
                          key={sIdx}
                          to={route}
                          className={`dropdown-link ${location.pathname === route ? "active-dropdown" : ""}`}
                          style={{ padding: "10px 15px", display: "block", textDecoration: "none", color: "#333" }}
                        >
                          {sub}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---------- MOBILE SLIDE MENU ---------- */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>

        {/* MOBILE HEADER */}
        <div className="mobile-header">
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{
              width: 42,
              height: 42,
              background: "#7A54B1",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontWeight: 700
            }}>S</div>

            <strong style={{ color: "#7A54B1" }}>SSR</strong>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            style={{ background: "#7A54B1", color: "white", padding: "6px 10px", borderRadius: 4, border: "none" }}
          >
            ✕
          </button>
        </div>

        {/* MOBILE TOP CONTACT */}
        <div className="mobile-top-info">
          📞 +91 98765 43210 <br />
          ✉️ info@ssrcollege.edu
        </div>

        {/* FIXED APPLY + LOGIN FOR MOBILE */}
        <div className="mobile-cta">
          <Link
            to="/apply"
            onClick={() => setMobileOpen(false)}
            className="mobile-cta-btn"
          >
            Apply Now
          </Link>

          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="mobile-cta-btn"
          >
            Login
          </Link>
        </div>

        {/* MENU LIST */}
        {menuItems.map((item, index) => (
          <div key={index}>
            <div className="mobile-item">
              {item.link ? (
                <Link
                  to={item.link}
                  onClick={() => setMobileOpen(false)}
                  className={location.pathname === item.link ? "active-link" : ""}
                >
                  {item.title}
                </Link>
              ) : (
                <span>{item.title}</span>
              )}

              {item.dropdown && (
                <span className="plus-icon" onClick={() => toggleMobileDropdown(index)}>
                  {mobileDropdown === index ? "–" : "+"}
                </span>
              )}
            </div>

            {item.dropdown && mobileDropdown === index && (
              <div className="mobile-submenu">
                {item.dropdown.map((sub, sIdx) => {
                  const route = getRouteForDropdown(item.title, sub);

                  return (
                    <Link
                      key={sIdx}
                      to={route}
                      onClick={() => setMobileOpen(false)}
                      className={`mobile-subitem ${
                        location.pathname === route ? "active-link" : ""
                      }`}
                    >
                      {sub}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Navbar;
