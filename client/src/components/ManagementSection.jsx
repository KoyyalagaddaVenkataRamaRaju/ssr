import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const people = [
  {
    id: 1,
    name: "Sri S R Prakash Rao",
    role: "Chairman",
    img: "/images/manager1.jpg",
    bio: "Visionary leader with 25+ years of educational administration experience; champions quality & access to education."
  },
  {
    id: 2,
    name: "Dr. P Sai Ram",
    role: "Vice Chairman",
    img: "/images/manager2.jpg",
    bio: "Academic strategist and research advocate focused on faculty development and industry partnerships."
  },
  {
    id: 3,
    name: "Sri A M Viswanath",
    role: "Secretary",
    img: "/images/manager3.jpg",
    bio: "Oversees campus operations and long-term development initiatives, bringing operational excellence to SSR."
  },
  {
    id: 4,
    name: "Sri K Srilokanath",
    role: "Joint Secretary",
    img: "/images/manager4.jpg",
    bio: "Focuses on student welfare, outreach programs and strengthening community engagement."
  },
  {
    id: 5,
    name: "Dr. V R Srikanth",
    role: "Principal",
    img: "/images/principal.jpg",
    bio: "Academic head guiding curriculum, assessments, and student success programs."
  },
  {
    id: 6,
    name: "Dr. S N Rao",
    role: "Director",
    img: "/images/director.jpg",
    bio: "Leads research, innovation labs and industry collaboration at SSR College."
  },
];

const ManagementSection = () => {
  return (
    <>
      <style>{`
        :root{
          --primary: #7A54B1;
          --secondary: #0bb394;
          --bg-start: #f7f4ff;
          --bg-end: #ffffff;
          --glass: rgba(255,255,255,0.45);
        }

        .mgmt-section{
          padding: 80px 16px 120px;
          background: linear-gradient(180deg, var(--bg-start), var(--bg-end));
        }

        .mgmt-header {
          text-align: center;
          margin-bottom: 28px;
        }
        .mgmt-title {
          font-size: 32px;
          font-weight: 800;
          color: var(--primary);
        }
        .mgmt-subline {
          width: 110px;
          height: 4px;
          margin: 14px auto 0;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
        }

        .about-box{
          max-width: 1100px;
          margin: 18px auto 36px;
          background: var(--glass);
          padding: 20px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 18px;
          box-shadow: 0 12px 36px rgba(12,16,30,0.06);
        }
        .about-img { width: 120px; border-radius: 12px; object-fit: cover; }
        .about-text { color: #666; line-height: 1.6; font-size: 15px; }

        /* Grid */
        .mgmt-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        @media (max-width: 992px){ .mgmt-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px){ .mgmt-grid { grid-template-columns: 1fr; } }

        /* NORMAL CARD (No flip) */
        .mgmt-card {
          padding: 28px;
          border-radius: 18px;
          text-align: center;
          background: linear-gradient(180deg, rgba(255,255,255,0.48), rgba(255,255,255,0.15));
          border: 1px solid rgba(255,255,255,0.55);
          box-shadow: 0 18px 40px rgba(8,10,30,0.06);
          transition: .35s ease;
        }

        .mgmt-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.12);
        }

        /* Photo */
        .profile-photo {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #fff;
          box-shadow: 0 14px 40px rgba(12,18,30,0.12);
          margin-bottom: 14px;
        }

        .name {
          font-size: 19px;
          font-weight: 800;
          color: #111;
        }
        .role {
          font-size: 15px;
          font-weight: 700;
          color: var(--primary);
        }
        .bio {
          margin-top: 10px;
          font-size: 14px;
          color: #444;
          line-height: 1.6;
        }

        .btn-read {
          margin-top: 14px;
          padding: 10px 18px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          color: white;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>

      <section className="mgmt-section">
        <div className="mgmt-header">
          <div className="mgmt-title">SSR EDUCATIONAL SOCIETY</div>
          <div className="mgmt-subline" />
        </div>

        <div className="about-box">
          <img
            src="https://content.jdmagicbox.com/comp/machilipatnam/r8/9999p8672.8672.161001121858.x5r8/catalogue/s-s-r-degree-college-jagannadhapuram-machilipatnam-colleges-mm6trhn.jpg"
            alt="SSR College"
            className="about-img"
          />
          <p className="about-text">
            The SSR Educational Society is dedicated to transforming rural and semi-urban students
            into responsible, skilled, and future-ready professionals. Through modern academics,
            leadership training and community programs, SSR builds strong foundations for lifelong success.
          </p>
        </div>

        <div className="mgmt-grid">
          {people.map((p) => (
            <div key={p.id} className="mgmt-card">
              <img src={p.img} alt={p.name} className="profile-photo" />
              <div className="name">{p.name}</div>
              <div className="role">{p.role}</div>
              <div className="bio">{p.bio}</div>

              <button
                className="btn-read"
                onClick={() => (window.location.href = `/management/${p.id}`)}
              >
                Read More →
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ManagementSection;
