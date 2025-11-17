import React from "react";
import Navbar from "./Navbar";


const VisionMission = () => {
  return (
    <>
    <Navbar/>
      <style>
        {`
        .vm-header {
          background: linear-gradient(135deg, #7A54B1, #9d6de1);
          padding: 70px 20px;
          text-align: center;
          color: white;
        }

        .vm-title {
          font-size: 34px;
          font-weight: 700;
        }

        .vm-section {
          max-width: 1100px;
          margin: 40px auto;
          padding: 20px;
          display: flex;
          gap: 30px;
        }

        .vm-box {
          background: white;
          flex: 1;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
        }

        .vm-heading {
          font-size: 22px;
          font-weight: 700;
          color: #7A54B1;
          margin-bottom: 15px;
        }

        .vm-text {
          font-size: 16px;
          color: #444;
          line-height: 1.8;
        }

        @media (max-width: 768px) {
          .vm-section {
            flex-direction: column;
          }
        }
        `}
      </style>

      {/* HEADER */}
      <div className="vm-header">
        <h1 className="vm-title">Vision & Mission</h1>
      </div>

      {/* CONTENT */}
      <div className="vm-section">

        {/* Vision */}
        <div className="vm-box">
          <h3 className="vm-heading">Our Vision</h3>
          <p className="vm-text">
            To emerge as a premier institution that transforms students into
            globally competent individuals, fostering innovation, research, and
            excellence in education.
          </p>
        </div>

        {/* Mission */}
        <div className="vm-box">
          <h3 className="vm-heading">Our Mission</h3>
          <p className="vm-text">
            ● Provide high-quality education that focuses on academic and personal growth.
            <br /><br />
            ● Develop leadership, discipline, and problem-solving abilities in students.
            <br /><br />
            ● Enhance skills through practical exposure, mentorship, and research.
            <br /><br />
            ● Cultivate ethical values and a sense of social responsibility.
          </p>
        </div>

      </div>
    </>
  );
};

export default VisionMission;
