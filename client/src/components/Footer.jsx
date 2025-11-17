import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";

const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: "#1a1a2e",
      color: "#ffffff",
      fontFamily: "'Poppins', sans-serif",
      paddingTop: "60px",
    },
    footerTop: {
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      paddingBottom: "40px",
    },
    footerTitle: {
      fontSize: "20px",
      fontWeight: "700",
      marginBottom: "25px",
      color: "#ffffff",
      position: "relative",
      paddingBottom: "12px",
    },
    footerTitleUnderline: {
      width: "50px",
      height: "3px",
      backgroundColor: "#7A54B1",
      position: "absolute",
      bottom: "0",
      left: "0",
      borderRadius: "4px",
    },
    brandLogo: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "20px",
    },
    logoCircle: {
      width: "55px",
      height: "55px",
    },
    brandName: {
      fontSize: "24px",
      fontWeight: "700",
      margin: "0",
      color: "#ffffff",
    },
    brandTagline: {
      fontSize: "12px",
      margin: "0",
      color: "#b8b8b8",
    },
    footerText: {
      fontSize: "14px",
      lineHeight: "1.8",
      color: "#b8b8b8",
      marginBottom: "20px",
    },
    socialLinks: {
      display: "flex",
      gap: "12px",
      marginTop: "20px",
    },
    socialIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "0.3s",
      cursor: "pointer",
      color: "#ffffff",
    },
    linkItem: {
      marginBottom: "12px",
    },
    link: {
      color: "#b8b8b8",
      textDecoration: "none",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "0.3s ease",
    },
    contactItem: {
      display: "flex",
      gap: "12px",
      marginBottom: "18px",
      color: "#b8b8b8",
      fontSize: "14px",
      lineHeight: "1.6",
    },
    footerBottom: {
      paddingTop: "30px",
      paddingBottom: "30px",
      backgroundColor: "#0f0f1e",
      marginTop: "40px",
    },
    footerBottomContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "20px",
    },
    footerLinks: {
      display: "flex",
      gap: "25px",
      flexWrap: "wrap",
    },
    footerLink: {
      color: "#b8b8b8",
      textDecoration: "none",
      fontSize: "14px",
      transition: "0.3s",
    },
  };

  const quickLinks = [
    "About SSR",
    "Courses",
    "Admissions",
    "Placements",
    "Campus Life",
    "News & Events",
  ];

  const usefulLinks = [
    "Student Portal",
    "Faculty Login",
    "Examination Cell",
    "Scholarships",
    "Library",
    "Anti-Ragging",
  ];

  return (
    <>
      <style>
        {`
        .footer-link-hover:hover {
          color: #7A54B1 !important;
          padding-left: 5px;
        }

        .social-icon-hover:hover {
          background-color: #7A54B1 !important;
          transform: translateY(-3px);
        }

        .footer-bottom-link-hover:hover {
          color: #7A54B1 !important;
        }

        @media (max-width: 768px) {
          .footer-bottom-flex {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }
        }
      `}
      </style>

      <footer style={styles.footer}>
        {/* ===================== TOP FOOTER ===================== */}
        <div style={styles.footerTop}>
          <div className="container">
            <div className="row">
              {/* BRAND */}
              <div className="col-lg-4 col-md-6 mb-4">
                <div style={styles.brandLogo}>
                  <div style={styles.logoCircle}>
                    <svg viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="28" fill="#7A54B1" />
                      <text
                        x="30"
                        y="38"
                        fontSize="26"
                        fill="white"
                        textAnchor="middle"
                        fontWeight="bold"
                        fontFamily="Poppins"
                      >
                        S
                      </text>
                    </svg>
                  </div>
                  <div>
                    <h3 style={styles.brandName}>SSR</h3>
                    <p style={styles.brandTagline}>Degree College</p>
                  </div>
                </div>

                <p style={styles.footerText}>
                  SSR Degree College is committed to providing excellence in
                  education, empowering students with knowledge, skills, and
                  values to thrive in their careers and life.
                </p>

                {/* Social Icons */}
                <div style={styles.socialLinks}>
                  {[Facebook, Twitter, Linkedin, Instagram, Youtube].map(
                    (Icon, idx) => (
                      <div
                        key={idx}
                        style={styles.socialIcon}
                        className="social-icon-hover"
                      >
                        <Icon size={20} />
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* QUICK LINKS */}
              <div className="col-lg-2 col-md-6 mb-4">
                <h4 style={styles.footerTitle}>
                  Quick Links
                  <span style={styles.footerTitleUnderline}></span>
                </h4>
                <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                  {quickLinks.map((item, i) => (
                    <li key={i} style={styles.linkItem}>
                      <a href="#" style={styles.link} className="footer-link-hover">
                        <ChevronRight size={16} /> {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* USEFUL LINKS */}
              <div className="col-lg-3 col-md-6 mb-4">
                <h4 style={styles.footerTitle}>
                  Useful Links
                  <span style={styles.footerTitleUnderline}></span>
                </h4>
                <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                  {usefulLinks.map((item, i) => (
                    <li key={i} style={styles.linkItem}>
                      <a href="#" style={styles.link} className="footer-link-hover">
                        <ChevronRight size={16} /> {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CONTACT INFO */}
              <div className="col-lg-3 col-md-6 mb-4">
                <h4 style={styles.footerTitle}>
                  Contact Info
                  <span style={styles.footerTitleUnderline}></span>
                </h4>

                <div style={styles.contactItem}>
                  <MapPin size={18} color="#7A54B1" />
                  SSR Degree College, Hyderabad, Telangana - 500001
                </div>

                <div style={styles.contactItem}>
                  <Phone size={18} color="#7A54B1" />
                  +91 98765 43210<br />+91 98765 98765
                </div>

                <div style={styles.contactItem}>
                  <Mail size={18} color="#7A54B1" />
                  info@ssrcollege.edu<br />admissions@ssrcollege.edu
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== BOTTOM FOOTER ===================== */}
        <div style={styles.footerBottom}>
          <div className="container">
            <div style={{ ...styles.footerBottomContent }} className="footer-bottom-flex">
              <p style={styles.copyright}>
                © {new Date().getFullYear()} SSR Degree College. All Rights Reserved.
              </p>

              <div style={styles.footerLinks}>
                {["Privacy Policy", "Terms of Use", "Sitemap"].map((txt, i) => (
                  <a
                    key={i}
                    href="#"
                    style={styles.footerLink}
                    className="footer-bottom-link-hover"
                  >
                    {txt}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
