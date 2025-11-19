import React, { useEffect, useState } from "react";

const RecruitersSection = () => {
  const [logos, setLogos] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(API_URL + "/api/recruiters")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogos(data.data);
      });
  }, []);

  // Duplicate list for infinite loop
  const scrollingLogos = [...logos, ...logos];

  return (
    <>
      <style>{`
        .recruiter-section {
          padding: 50px 10px;
          text-align: center;
          background: #ffffff;
          overflow: hidden;
        }

        .recruiter-title {
          font-size: 30px;
          font-weight: 800;
          color: #0a2a63;
          margin-bottom: 8px;
        }

        .recruiter-line {
          width: 90px;
          height: 4px;
          background: linear-gradient(90deg, #ff3b3b, #ff7b29);
          margin: auto;
          border-radius: 8px;
          margin-bottom: 25px;
        }

        /* SLIDER AREA */
        .slider {
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: 20px 0;
        }

        .slide-track {
          display: flex;
          gap: 65px;
          align-items: center;
          animation: scroll 22s linear infinite;
          will-change: transform;
        }

        /* Pause when hover */
        .slider:hover .slide-track {
          animation-play-state: paused;
        }

        /* 3D LOGO STYLE */
        .logo-img {
          height: 85px;
          object-fit: contain;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
          transition: transform 0.3s ease, filter 0.3s ease;
          transform-style: preserve-3d;
        }

        .logo-img:hover {
          transform: translateZ(35px) scale(1.25) rotateY(10deg);
          filter: drop-shadow(0 10px 22px rgba(0,0,0,0.25));
        }

        /* ANIMATION KEYFRAME */
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* RESPONSIVENESS */
        @media (max-width: 1024px) {
          .slide-track { gap: 55px; }
          .logo-img { height: 70px; }
        }

        @media (max-width: 768px) {
          .logo-img { height: 55px; }
          .recruiter-title { font-size: 24px; }
          .slide-track { gap: 45px; }
        }

        @media (max-width: 480px) {
          .logo-img { height: 48px; }
          .slide-track { gap: 35px; }
          .recruiter-title { font-size: 22px; }
        }

      `}</style>

      <section className="recruiter-section">
        <h2 className="recruiter-title">OUR RECRUITERS</h2>
        <div className="recruiter-line"></div>

        <div className="slider">
          <div className="slide-track">
            {scrollingLogos.map((logo, index) => (
              <img
                key={index}
                src={`${API_URL}${logo.imageUrl}`}
                alt={logo.companyName}
                className="logo-img"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default RecruitersSection;
