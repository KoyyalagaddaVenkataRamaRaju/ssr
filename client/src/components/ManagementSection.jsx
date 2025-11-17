import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ManagementSection = () => {
  return (
    <>
      <style>
        {`
        :root {
          --primary: #0bb394;
          --text-dark: #333;
          --text-light: #777;
          --card-border: #eee;
        }

        .ssr-section {
          padding: 70px 0;
          background: #fff;
        }

        .section-title {
          font-size: 28px;
          font-weight: 600;
          color: var(--primary);
          text-align: center;
          letter-spacing: 1px;
          margin-bottom: 10px;
          animation: fadeDown 0.7s ease;
        }

        .section-line {
          width: 90px;
          height: 2px;
          background: var(--primary);
          margin: 0 auto 40px;
          animation: fadeDown 0.9s ease;
        }

        .about-text {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-light);
          margin-top: 15px;
          text-align: justify;
          animation: fadeUp 1s ease;
        }

        .about-box {
          padding: 10px;
        }

        .about-logo {
          width: 110px;
          margin-right: 18px;
        }

        .read-btn {
          padding: 8px 20px;
          border-radius: 4px;
          border: 1px solid #aaa;
          background: transparent;
          margin-top: 15px;
          color: var(--text-dark);
          transition: 0.3s;
        }

        .read-btn:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        /* ================================
           MANAGEMENT GRID (2 ROWS)
        ================================= */
        .management-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 20px;
        }

        @media(max-width: 992px) {
          .management-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media(max-width: 576px) {
          .management-grid {
            grid-template-columns: repeat(1, 1fr);
          }
        }

        .management-card {
          padding: 20px;
          background: #fafafa;
          border-radius: 10px;
          border: 1px solid var(--card-border);
          text-align: center;
          transition: 0.3s;
          animation: fadeUp 0.9s ease;
        }

        .management-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.1);
        }

        .m-photo {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 50%;
          margin-bottom: 12px;
          border: 3px solid var(--primary);
        }

        .m-name {
          font-size: 17px;
          font-weight: 600;
          color: var(--text-dark);
          margin: 3px 0;
        }

        .m-role {
          font-size: 14px;
          color: var(--primary);
          margin-bottom: 5px;
        }

        .m-org {
          font-size: 13px;
          color: var(--text-light);
          margin-bottom: 8px;
        }

        .m-read {
          font-size: 13px;
          color: var(--primary);
          cursor: pointer;
        }

        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>

      <div className="container ssr-section">

        {/* ABOUT SSR COLLEGE */}
        <h2 className="section-title">SSR EDUCATIONAL SOCIETY</h2>
        <div className="section-line"></div>

        <div className="row mb-5">
          <div className="col-md-6 d-flex about-box">
            <img src="/images/ssr-logo.png" className="about-logo" />

            <p className="about-text">
              The SSR Educational Society is committed to empowering rural and
              semi-urban communities with high-quality, affordable, and modern
              education. The society continues to grow as a symbol of discipline,
              innovation, and academic excellence—shaping bright futures through 
              value-based learning, leadership training, and holistic development.
            </p>
          </div>

          <div className="col-md-6 d-flex align-items-center">
            <button className="read-btn mx-auto">READ MORE</button>
          </div>
        </div>

        {/* MANAGEMENT SECTION */}
        <h2 className="section-title">MANAGEMENT</h2>
        <div className="section-line"></div>

        <div className="management-grid">

          {[
            { name: "Sri S R Prakash Rao", role: "Chairman", img: "/images/manager1.jpg" },
            { name: "Dr. P Sai Ram", role: "Vice Chairman", img: "/images/manager2.jpg" },
            { name: "Sri A M Viswanath", role: "Secretary", img: "/images/manager3.jpg" },
            { name: "Sri K Srilokanath", role: "Joint Secretary", img: "/images/manager4.jpg" },
            { name: "Dr. V R Srikanth", role: "Principal", img: "/images/principal.jpg" },
            { name: "Dr. S N Rao", role: "Director", img: "/images/director.jpg" },
          ].map((item, index) => (
            <div className="management-card" key={index}>
              <img src={item.img} className="m-photo" alt={item.name} />
              <p className="m-name">{item.name}</p>
              <p className="m-role">{item.role}</p>
              <p className="m-org">SSR Educational Society</p>
              <span className="m-read">Read More</span>
            </div>
          ))}

        </div>
      </div>
    </>
  );
};

export default ManagementSection;
