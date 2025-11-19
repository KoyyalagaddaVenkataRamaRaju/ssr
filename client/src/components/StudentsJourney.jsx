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

        /* =====================================================
           SHOW ONLY FOR DESKTOP
        ===================================================== */
        .desktop-only { display: block; }
        .mobile-only { display: none; }

        /* =====================================================
           WAVE LINE (DESKTOP)
        ===================================================== */
        .wave-line {
          width: 100%;
          max-width: 2000px;
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
          font-size: 22px;
          opacity: 0.75;
          font-weight: 700;
          animation: float 3s infinite alternate ease-in-out;
        }

        .d1 { left: 8%; top: 160px; color: #00c4b4; }
        .d2 { left: 48%; top: 225px; color: #ff8c34; }
        .d3 { right: 24%; top: 155px; color: #6d55e0; }
        .d4 { right: 6%; top: 235px; color: #ffaa3b; }

        @keyframes float {
          from { transform: translateY(0); }
          to   { transform: translateY(-10px); }
        }

        /* =====================================================
           DESKTOP GRID
        ===================================================== */
        .journey-steps {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-top: 80px;
          position: relative;
          z-index: 2;
        }

        .journey-img {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 12px;
          display: block;
          margin: 0 auto;
          position: relative;
          top: -35px;
          transform: rotate(var(--r, -5deg));
          box-shadow: 0 6px 18px rgba(0,0,0,0.15);
          transition: 0.3s ease;
        }

        .journey-img:hover {
          transform: scale(1.1) rotate(0deg);
          box-shadow: 0 12px 32px rgba(0,0,0,0.22);
        }

        .journey-item:nth-child(1) .journey-img { --r: -6deg; }
        .journey-item:nth-child(2) .journey-img { --r: -3deg; }
        .journey-item:nth-child(3) .journey-img { --r: -5deg; }
        .journey-item:nth-child(4) .journey-img { --r: -2deg; }

        .journey-item:nth-child(1) { margin-top: -8px; }
        .journey-item:nth-child(2) { margin-top: 35px; }
        .journey-item:nth-child(3) { margin-top: -8px; }
        .journey-item:nth-child(4) { margin-top: 35px; }

        .journey-step-title {
          font-size: 20px;
          font-weight: 700;
          color: #24324b;
          margin-top: 8px;
        }

        .journey-step-text {
          font-size: 14px;
          color: #6b768a;
          max-width: 250px;
          margin: 6px auto 0;
          line-height: 1.6;
        }

        /* =====================================================
           TABLET VIEW (2 COLUMN)
        ===================================================== */
        @media (max-width: 1024px) {
          .wave-line,
          .doodle {
            display: none;
          }

          .journey-steps {
            grid-template-columns: repeat(2, 1fr);
            margin-top: 40px;
          }

          .journey-img {
            transform: rotate(0deg);
            top: 0;
          }
        }

        /* =====================================================
           MOBILE SLIDER (YOUR FAV VERSION)
        ===================================================== */
        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }

          .mobile-slider {
            display: flex;
            gap: 18px;
            padding: 10px 20px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
          }

          .mobile-slider::-webkit-scrollbar {
            display: none;
          }

          .mobile-card {
            min-width: 260px;
            background: linear-gradient(135deg, #ffffff, #f6f9fc);
            box-shadow: 0 6px 18px rgba(0,0,0,0.08);
            border-radius: 16px;
            padding: 18px;
            scroll-snap-align: center;
            text-align: center;
            position: relative;
          }

          .step-badge {
            position: absolute;
            top: 12px;
            right: 12px;
            background: #ff8c34;
            color: white;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 15px;
            font-weight: 700;
          }

          .mobile-img {
            width: 180px;
            height: 180px;
            object-fit: cover;
            border-radius: 14px;
            margin: 10px auto;
            display: block;
            box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          }

          .mobile-title {
            font-size: 18px;
            font-weight: 700;
            color: #24324b;
            margin-top: 10px;
          }

          .mobile-text {
            color: #6b768a;
            font-size: 14px;
            margin-top: 6px;
            line-height: 1.6;
          }
        }

        /* Ultra-small screens */
        @media (max-width: 400px) {
          .mobile-img { width: 160px; height: 160px; }
        }
        `}
      </style>

      <div className="journey-section">
        <h2 className="journey-title">Students Journey</h2>

        {/* DESKTOP CONTENT */}
        <div className="desktop-only">

          {/* DOODLES */}
          <div className="doodle d1">✕</div>
          <div className="doodle d2">✦</div>
          <div className="doodle d3">⭘</div>
          <div className="doodle d4">✕</div>

          {/* WAVE */}
          <div className="wave-line">
            <svg viewBox="0 0 2500 180">
              <defs>
                <marker id="arrow" markerWidth="14" markerHeight="14" refX="8" refY="5" orient="auto">
                  <polygon points="0 0, 10 5, 0 10" fill="#ff8c34" />
                </marker>
              </defs>

              <path
                d="M -300 80 C 300 10, 800 140, 1200 60 C 1650 -10, 2000 140, 2400 75"
                stroke="#1db6a6"
                strokeWidth="3"
                strokeDasharray="14 12"
                fill="none"
                markerEnd="url(#arrow)"
              />
            </svg>
          </div>

          {/* STEPS DESKTOP */}
          <div className="journey-steps">
            <div className="journey-item">
              <img src="https://media.istockphoto.com/id/1368049990/photo/shot-of-a-businessman-walking-up-a-flight-of-stairs-against-an-urban-background.jpg?s=612x612&w=0&k=20&c=51d3U4crz5JQwNEWvo2lEaT937dFjc0RnW9G6X0UvyI=" className="journey-img" />
              <div className="journey-step-title">Budding Engineer</div>
              <p className="journey-step-text">Discover subjects, make friends, and start your journey.</p>
            </div>

            <div className="journey-item">
              <img src="https://images.pexels.com/photos/1181715/pexels-photo-1181715.jpeg" className="journey-img" />
              <div className="journey-step-title">Beyond the Curriculum</div>
              <p className="journey-step-text">Engage in theory, labs, and holistic learning.</p>
            </div>

            <div className="journey-item">
              <img src="https://images.pexels.com/photos/3184312/pexels-photo-3184312.jpeg" className="journey-img" />
              <div className="journey-step-title">Hands-on Learning</div>
              <p className="journey-step-text">Apply knowledge through practical work and internships.</p>
            </div>

            <div className="journey-item">
              <img src="https://media.istockphoto.com/id/2164232127/photo/cropped-hands-of-people-throwing-mortarboards-against-clear-sky.jpg?s=612x612&w=0&k=20&c=fnLryvotqB5UoXkMXFSBBX-iOKPKvSw2-kiCQKPUN7c=" className="journey-img" />
              <div className="journey-step-title">Transition to Career</div>
              <p className="journey-step-text">Placement training and real opportunities begin.</p>
            </div>
          </div>
        </div>

        {/* MOBILE CONTENT */}
        <div className="mobile-only">
          <div className="mobile-slider">

            <div className="mobile-card">
              <div className="step-badge">1</div>
              <img src="https://images.pexels.com/photos/2774546/pexels-photo-2774546.jpeg" className="mobile-img" />
              <div className="mobile-title">Budding Engineer</div>
              <p className="mobile-text">Discover subjects, make friends, and start your journey.</p>
            </div>

            <div className="mobile-card">
              <div className="step-badge">2</div>
              <img src="https://images.pexels.com/photos/1181715/pexels-photo-1181715.jpeg" className="mobile-img" />
              <div className="mobile-title">Beyond the Curriculum</div>
              <p className="mobile-text">Engage in theory, labs, and holistic learning.</p>
            </div>

            <div className="mobile-card">
              <div className="step-badge">3</div>
              <img src="https://images.pexels.com/photos/3184312/pexels-photo-3184312.jpeg" className="mobile-img" />
              <div className="mobile-title">Hands-on Learning</div>
              <p className="mobile-text">Apply knowledge through practical work and internships.</p>
            </div>

            <div className="mobile-card">
              <div className="step-badge">4</div>
              <img src="https://images.pexels.com/photos/6146973/pexels-photo-6146973.jpeg" className="mobile-img" />
              <div className="mobile-title">Transition to Career</div>
              <p className="mobile-text">Placement training and real opportunities begin.</p>
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default StudentsJourney;
