import React, { useState } from 'react';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }

        .marquee-content {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 25s linear infinite;
        }

        .marquee-content-slow {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 35s linear infinite;
        }

        .nav-link {
          position: relative;
          font-weight: 600;
          font-size: 15px;
          color: #333;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #1976d2;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #1976d2, #42a5f5);
          transition: width 0.3s ease, left 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
          left: 0;
        }

        .dropdown-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 1000;
          min-width: 240px;
          padding: 0.75rem 0;
          margin: 0.25rem 0 0;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 1px solid rgba(25, 118, 210, 0.1);
          border-radius: 8px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        .dropdown:hover .dropdown-menu {
          display: block;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-item {
          display: block;
          width: 100%;
          padding: 0.65rem 1.25rem;
          clear: both;
          font-weight: 500;
          font-size: 14px;
          color: #333;
          text-align: inherit;
          text-decoration: none;
          white-space: nowrap;
          background-color: transparent;
          border: 0;
          border-left: 3px solid transparent;
          transition: all 0.2s ease-in-out;
        }

        .dropdown-item:hover {
          background: linear-gradient(90deg, rgba(25, 118, 210, 0.08) 0%, transparent 100%);
          border-left-color: #1976d2;
          color: #1976d2;
          padding-left: 1.5rem;
        }

        .navbar-brand {
          transition: transform 0.3s ease;
        }

        .navbar-brand:hover {
          transform: scale(1.05);
        }

        .mobile-menu-btn {
          transition: transform 0.3s ease;
        }

        .mobile-menu-btn:hover {
          transform: rotate(90deg);
        }

        @media (max-width: 1024px) {
          .dropdown-menu {
            position: static;
            display: none;
            box-shadow: none;
            border: none;
            padding-left: 1rem;
            background: transparent;
            backdrop-filter: none;
          }

          .dropdown.open .dropdown-menu {
            display: block;
          }

          .dropdown:hover .dropdown-menu {
            display: none;
          }

          .dropdown.open:hover .dropdown-menu {
            display: block;
          }

          .nav-link::after {
            display: none;
          }

          .dropdown-item:hover {
            padding-left: 1.25rem;
          }
        }
      `}</style>

      {/* Secondary Navbar */}
      <div className="bg-dark text-white py-1">
        <div className="container d-flex justify-content-between flex-wrap">
          <div className="small">
            <span className="text-warning fw-bold">Approvals | Accreditations</span> | 
            EAPCET / ECET CODE : <span>SRKR</span> | 
            M.TECH CODE : <span>SRKR1</span> | 
            BBA CODE : <span>17086</span>
          </div>
          <div className="small">
            <a href="/contact" className="text-white text-decoration-none d-flex align-items-center gap-1">
              <Phone size={14} /> Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Primary Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm" style={{ borderBottom: '3px solid #1976d2' }}>
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src="/assets/img/image.png" alt="SRKR" height="55" />
          </a>

          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <X size={26} color="#1976d2" /> : <Menu size={26} color="#1976d2" />}
          </button>

          <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="/" onClick={() => setExpanded(false)}>Home</a>
              </li>

              {/* About SRKR */}
              <li className={`nav-item dropdown ${openDropdown === 'about' ? 'open' : ''}`}>
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  onClick={() => toggleDropdown('about')}
                >
                  About SRKR
                </button>
                <ul className={`dropdown-menu ${openDropdown === 'about' ? 'show' : ''}`}>
                  <li><a className="dropdown-item" href="/vision-mission">Vision & Mission</a></li>
                  <li><a className="dropdown-item" href="/college-profile">College Profile</a></li>
                  <li><a className="dropdown-item" href="/governing-body">Governing Body</a></li>
                  <li><a className="dropdown-item" href="/advisory-council">College Advisory Council</a></li>
                  <li><a className="dropdown-item" href="/college-committees">Committees</a></li>
                  <li><a className="dropdown-item" href="/organogram">Organogram</a></li>
                  <li><a className="dropdown-item" href="/president-message">President's Message</a></li>
                  <li><a className="dropdown-item" href="/director-message">Director's Message</a></li>
                  <li><a className="dropdown-item" href="/principal-message">Principal's Message</a></li>
                  <li><a className="dropdown-item" href="/accreditations">Accreditations</a></li>
                  <li><a className="dropdown-item" href="/awards-honours">Awards & Honours</a></li>
                  <li><a className="dropdown-item" href="/prominent-alumni">Prominent Alumni</a></li>
                </ul>
              </li>

              {/* Academics */}
              <li className={`nav-item dropdown ${openDropdown === 'academics' ? 'open' : ''}`}>
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  onClick={() => toggleDropdown('academics')}
                >
                  Academics
                </button>
                <ul className={`dropdown-menu ${openDropdown === 'academics' ? 'show' : ''}`}>
                  <li><a className="dropdown-item" href="/departments">Departments</a></li>
                  <li><a className="dropdown-item" href="/ug-courses">UG Programmes</a></li>
                  <li><a className="dropdown-item" href="/pg-courses">PG Programmes</a></li>
                  <li><a className="dropdown-item" href="/phd-courses">PhD Programmes</a></li>
                  <li><a className="dropdown-item" href="/bs-humanities">BS & Humanities</a></li>
                  <li><a className="dropdown-item" href="/academic-calendar">Academic Calendar</a></li>
                  <li><a className="dropdown-item" href="/syllabus">Syllabus</a></li>
                  <li><a className="dropdown-item" href="/regulations">Regulations</a></li>
                  <li><a className="dropdown-item" href="/time-tables">Time Tables</a></li>
                  <li><a className="dropdown-item" href="http://www.srkrexams.in/Login.aspx" target="_blank" rel="noopener noreferrer">Examinations</a></li>
                  <li><a className="dropdown-item" href="https://www.icredify.com/degreeverify/srkrec" target="_blank" rel="noopener noreferrer">Education Verification</a></li>
                </ul>
              </li>

              {/* Admissions */}
              <li className={`nav-item dropdown ${openDropdown === 'admissions' ? 'open' : ''}`}>
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  onClick={() => toggleDropdown('admissions')}
                >
                  Admissions
                </button>
                <ul className={`dropdown-menu ${openDropdown === 'admissions' ? 'show' : ''}`}>
                  <li><a className="dropdown-item" href="/programmes-offered">Programmes Offered</a></li>
                  <li><a className="dropdown-item" href="/admission-procedure">Admission Procedure</a></li>
                  <li><a className="dropdown-item" href="/intake-fee">Intake & Fee</a></li>
                  <li><a className="dropdown-item" href="/online-fee-payment">Online Fee Payment</a></li>
                  <li><a className="dropdown-item" href="/rank-cutoff">Rank Cut-Off Details</a></li>
                  <li><a className="dropdown-item" href="/pm-vidyalakshmi">PM Vidyalakshmi Scheme</a></li>
                </ul>
              </li>

              {/* Placements */}
              <li className="nav-item">
                <a className="nav-link" href="/placements" onClick={() => setExpanded(false)}>Placements</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Placement Marquee */}
      <div style={{
        width: '100%',
        background: '#1976d2',
        color: '#fff',
        fontFamily: "'Poppins', sans-serif",
        fontSize: '15px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        height: '28px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <span style={{
          padding: '0 10px',
          flexShrink: 0,
          background: '#1976d2',
          position: 'relative',
          zIndex: 1,
        }}>Campus Placements 2025:</span>
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}>
          <div className="marquee-content">
            Amazon SDE (17.16 LPA, 1 Offer) &nbsp; || &nbsp; TCS Digital (7 LPA, 23 Offers) &nbsp; || &nbsp; BOSON (8 LPA, 8 Offers) &nbsp; || &nbsp; Agumentik (7 LPA, 3 Offers)
          </div>
        </div>
      </div>

      {/* News Marquee */}
      <div style={{
        width: '100%',
        background: '#fff',
        color: '#111',
        fontFamily: "'Poppins', sans-serif",
        fontSize: '15px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        height: '28px',
        overflow: 'hidden',
        borderTop: '1px solid #e0e0e0',
        borderBottom: '1px solid #e0e0e0',
        position: 'relative',
      }}>
        <span style={{
          padding: '0 10px',
          flexShrink: 0,
          background: '#fff',
          position: 'relative',
          zIndex: 1,
        }}>What's New :</span>
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}>
          <div className="marquee-content-slow">
            Amaravati Quantum Valley Hackathon 2025 Semifinals Successfully Organised @ SRKR &nbsp; || &nbsp; Youth should be alert about cyber crimes-CI Kali Charan speaking at Bhimavaram SRKR College
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
