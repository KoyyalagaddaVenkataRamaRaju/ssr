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
          padding: 60px 0;
          background: #ffffff;
          display: flex;
          justify-content: center;
        }

        .stats-container {
          width: 100%;
          max-width: 1200px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          padding: 0 20px;
        }

        .stat-card {
          padding: 25px 10px;
          background: #fff;
          border-radius: 12px;
          display: flex;
          gap: 18px;
          align-items: center;
          transition: 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 1s forwards;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 22px rgba(0,0,0,0.12);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-icon {
          font-size: 42px;
          color: #0bb394;
          opacity: 0;
          animation: iconPop 1s ease forwards;
        }

        @keyframes iconPop {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }

        .stat-value {
          font-size: 30px;
          font-weight: 700;
          color: #0bb394;
          margin: 0;
        }

        .stat-label {
          font-size: 15px;
          color: #354b6d;
          margin: 0;
          margin-top: -3px;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .stats-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }
        }

        @media (max-width: 600px) {
          .stats-container {
            grid-template-columns: 1fr;
            gap: 25px;
          }
          .stat-card {
            flex-direction: column;
            text-align: center;
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
