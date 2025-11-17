import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const HomeWelcomeSection = () => {
  return (
    <>
      <style>
        {`
        .welcome-section {
          padding: 60px 0;
        }

        /* ANIMATION KEYFRAMES */
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(60px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        /* TITLE */
        .welcome-title {
          font-size: 34px;
          font-weight: 600;
          color: #0bb394;
          text-align: center;
          letter-spacing: 1px;
          animation: fadeInUp 1s ease-in-out;
        }

        .welcome-divider {
          width: 90px;
          height: 2px;
          background: #999;
          margin: 12px auto 25px;
          animation: fadeInUp 1.2s ease-in-out;
        }

        /* TEXT BLOCK */
        .welcome-text {
          font-size: 16px;
          color: #444;
          line-height: 1.7;
          text-align: justify;
          max-width: 580px;
          margin: 0 auto;
          opacity: 0;
          animation: fadeInUp 1.4s ease-in-out forwards;
        }

        /* BUTTON */
        .welcome-btn {
          margin-top: 25px;
          padding: 10px 30px;
          border-radius: 4px;
          background: transparent;
          border: 2px solid #bbb;
          color: #555;
          transition: 0.3s;
          animation: fadeInUp 1.6s ease-in-out;
        }

        .welcome-btn:hover {
          background: #e65249;
          color: white;
          border-color: #e65249;
        }

        /* IMAGE ANIMATION */
        .welcome-image {
          width: 100%;
          border-radius: 6px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          opacity: 0;
          animation: slideInRight 1.3s ease forwards;
        }

        @media (max-width: 992px) {
          .welcome-text {
            text-align: center;
          }
        }
        `}
      </style>

      <div className="container welcome-section">
        <div className="row align-items-center">

          {/* LEFT COLUMN */}
          <div className="col-lg-6 mb-4">
            <h2 className="welcome-title">Welcome To S S R College</h2>
            <div className="welcome-divider"></div>

            <p className="welcome-text">
              S.S.R College (SSRC) stands as a distinguished institution committed 
              to delivering quality and affordable education to rural and semi-urban 
              communities. Managed under the guidance of the SSR Educational 
              Society, SSRC focuses on empowering students with strong academic 
              foundations and practical skills that align with modern industry needs. 
              
              Over the years, the college has evolved into a hub for holistic learning, 
              fostering critical thinking, research culture, and leadership qualities 
              among students. SSRC continues its mission of shaping disciplined, 
              innovative, and socially responsible graduates ready to excel in their 
              chosen careers.
            </p>

            <div className="text-center">
              <button className="welcome-btn">READ MORE</button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-lg-6 text-center">
            <img
              src="/images/nirf-certificate.jpg"  /* Replace with your SSR related image */
              alt="SSR College Recognition"
              className="welcome-image"
            />
          </div>

        </div>
      </div>
    </>
  );
};

export default HomeWelcomeSection;
