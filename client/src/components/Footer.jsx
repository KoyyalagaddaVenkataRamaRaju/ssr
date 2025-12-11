// src/components/Footer.jsx
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
  const fullAddress = `SSR Degree College
#25/586, opp. KDCC Bank, Jaganadha Puram, Machilipatnam, Andhra Pradesh 521001`;

  const quickLinks = ["About SSR", "Courses", "Admissions", "Placements"];
  const usefulLinks = ["Student Portal", "Faculty Login", "Examination Cell", "Library"];

  return (
    <footer className="sr-footer" role="contentinfo" aria-label="SSR Degree College footer">
      <style>{`
        /* ---------------------------
           Design tokens (colors/spacing)
           --------------------------- */
        :root{
          --bg-deep: #07132a;       /* main dark */
          --bg-mid:  #0b2a45;       /* mid tone */
          --panel:   rgba(255,255,255,0.03);
          --muted:   #b6cbe0;
          --muted-2: #dbeafc;
          --accent-1: #6f4bd8;      /* purple */
          --accent-2: #2ea3ff;      /* cyan */
          --white:   #ffffff;
          --radius: 16px;
          --maxw: 1600px;
        }

        /* ---------------------------
           Base layout
           --------------------------- */
        .sr-footer{
          background: linear-gradient(180deg, var(--bg-deep), var(--bg-mid));
          color: var(--muted);
          padding: 56px 0 24px;
          font-family: Inter, "Poppins", system-ui, -apple-system, "Segoe UI", Roboto, Arial;
          position: relative;
          overflow: hidden;
        }

        .sr-footer .container {
          max-width: var(--maxw);
          margin: 0 auto;
          padding: 0 20px;
        }

        /* decorative subtle overlay for depth */
        .sr-footer::after{
          content: "";
          position: absolute;
          right: -10%;
          top: -20%;
          width: 640px;
          height: 640px;
          background: radial-gradient(circle at center, rgba(46,163,255,0.06), transparent 40%);
          filter: blur(24px);
          pointer-events: none;
          z-index: 0;
        }

        /* ---------------------------
           Top area: grid columns
           --------------------------- */
        .footer-top {
          position: relative;
          z-index: 2;
          padding-bottom: 36px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 360px 1fr 300px 320px;
          gap: 128px;
          align-items: start;
        }

        /* Brand column */
        .brand-wrap {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .brand-block {
          display: flex;
          flex-direction: column;
        }
        .brand-logo {
          width: 72px;
          height: 72px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 36px rgba(46,163,255,0.08);
          flex-shrink: 0;
        }
        .brand-logo svg { display: block; }
        .brand-title {
          font-size: 22px;
          color: var(--white);
          font-weight: 900;
          margin: 0 0 4px;
        }
        .brand-sub {
          color: var(--muted-2);
          margin: 0;
          font-size: 13px;
          font-weight: 600;
        }

        .footer-about {
          margin-top: 12px;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.6;
          max-width: 360px;
        }

        .socials { display:flex; gap:10px; margin-top: 14px; }
        .social-btn {
          width:44px; height:44px; border-radius:10px;
          display:inline-flex; align-items:center; justify-content:center;
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          border: 1px solid rgba(255,255,255,0.03);
          color: var(--white);
          transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
        }
        .social-btn:hover{
          transform: translateY(-6px) scale(1.03);
          background: linear-gradient(90deg,var(--accent-1), var(--accent-2));
          box-shadow: 0 14px 34px rgba(46,163,255,0.12);
        }

        /* column headings */
        .col-title {
          color: var(--white);
          font-weight: 800;
          margin: 0 0 6px;
          font-size: 15px;
        }
        .col-underline {
          width: 60px;
          height: 4px;
          border-radius: 6px;
          background: linear-gradient(90deg,var(--accent-1), var(--accent-2));
          margin-bottom: 12px;
        }

        /* links */
        .link-list { list-style:none; padding:0; margin:0; }
        .link-list li { margin-bottom: 12px; }
        .link-list a {
          color: var(--muted);
          text-decoration: none;
          display: inline-flex;
          gap: 10px;
          align-items: center;
          font-size: 15px;
          transition: color .14s ease, transform .14s ease;
        }
        .link-list a svg { color: var(--muted-2); }
        .link-list a:hover {
          color: var(--accent-2);
          transform: translateX(8px);
        }

        /* contact column */
        .contact-panel {
          background: linear-gradient(180deg, rgba(255,255,255,0.015), transparent);
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.03);
        }
        .contact-item { display:flex; gap:12px; align-items:flex-start; margin-bottom:12px; }
        .contact-item svg { flex-shrink: 0; }
        .contact-meta { color: var(--muted); font-size: 15px; line-height: 1.5; }
        .contact-meta strong { display:block; color: var(--white); margin-bottom:6px; font-weight:700; }

        .map-link { display:inline-block; margin-top:6px; color: var(--muted); text-decoration: none; }
        .map-link:hover { color: var(--accent-2); text-decoration: underline; }

        /* bottom area */
        .footer-bottom {
          margin-top: 26px;
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.03);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .copyright { color: #93a7c3; margin: 0; font-size: 14px; }
        .legal-links { display:flex; gap: 18px; align-items:center; flex-wrap:wrap; }
        .legal-links a { color: var(--muted); text-decoration:none; font-size:14px; }
        .legal-links a:hover { color: var(--accent-1); text-decoration: underline; }

        /* ---------------------------
           Responsive breakpoints
           --------------------------- */
        @media (max-width: 1199.98px) {
          .footer-grid {
            grid-template-columns: 320px 1fr 260px;
            grid-auto-rows: auto;
            gap: 24px;
          }
        }

        @media (max-width: 899.98px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .brand-wrap { align-items: flex-start; }
        }

        @media (max-width: 575.98px) {
          .sr-footer { padding: 32px 0 18px; }
          .footer-grid { grid-template-columns: 1fr; gap: 18px; }
          .brand-logo { width:56px; height:56px; border-radius:10px; }
          .brand-title { font-size: 20px; }
          .footer-about { font-size: 14px; max-width: 100%; }
          .social-btn { width:40px; height:40px; }
          .col-underline { width: 48px; height: 3px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; gap: 10px; }
        }

        /* Large-screen fine-tuning (laptop/desktop) */
        @media (min-width: 1200px) {
          .sr-footer { padding-top: 72px; }
          .brand-logo { width: 84px; height: 84px; border-radius: 16px; }
          .brand-title { font-size: 24px; }
          .footer-about { font-size: 16px; max-width: 480px; }
          .link-list a { font-size: 15.5px; }
        }
      `}</style>

      <div className="container">
        <div className="footer-top">
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <div className="brand-wrap" aria-hidden>
                <div className="brand-logo" role="img" aria-label="SSR logo">
                  <svg width="48" height="48" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <defs>
                      <linearGradient id="gA" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0" stopColor="#6f4bd8" />
                        <stop offset="1" stopColor="#2ea3ff" />
                      </linearGradient>
                    </defs>
                    <rect width="64" height="64" rx="12" fill="url(#gA)" />
                    <text x="32" y="40" textAnchor="middle" fill="#fff" fontSize="28" fontFamily="Poppins, sans-serif" fontWeight="700">S</text>
                  </svg>
                </div>

                <div className="brand-block">
                  <p className="brand-title">SSR</p>
                  <p className="brand-sub">Degree College</p>
                </div>
              </div>

              <p className="footer-about">
                SSR Degree College is committed to academic excellence and holistic development — preparing students
                with knowledge, skills and values to succeed in a changing world.
              </p>

              <div className="socials" aria-label="Social links">
                <a className="social-btn" href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <Facebook size={16} />
                </a>
                <a className="social-btn" href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                  <Twitter size={16} />
                </a>
                <a className="social-btn" href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <Linkedin size={16} />
                </a>
                <a className="social-btn" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <Instagram size={16} />
                </a>
                <a className="social-btn" href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                  <Youtube size={16} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="col-title">Quick Links</div>
              <div className="col-underline" aria-hidden />
              <ul className="link-list" aria-label="Quick links">
                {quickLinks.map((t, i) => (
                  <li key={i}>
                    <a href={`#${t.replace(/\s+/g, "-").toLowerCase()}`} aria-label={t}>
                      <ChevronRight size={14} /> {t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Useful Links */}
            <div>
              <div className="col-title">Useful Links</div>
              <div className="col-underline" aria-hidden />
              <ul className="link-list" aria-label="Useful links">
                {usefulLinks.map((t, i) => (
                  <li key={i}>
                    <a href={`#${t.replace(/\s+/g, "-").toLowerCase()}`} aria-label={t}>
                      <ChevronRight size={14} /> {t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div className="col-title">Contact Info</div>
              <div className="col-underline" aria-hidden />
              <div className="contact-panel" aria-label="Contact information">
                <div className="contact-item">
                  <MapPin size={20} style={{ color: "var(--accent-1)" }} />
                  <div className="contact-meta">
                    <strong>Campus Location</strong>
                    <div style={{ whiteSpace: "pre-line" }}>{fullAddress}</div>
                    <a className="map-link" href={`https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`} target="_blank" rel="noreferrer">View on Map</a>
                  </div>
                </div>

                <div className="contact-item">
                  <Phone size={20} style={{ color: "var(--accent-1)" }} />
                  <div className="contact-meta">
                    <a href="tel:+919876543210">+91 98765 43210</a><br />
                    <a href="tel:+919876599765">+91 98765 99765</a>
                  </div>
                </div>

                <div className="contact-item">
                  <Mail size={20} style={{ color: "var(--accent-1)" }} />
                  <div className="contact-meta">
                    <a href="mailto:info@ssrcollege.edu">info@ssrcollege.edu</a><br />
                    <a href="mailto:admissions@ssrcollege.edu">admissions@ssrcollege.edu</a>
                  </div>
                </div>
              </div>
            </div>
          </div> {/* /.footer-grid */}
        </div> {/* /.footer-top */}

        <div className="footer-bottom" aria-label="Footer legal">
          <p className="copyright">© {new Date().getFullYear()} SSR Degree College. All Rights Reserved.</p>

          <div className="legal-links" role="navigation" aria-label="Legal links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Use</a>
            <a href="#sitemap">Sitemap</a>
          </div>
        </div>
      </div> {/* /.container */}
    </footer>
  );
};

export default Footer;
