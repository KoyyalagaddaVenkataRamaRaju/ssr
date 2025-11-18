import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactUs = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Navbar />

      <style>{`
        :root {
          --ssr-purple: #6a3bbb;
          --ssr-purple-light: #9b6fe9;
          --ssr-glow: rgba(155, 111, 233, 0.25);
          --ssr-gold: #d4ac0d;
          --text-dark: #222;
        }

        .ct-header {
          width: 100%;
          min-height: 260px;
          padding: 80px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          position: relative;
          background-image: url("https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg");
          background-size: cover;
          background-position: center;
          overflow: hidden;
        }

        .ct-header::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(106, 59, 187, 0.65),
            rgba(155, 111, 233, 0.45)
          );
          z-index: 1;
          opacity: 0;
          animation: fadeOverlay 1s ease forwards;
        }

        .ct-title {
          position: relative;
          z-index: 2;
          font-size: 40px;
          font-weight: 800;
          opacity: 0;
          letter-spacing: 1px;
          animation: fadeTitle 1.2s ease forwards;
          animation-delay: 0.2s;
        }

        @keyframes fadeOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeTitle {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ct-wrapper {
          max-width: 1200px;
          margin: 50px auto;
          padding: 20px;
          display: flex;
          gap: 40px;
          align-items: flex-start;
          opacity: 0;
          animation: fadeUp 1s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ct-img-box {
          flex: 1;
          position: relative;
        }

        .ct-img {
          width: 100%;
          max-width: 450px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.18);
          transform: translateX(-20px);
          opacity: 0;
          animation: fadeLeft 1s ease forwards;
          animation-delay: 0.2s;
        }

        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .ct-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, var(--ssr-glow), transparent);
          filter: blur(45px);
          z-index: -1;
        }

        .ct-content {
          flex: 2;
          animation: fadeRight 1s ease forwards;
          opacity: 0;
          animation-delay: 0.3s;
        }

        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .ct-heading {
          font-size: 28px;
          font-weight: 700;
          color: var(--ssr-purple);
          margin-bottom: 15px;
        }

        .ct-text {
          color: #444;
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 20px;
        }

        .ct-info {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
          margin-bottom: 25px;
        }

        .ct-info p {
          margin: 8px 0;
          font-size: 16px;
        }

        .ct-form {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
        }

        .ct-form input,
        .ct-form textarea {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-bottom: 15px;
          font-size: 15px;
          transition: 0.3s ease;
        }

        .ct-form input:focus,
        .ct-form textarea:focus {
          border-color: var(--ssr-purple);
          box-shadow: 0 0 8px rgba(106, 59, 187, 0.3);
        }

        .ct-btn {
          background: var(--ssr-purple);
          color: white;
          border: none;
          padding: 12px 20px;
          font-size: 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s;
        }

        .ct-btn:hover {
          background: var(--ssr-purple-light);
        }

        /* SKELETON */
        .skeleton {
          background: linear-gradient(90deg, #e3e3e3 0%, #f7f7f7 50%, #e3e3e3 100%);
          animation: skelAnim 1.2s linear infinite;
          background-size: 200% 100%;
          border-radius: 10px;
        }

        @keyframes skelAnim {
          0% { background-position: 150% 0; }
          100% { background-position: -150% 0; }
        }

        .sk-img {
          width: 100%;
          height: 320px;
          max-width: 450px;
        }

        .sk-line {
          width: 100%;
          height: 18px;
          margin-bottom: 15px;
        }

        /* GOOGLE MAP SECTION */
        .map-section {
          width: 100%;
          margin-top: 40px;
          animation: fadeUp 1s ease;
        }

        .map-frame {
          width: 100%;
          height: 400px;
          border: 0;
          border-radius: 10px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        @media (max-width: 900px) {
          .ct-wrapper {
            flex-direction: column;
            text-align: center;
          }

          .ct-img {
            max-width: 80%;
            margin: auto;
          }

          .ct-content {
            text-align: left;
          }
        }

        @media (max-width: 480px) {
          .ct-title { font-size: 32px; }
          .ct-heading { font-size: 24px; }
        }
      `}</style>

      {/* HEADER */}
      <div className="ct-header">
        <h1 className="ct-title">Contact Us</h1>
      </div>

      {/* SKELETON */}
      {loading ? (
        <div className="ct-wrapper">
          <div className="ct-img-box">
            <div className="skeleton sk-img"></div>
          </div>

          <div className="ct-content">
            <div className="skeleton sk-line" style={{ width: "70%" }}></div>
            <div className="skeleton sk-line"></div>
            <div className="skeleton sk-line"></div>
            <div className="skeleton sk-line" style={{ width: "80%" }}></div>
            <div className="skeleton sk-line" style={{ width: "50%" }}></div>
          </div>
        </div>
      ) : (
        <>
          {/* CONTACT CONTENT */}
          <div className="ct-wrapper">
            {/* LEFT IMAGE */}
            <div className="ct-img-box">
              <div className="ct-glow"></div>
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                className="ct-img"
                alt="Contact"
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="ct-content">
              <h2 className="ct-heading">Get in Touch</h2>

              <p className="ct-text">
                We’re here to help! Reach out to SSR Degree College for any
                academic queries, admissions, or support. Our team will assist you promptly.
              </p>

              <div className="ct-info">
                <p><b>📍 Address:</b> SSR Degree College, Jagannadhapuram, Machilipatnam</p>
                <p><b>📞 Phone:</b> +91 98765 43210</p>
                <p><b>📧 Email:</b> info@ssrcollege.ac.in</p>
                <p><b>🕒 Timings:</b> Mon–Sat, 9:00 AM – 5:00 PM</p>
              </div>

              {/* <div className="ct-form">
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <input type="text" placeholder="Subject" />
                <textarea rows="4" placeholder="Your Message"></textarea>

                <button className="ct-btn">Send Message</button>
              </div> */}
            </div>
          </div>

          {/* GOOGLE MAP SECTION */}
          <div className="map-section">
            <iframe
              className="map-frame"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3831.752232474001!2d81.1331668!3d16.181722599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a49e7c6551437fb%3A0x4f8e0dc6bf911f0a!2sSSR%20Degree%20College!5e0!3m2!1sen!2sin!4v1763482176908!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SSR Degree College Location"
            ></iframe>
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default ContactUs;
