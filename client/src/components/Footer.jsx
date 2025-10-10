import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';

const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: '#1a1a2e',
      color: '#ffffff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      paddingTop: '60px',
    },
    footerTop: {
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      paddingBottom: '40px',
    },
    footerTitle: {
      fontSize: '20px',
      fontWeight: '700',
      marginBottom: '25px',
      color: '#ffffff',
      position: 'relative',
      paddingBottom: '12px',
    },
    footerTitleUnderline: {
      width: '50px',
      height: '3px',
      backgroundColor: '#7A54B1',
      position: 'absolute',
      bottom: '0',
      left: '0',
    },
    brandSection: {
      marginBottom: '20px',
    },
    brandLogo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '20px',
    },
    logoCircle: {
      width: '50px',
      height: '50px',
    },
    brandName: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#ffffff',
      margin: '0',
    },
    brandTagline: {
      fontSize: '12px',
      color: '#b8b8b8',
      margin: '0',
    },
    footerText: {
      fontSize: '14px',
      lineHeight: '1.8',
      color: '#b8b8b8',
      marginBottom: '20px',
    },
    linkList: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
    },
    linkItem: {
      marginBottom: '12px',
    },
    link: {
      color: '#b8b8b8',
      textDecoration: 'none',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '18px',
      color: '#b8b8b8',
      fontSize: '14px',
      lineHeight: '1.6',
    },
    iconWrapper: {
      marginTop: '3px',
      flexShrink: '0',
    },
    socialLinks: {
      display: 'flex',
      gap: '12px',
      marginTop: '20px',
    },
    socialIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: '1px solid transparent',
    },
    footerBottom: {
      paddingTop: '30px',
      paddingBottom: '30px',
      marginTop: '40px',
      backgroundColor: '#0f0f1e',
    },
    footerBottomContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px',
    },
    copyright: {
      fontSize: '14px',
      color: '#b8b8b8',
      margin: '0',
    },
    footerLinks: {
      display: 'flex',
      gap: '25px',
      flexWrap: 'wrap',
    },
    footerLink: {
      color: '#b8b8b8',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'all 0.3s ease',
    },
  };

  const quickLinks = [
    'About Us',
    'Academic Calendar',
    'Admissions',
    'Campus Life',
    'Career Opportunities',
    'News & Events',
  ];

  const importantLinks = [
    'Student Portal',
    'Faculty Portal',
    'Library',
    'Examination Cell',
    'Alumni Association',
    'Anti-Ragging',
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
            border-color: #7A54B1 !important;
            transform: translateY(-3px);
          }
          .footer-bottom-link-hover:hover {
            color: #7A54B1 !important;
          }
        `}
      </style>

      <footer style={styles.footer}>
        <div style={styles.footerTop}>
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-6 mb-4">
                <div style={styles.brandSection}>
                  <div style={styles.brandLogo}>
                    <div style={styles.logoCircle}>
                      <svg viewBox="0 0 50 50" fill="#7A54B1">
                        <circle cx="25" cy="25" r="23" fill="#7A54B1" />
                        <text
                          x="25"
                          y="33"
                          fontSize="22"
                          fill="white"
                          textAnchor="middle"
                          fontWeight="bold"
                          fontFamily="Arial"
                        >
                          V
                        </text>
                      </svg>
                    </div>
                    <div>
                      <h3 style={styles.brandName}>VISHNU</h3>
                      <p style={styles.brandTagline}>Institute of Technology</p>
                    </div>
                  </div>
                  <p style={styles.footerText}>
                    VISHNU Institute of Technology is committed to providing quality education
                    and fostering innovation. We prepare students to become leaders in their
                    fields through comprehensive academic programs and hands-on learning experiences.
                  </p>
                  <div style={styles.socialLinks}>
                    <div style={styles.socialIcon} className="social-icon-hover">
                      <Facebook size={20} />
                    </div>
                    <div style={styles.socialIcon} className="social-icon-hover">
                      <Twitter size={20} />
                    </div>
                    <div style={styles.socialIcon} className="social-icon-hover">
                      <Linkedin size={20} />
                    </div>
                    <div style={styles.socialIcon} className="social-icon-hover">
                      <Instagram size={20} />
                    </div>
                    <div style={styles.socialIcon} className="social-icon-hover">
                      <Youtube size={20} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-6 mb-4">
                <h4 style={styles.footerTitle}>
                  Quick Links
                  <span style={styles.footerTitleUnderline}></span>
                </h4>
                <ul style={styles.linkList}>
                  {quickLinks.map((link, index) => (
                    <li key={index} style={styles.linkItem}>
                      <a href="#" style={styles.link} className="footer-link-hover">
                        <ChevronRight size={16} />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 mb-4">
                <h4 style={styles.footerTitle}>
                  Important Links
                  <span style={styles.footerTitleUnderline}></span>
                </h4>
                <ul style={styles.linkList}>
                  {importantLinks.map((link, index) => (
                    <li key={index} style={styles.linkItem}>
                      <a href="#" style={styles.link} className="footer-link-hover">
                        <ChevronRight size={16} />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 mb-4">
                <h4 style={styles.footerTitle}>
                  Contact Info
                  <span style={styles.footerTitleUnderline}></span>
                </h4>
                <div style={styles.contactItem}>
                  <div style={styles.iconWrapper}>
                    <MapPin size={18} color="#7A54B1" />
                  </div>
                  <div>
                    VISHNU Institute of Technology<br />
                    Duvvada, Visakhapatnam<br />
                    Andhra Pradesh - 530049
                  </div>
                </div>
                <div style={styles.contactItem}>
                  <div style={styles.iconWrapper}>
                    <Phone size={18} color="#7A54B1" />
                  </div>
                  <div>
                    +91-877-2500000<br />
                    +91-877-2500001
                  </div>
                </div>
                <div style={styles.contactItem}>
                  <div style={styles.iconWrapper}>
                    <Mail size={18} color="#7A54B1" />
                  </div>
                  <div>
                    info@vishnu.edu.in<br />
                    admissions@vishnu.edu.in
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <div className="container">
            <div style={styles.footerBottomContent}>
              <p style={styles.copyright}>
                &copy; {new Date().getFullYear()} VISHNU Institute of Technology. All rights reserved.
              </p>
              <div style={styles.footerLinks}>
                <a href="#" style={styles.footerLink} className="footer-bottom-link-hover">
                  Privacy Policy
                </a>
                <a href="#" style={styles.footerLink} className="footer-bottom-link-hover">
                  Terms of Service
                </a>
                <a href="#" style={styles.footerLink} className="footer-bottom-link-hover">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
