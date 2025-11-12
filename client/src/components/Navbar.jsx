import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const navigate = useNavigate(); // ✅ For navigation

  const handleLoginClick = () => {
    navigate('/login'); // ✅ Redirect to login page
  };

  const styles = {
    topBar: {
      backgroundColor: '#7A54B1',
      padding: '10px 0',
      fontSize: '12px',
      color: '#ffffff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    topBarContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    contactInfo: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
    },
    loginBtn: {
      backgroundColor: '#ffffff',
      color: '#7A54B1',
      border: 'none',
      padding: '6px 20px',
      borderRadius: '4px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    applyBtn: {
      backgroundColor: '#ffffff',
      color: '#7A54B1',
      padding: '6px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    navbar: {
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      padding: '0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      textDecoration: 'none',
      color: '#333',
    },
    logo: {
      height: '55px',
      width: '55px',
    },
    brandText: {
      margin: 0,
      fontSize: '22px',
      fontWeight: '700',
      color: '#7A54B1',
      letterSpacing: '0.5px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    brandSubtext: {
      margin: 0,
      fontSize: '11px',
      color: '#666',
      fontWeight: '400',
      letterSpacing: '0.3px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    navMenu: {
      listStyle: 'none',
      display: 'flex',
      gap: '0px',
      margin: 0,
      padding: 0,
      alignItems: 'center',
    },
    navItem: {
      position: 'relative',
    },
    navLink: {
      textDecoration: 'none',
      color: '#2c3e50',
      padding: '25px 20px',
      display: 'block',
      fontSize: '15px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      borderBottom: '3px solid transparent',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      letterSpacing: '0.3px',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      backgroundColor: '#ffffff',
      minWidth: '260px',
      boxShadow: '0 10px 30px rgba(122, 84, 177, 0.15)',
      opacity: 0,
      visibility: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1000,
      borderTop: '4px solid #7A54B1',
      borderRadius: '0 0 8px 8px',
      paddingTop: '8px',
      paddingBottom: '8px',
      transform: 'translateY(-10px)',
    },
    dropdownActive: {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateY(0)',
    },
    dropdownItem: {
      padding: 0,
      margin: '2px 0',
      borderBottom: 'none',
    },
    dropdownLink: {
      textDecoration: 'none',
      color: '#333',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      padding: '13px 20px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontWeight: '500',
      borderRadius: '4px',
      position: 'relative',
    },
  };

  const menuItems = [
    { title: 'Home', link: '/' },
    {
      title: 'Academics',
      dropdown: [
        'Undergraduate Programs',
        'Postgraduate Programs',
        'Doctoral Programs',
        'Departments',
        'Faculty',
      ],
    },
    {
      title: 'Admissions',
      dropdown: [
        'How to Apply',
        'Eligibility',
        'Fee Structure',
        'Scholarships',
        'Important Dates',
      ],
    },
    {
      title: 'Research',
      dropdown: [
        'Research Centers',
        'Publications',
        'Projects',
        'Research Facilities',
      ],
    },
    {
      title: 'Placements',
      dropdown: [
        'Placement Cell',
        'Recruiters',
        'Placement Records',
        'Training Programs',
      ],
    },
    {
      title: 'Statutory',
      dropdown: [
        'IQAC',
        'NAAC',
        'NBA',
        'Committees',
        'Mandatory Disclosures',
      ],
    },
    { title: 'Contact Us', link: '/contact' },
  ];

  return (
    <>
      <style>
        {`
          .nav-link-hover:hover {
            color: #7A54B1 !important;
            border-bottom-color: #7A5 4B1 !important;
          }
          .dropdown-link-hover {
            position: relative;
          }
          .dropdown-link-hover::before {
            content: '';
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 2px;
            background-color: #7A54B1;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .dropdown-link-hover:hover {
            background: linear-gradient(90deg, rgba(122, 84, 177, 0.08) 0%, rgba(122, 84, 177, 0.02) 100%);
            color: #7A54B1 !important;
            padding-left: 28px !important;
            transform: translateX(3px);
            box-shadow: inset 3px 0 0 #7A54B1;
          }
          .dropdown-link-hover:hover::before {
            width: 4px;
          }
          .login-btn-hover:hover {
            background-color: #f0f0f0 !important;
            transform: translateY(-1px);
          }
        `}
      </style>

      <div style={styles.topBar}>
        <div className="container">
          <div style={styles.topBarContent}>
            <div style={styles.contactInfo}>
              <span>📞 +91.....00000</span>
              <span>✉️ info@collage.edu.in</span>
            </div>
            <div style={{gap:'30px', display: 'flex'}}>
            <button
             style={styles.applyBtn}
              className="login-btn-hover"
              onClick={() => alert('Application functionality coming soon!')} 
            >
              Apply Now
            </button>
            <button
              style={styles.loginBtn}
              className="login-btn-hover"
              onClick={handleLoginClick} // ✅ navigate to login
            >
              Login
            </button>
            </div>
          </div>
        </div>
      </div>

      <nav style={styles.navbar}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-3 col-md-12">
              <a href="/" style={styles.brand}>
                <div style={styles.logo}>
                  <svg viewBox="0 0 50 50" fill="#7A54B1">
                    <circle cx="25" cy="25" r="23" fill="#7A54B1" />
                    <text x="25" y="33" fontSize="22" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="Arial">S</text>
                  </svg>
                </div>
                <div>
                  <h1 style={styles.brandText}>SSR</h1>
                  <p style={styles.brandSubtext}>Degree College</p>
                </div>
              </a>
            </div>

            <div className="col-lg-9 col-md-12">
              <div className="d-flex justify-content-end align-items-center">
                <ul style={styles.navMenu}>
                  {menuItems.map((item, index) => (
                    <li
                      key={index}
                      style={styles.navItem}
                      onMouseEnter={() => {
                        if (item.dropdown) setActiveDropdown(index);
                        setHoveredLink(index);
                      }}
                      onMouseLeave={() => {
                        setActiveDropdown(null);
                        setHoveredLink(null);
                      }}
                    >
                      <a
                        href={item.link || '#'}
                        style={{
                          ...styles.navLink,
                          color: hoveredLink === index ? '#7A54B1' : '#2c3e50',
                          borderBottomColor: hoveredLink === index ? '#7A54B1' : 'transparent',
                        }}
                        className="nav-link-hover"
                      >
                        {item.title}
                        {item.dropdown && ' ▾'}
                      </a>

                      {item.dropdown && (
                        <ul
                          style={{
                            ...styles.dropdown,
                            ...(activeDropdown === index ? styles.dropdownActive : {}),
                          }}
                        >
                          {item.dropdown.map((subItem, subIndex) => (
                            <li key={subIndex} style={styles.dropdownItem}>
                              <a href="#" style={styles.dropdownLink} className="dropdown-link-hover">
                                {subItem}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
