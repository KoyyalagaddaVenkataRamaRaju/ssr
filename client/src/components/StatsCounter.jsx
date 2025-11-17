import React, { useEffect, useRef, useState } from "react";
import { FaUniversity, FaUserGraduate, FaBookOpen, FaAward } from "react-icons/fa";

const StatsCounter = () => {
  const ref = useRef(null);
  const [startCount, setStartCount] = useState(false);

  const [counts, setCounts] = useState({
    placements: 0,
    students: 0,
    books: 0,
    triumphs: 0,
  });

  const targetValues = {
    placements: 98.7,
    students: 10000,
    books: 7500,
    triumphs: 99,
  };

  // Detect when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStartCount(true);
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);
  }, []);

  // Counter animation
  useEffect(() => {
    if (!startCount) return;

    const duration = 2000;
    const fps = 60;
    const steps = duration / (1000 / fps);
    let step = 0;

    const animate = () => {
      step++;

      setCounts({
        placements: (targetValues.placements / steps) * step,
        students: Math.floor((targetValues.students / steps) * step),
        books: Math.floor((targetValues.books / steps) * step),
        triumphs: Math.floor((targetValues.triumphs / steps) * step),
      });

      if (step < steps) requestAnimationFrame(animate);
    };

    animate();
  }, [startCount]);

  return (
    <>
      <style>
        {`
        .stats-section {
          padding: 70px 0;
          background: #FFF4E5; /* LIGHT ORANGE BG */
          display: flex;
          justify-content: center;
        }

        .stats-container {
          width: 100%;
          max-width: 1300px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          padding: 0 25px;
        }

        .stat-card {
          background: #ffffff;
          padding: 28px 18px;
          border-radius: 14px;
          display: flex;
          gap: 18px;
          align-items: center;
          transition: 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 1s forwards;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.18);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-icon {
          font-size: 46px;
          color: #ff7b29; /* Orange icon */
          opacity: 0;
          animation: iconPop 1s ease forwards;
        }

        @keyframes iconPop {
          0% { opacity: 0; transform: scale(0.6); }
          100% { opacity: 1; transform: scale(1); }
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #ff7b29;
          margin: 0;
        }

        .stat-label {
          font-size: 15px;
          color: #354b6d;
          margin: 0;
          margin-top: -3px;
        }

        /* ---------- RESPONSIVE ---------- */

        /* Tablets */
        @media (max-width: 992px) {
          .stats-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }
          .stat-card {
            padding: 25px 15px;
          }
          .stat-value {
            font-size: 28px;
          }
          .stat-icon {
            font-size: 40px;
          }
        }

        /* Mobile Large */
        @media (max-width: 768px) {
          .stats-container {
            gap: 22px;
          }
          .stat-card {
            flex-direction: row;
            text-align: left;
          }
        }

        /* Small phones */
        @media (max-width: 600px) {
          .stats-container {
            grid-template-columns: 1fr;
          }
          .stat-card {
            flex-direction: column;
            text-align: center;
            gap: 12px;
            padding: 20px 15px;
          }
          .stat-icon {
            font-size: 38px;
          }
          .stat-value {
            font-size: 26px;
          }
        }

        /* Extra small devices */
        @media (max-width: 400px) {
          .stat-value {
            font-size: 24px;
          }
          .stat-icon {
            font-size: 35px;
          }
        }
        `}
      </style>

      <div className="stats-section" ref={ref}>
        <div className="stats-container">

          <div className="stat-card">
            <FaUniversity className="stat-icon" />
            <div>
              <p className="stat-value">{counts.placements.toFixed(1)}%</p>
              <p className="stat-label">Placements</p>
            </div>
          </div>

          <div className="stat-card">
            <FaUserGraduate className="stat-icon" />
            <div>
              <p className="stat-value">
                {counts.students >= 10000 ? "10k" : counts.students}
              </p>
              <p className="stat-label">Total Students</p>
            </div>
          </div>

          <div className="stat-card">
            <FaBookOpen className="stat-icon" />
            <div>
              <p className="stat-value">
                {counts.books >= 7500 ? "7500+" : counts.books}
              </p>
              <p className="stat-label">Library Books</p>
            </div>
          </div>

          <div className="stat-card">
            <FaAward className="stat-icon" />
            <div>
              <p className="stat-value">
                {counts.triumphs >= 99 ? "99+" : counts.triumphs}
              </p>
              <p className="stat-label">Student Triumphs</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default StatsCounter;
