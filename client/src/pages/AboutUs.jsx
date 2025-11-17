import React from "react";
import Navbar from "../components/Navbar";

const AboutUs = () => {
  return (
    <>
    <Navbar/>
      <style>
        {`
        .about-header {
          background: linear-gradient(135deg, #7A54B1, #9d6de1);
          padding: 70px 20px;
          text-align: center;
          color: white;
        }

        .about-title {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .about-sub {
          font-size: 16px;
          opacity: 0.9;
          margin-top: 10px;
        }

        .about-section {
          max-width: 1000px;
          margin: 40px auto;
          padding: 20px;
        }

        .about-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
          line-height: 1.8;
          color: #444;
          font-size: 16px;
        }

        .about-card img {
          width: 100%;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        /* Decorative line */
        .divider {
          width: 70px;
          height: 4px;
          background: #7A54B1;
          border-radius: 4px;
          margin: 15px auto 30px;
        }

        @media (max-width: 600px) {
          .about-title { font-size: 28px; }
          .about-card { font-size: 15px; padding: 20px; }
        }
        `}
      </style>

      {/* Header */}
      <div className="about-header">
        <h1 className="about-title">About SSR Degree College</h1>
        <p className="about-sub">Empowering students through quality education</p>
      </div>

      {/* About Content */}
      <div className="about-section">
        <div className="about-card">
          <img
            src="https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg"
            alt="Campus"
          />

          <div className="divider"></div>

          <p>
            SSR Degree College is committed to delivering high-quality education
            that nurtures young minds and prepares them for a successful future.
            Our institution has consistently worked towards providing a learning
            environment that blends academic excellence with holistic development.
          </p>

          <p>
            With modern infrastructure, well-equipped laboratories, experienced
            faculty members, and student-centered activities, SSR Degree College
            ensures every learner receives the best educational exposure. We aim
            to shape individuals into responsible citizens and skilled
            professionals.
          </p>

          <p>
            Our college prioritizes innovation, discipline, and knowledge that
            transforms students into confident and competent contributors to
            society.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
