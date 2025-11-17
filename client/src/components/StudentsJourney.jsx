import React from "react";

const StudentsJourney = () => {
  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .journey-section {
          width: 100%;
          padding: 60px 0 40px;
          text-align: center;
          font-family: 'Poppins', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .journey-title {
          font-size: 36px;
          font-weight: 600;
          color: #1db6a6;
          margin-bottom: 60px;
        }

        /* WAVE LINE WITH EXTENDED START & END */
        .wave-line {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          position: absolute;
          top: 150px; 
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
        }

        /* DOODLES */
        .doodle {
          position: absolute;
          font-size: 20px;
          opacity: 0.75;
          font-weight: 700;
          animation: float 3s infinite alternate ease-in-out;
        }

        .d1 { left: 6%; top: 160px; color: #00c4b4; }
        .d2 { left: 46%; top: 225px; color: #ff8c34; }
        .d3 { right: 24%; top: 155px; color: #6d55e0; }
        .d4 { right: 6%; top: 235px; color: #ffaa3b; }

        @keyframes float {
          from { transform: translateY(0); }
          to   { transform: translateY(-10px); }
        }

        /* STEPS CONTAINER */
        .journey-steps {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 80px;
          position: relative;
          z-index: 2;
        }

        /* IMAGES - smaller, lighter style, centered */
        .journey-img {
          width: 140px;
          height: 140px;
          object-fit: cover;
          border-radius: 12px;
          position: relative;
          top: -30px;   /* Center images along wave-line */
          transform: rotate(var(--r, -4deg));
          box-shadow: 0 5px 16px rgba(0,0,0,0.12);
          transition: transform 230ms ease, box-shadow 230ms ease;
        }

        /* HOVER EFFECT */
        .journey-img:hover {
          transform: scale(1.08) rotate(0deg);
          box-shadow: 0 12px 32px rgba(0,0,0,0.20);
        }

        /* VARY ROTATIONS */
        .journey-item:nth-child(1) .journey-img { --r: -5deg; }
        .journey-item:nth-child(2) .journey-img { --r: -3deg; }
        .journey-item:nth-child(3) .journey-img { --r: -4deg; }
        .journey-item:nth-child(4) .journey-img { --r: -2deg; }

        /* ZIG ZAG */
        .journey-item:nth-child(1) { margin-top: -10px; }
        .journey-item:nth-child(2) { margin-top: 30px; }
        .journey-item:nth-child(3) { margin-top: -10px; }
        .journey-item:nth-child(4) { margin-top: 30px; }

        /* TITLES */
        .journey-step-title {
          font-size: 20px;
          font-weight: 700;
          color: #24324b;
          margin-top: 8px;
        }

        /* TEXT BLOCK */
        .journey-step-text {
          font-size: 14px;
          color: #6b768a;
          max-width: 240px;
          margin: 0 auto;
          line-height: 1.6;
          margin-top: 6px;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .journey-steps {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }
          .wave-line {
            display: none;
          }
          .journey-img {
            top: 0;
          }
        }

        @media (max-width: 600px) {
          .journey-steps {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .journey-img {
            width: 200px;
            height: 200px;
            top: 0;
          }
        }
        `}
      </style>

      <div className="journey-section">
        <h2 className="journey-title">Students Journey</h2>

        {/* DOODLES */}
        <div className="doodle d1">✕</div>
        <div className="doodle d2">✦</div>
        <div className="doodle d3">⭘</div>
        <div className="doodle d4">✕</div>

        {/* WAVE LINE (FULL EXTENDED + THIN + ARROW) */}
        <div className="wave-line">
          <svg viewBox="0 0 1500 150">
            <defs>
              <marker 
                id="arrow" 
                markerWidth="10" 
                markerHeight="10" 
                refX="8" 
                refY="5" 
                orient="auto"
              >
                <polygon points="0 0, 10 5, 0 10" fill="#ff8c34" />
              </marker>
            </defs>

            <path
              d="
                M -150 80
                C 180 10,
                  450 140,
                  680 60
                C 900 -10,
                  1150 140,
                  1420 75
              "
              stroke="#1db6a6"
              strokeWidth="2.5"
              strokeDasharray="12 10"
              fill="none"
              strokeLinecap="round"
              markerEnd="url(#arrow)"
            />
          </svg>
        </div>

        {/* STEPS */}
        <div className="journey-steps">

          <div className="journey-item">
            <img
              src="https://images.pexels.com/photos/2774546/pexels-photo-2774546.jpeg"
              className="journey-img"
              alt=""
            />
            <div className="journey-step-title">Budding Engineer</div>
            <p className="journey-step-text">
              Discover subjects, make friends, and start your journey.
            </p>
          </div>

          <div className="journey-item">
            <img
              src="https://images.pexels.com/photos/1181715/pexels-photo-1181715.jpeg"
              className="journey-img"
              alt=""
            />
            <div className="journey-step-title">Beyond the Curriculum</div>
            <p className="journey-step-text">
              Engage in theory, labs, and holistic learning.
            </p>
          </div>

          <div className="journey-item">
            <img
              src="https://images.pexels.com/photos/3184312/pexels-photo-3184312.jpeg"
              className="journey-img"
              alt=""
            />
            <div className="journey-step-title">Hands-on Learning</div>
            <p className="journey-step-text">
              Apply knowledge through practical work and internships.
            </p>
          </div>

          <div className="journey-item">
            <img
              src="https://images.pexels.com/photos/6146973/pexels-photo-6146973.jpeg"
              className="journey-img"
              alt=""
            />
            <div className="journey-step-title">Transition to Career</div>
            <p className="journey-step-text">
              Placement training and real opportunities begin.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default StudentsJourney;
