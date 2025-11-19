import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDepartmentById } from "../services/departmentService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DepartmentPage = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDepartment();
    // eslint-disable-next-line
  }, [id]);

  const loadDepartment = async () => {
    try {
      const res = await getDepartmentById(id);
      setDepartment(res.data);
    } catch (error) {
      console.error("Error loading department:", error);
      setDepartment(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 80, textAlign: "center" }}>
          <h2 style={{ color: "#7A54B1" }}>Loading Department...</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (!department) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 80, textAlign: "center" }}>
          <h2 style={{ color: "#d9534f" }}>Department Not Found</h2>
        </div>
        <Footer />
      </>
    );
  }

  // small utility: safe slug for meta/use (not used for routing)
  const slug = (s) => (s || "").replace(/\s+/g, "-");

  return (
    <>
      {/* INTERNAL CSS */}
      <style>{`
        :root{
          --primary: #7A54B1;
          --accent: #ff7b29;
          --muted: #6b6b6b;
          --card-bg: #ffffff;
        }

        .dept-hero {
          position: relative;
          width: 100%;
          min-height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .dept-hero .hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.95) contrast(1.02);
          transform-origin: center;
          transition: transform 12s linear;
        }
        /* very slow ken burns */
        .dept-hero:hover .hero-img { transform: scale(1.03); }

        .dept-hero .overlay {
          position:absolute; inset:0;
          background: linear-gradient(180deg, rgba(122,84,177,0.65) 0%, rgba(122,84,177,0.45) 40%, rgba(0,0,0,0.18) 100%);
        }

        .dept-hero .hero-content {
          position: relative;
          z-index: 3;
          color: white;
          text-align: center;
          padding: 24px;
          max-width: 1100px;
        }
        .dept-title {
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -0.6px;
          margin: 0 0 6px;
        }
        .dept-sub {
          color: rgba(255,255,255,0.92);
          margin: 0 0 14px;
          font-size: 15px;
        }

        .dept-meta {
          display: inline-flex;
          gap: 12px;
          align-items: center;
          margin-top: 12px;
        }
        .pill {
          background: rgba(255,255,255,0.12);
          padding: 8px 12px;
          border-radius: 999px;
          font-weight:600;
          font-size:13px;
          display:inline-flex;
          gap:8px;
          align-items:center;
        }

        .container {
          max-width: 1100px;
          margin: 30px auto;
          padding: 0 18px 60px;
        }

        .dept-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 28px;
          align-items: start;
        }

        /* left column: about + batches */
        .card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(30,30,60,0.06);
        }

        .dept-description {
          color: #333;
          font-size: 16px;
          line-height: 1.7;
        }

        .batches-grid {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }

        .batch-card {
          background: linear-gradient(180deg, rgba(122,84,177,0.04), rgba(255,255,255,1));
          border-radius: 10px;
          padding: 12px;
          transition: transform .18s ease, box-shadow .18s ease;
          cursor: pointer;
          border: 1px solid rgba(122,84,177,0.06);
        }
        .batch-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 22px rgba(122,84,177,0.09);
        }
        .batch-name {
          font-weight:700;
          color: #222;
          margin:0 0 6px;
        }
        .batch-meta {
          font-size:13px; color: var(--muted);
        }

        /* right column: stats / contact / quick actions */
        .info-side {
          display:flex;
          flex-direction: column;
          gap: 14px;
        }

        .stat {
          display:flex;
          gap: 12px;
          align-items:center;
        }
        .stat .num{
          background: linear-gradient(90deg,var(--primary), #9d6de1);
          color:white;
          min-width:56px;
          height:56px;
          border-radius:10px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight:800;
          font-size:20px;
          box-shadow: 0 8px 18px rgba(122,84,177,0.12);
        }
        .stat .label { font-weight:700; color:#333; }
        .stat .small { color:var(--muted); font-size:13px; }

        .cta {
          margin-top:8px;
          display:flex;
          gap:10px;
        }
        .btn {
          flex:1;
          padding:12px 14px;
          border-radius:10px;
          border:none;
          font-weight:700;
          cursor:pointer;
          transition: transform .14s ease, box-shadow .14s ease;
        }
        .btn-primary {
          background: linear-gradient(90deg, var(--primary), #9d6de1);
          color:#fff;
          box-shadow: 0 10px 22px rgba(122,84,177,0.12);
        }
        .btn-primary:hover { transform: translateY(-4px); box-shadow: 0 16px 36px rgba(122,84,177,0.16); }
        .btn-outline {
          background: white;
          border: 1px solid rgba(122,84,177,0.12);
          color: var(--primary);
        }
        .btn-outline:hover { transform: translateY(-3px); }

        /* faculty section (placeholder) */
        .fac-list { display:flex; flex-direction:column; gap:12px; margin-top:8px; }
        .fac-item { display:flex; gap:12px; align-items:center; }
        .fac-avatar {
          width:52px; height:52px; border-radius:10px; object-fit:cover;
          background: #eee; flex-shrink:0;
        }
        .fac-meta { font-size:14px; color:#333; font-weight:700; }

        /* responsive */
        @media (max-width: 980px) {
          .dept-grid { grid-template-columns: 1fr; }
          .dept-hero { min-height: 260px; }
          .dept-title { font-size: 28px; }
        }
        @media (max-width: 520px) {
          .dept-hero { min-height: 220px; }
          .dept-title { font-size: 22px; }
          .stat .num { min-width:48px; height:48px; font-size:18px; }
          .batch-card { padding:10px; }
        }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section className="dept-hero" aria-label={`${department.departmentName} hero`}>
        <img
          className="hero-img"
          src={department.departmentImage}
          alt={department.departmentName}
        />
        <div className="overlay" />
        <div className="hero-content">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            {/* small badge */}
            <div style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: 10,
              padding: "8px 12px",
              color: "#fff",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{opacity:0.95}}>
                <path d="M12 2L15 9H21L16.5 13L18.5 20L12 16L5.5 20L7.5 13L3 9H9L12 2Z" fill="white" />
              </svg>
              Department
            </div>
          </div>

          <h1 className="dept-title">{department.departmentName}</h1>
          <p className="dept-sub">
            {department.description?.slice(0, 160)}{department.description?.length > 160 ? "…" : ""}
          </p>

          <div className="dept-meta">
            <div className="pill">ID: {department.departmentId || "—"}</div>
            <div className="pill">Created: {new Date(department.createdAt).toLocaleDateString()}</div>
            <div className="pill">Active: {department.isActive ? "Yes" : "No"}</div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="container" role="main">
        <div className="dept-grid">
          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>About the Department</h3>
              <p className="dept-description">{department.description}</p>

              <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <h4 style={{ margin: 0 }}>Batches</h4>
                <div style={{ color: "var(--muted)", fontSize: 14 }}>{department.batches?.length || 0} batches</div>
              </div>

              <div className="batches-grid">
                {department.batches && department.batches.length > 0 ? (
                  department.batches.map((b) => (
                    <article key={b.batchId} className="batch-card" role="article" aria-label={b.batchName}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div className="batch-name">{b.batchName}</div>
                          <div className="batch-meta">Batch ID: {String(b.batchId).slice(0, 8)}</div>
                        </div>
                        <div style={{ textAlign: "right", color: "var(--muted)", fontSize: 13 }}>
                          <div style={{ fontWeight: 800 }}>Active</div>
                          <div>Students: —</div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div style={{ padding: 12, color: "var(--muted)" }}>No batches added yet.</div>
                )}
              </div>
            </div>

            {/* Additional cards: Faculty / Gallery / Resources (example placeholders) */}
            <div className="card">
              <h4 style={{ marginTop: 0 }}>Faculty & Resources</h4>
              <p style={{ marginTop: 6, color: "var(--muted)" }}>
                This section lists core faculty, resource links, and research highlights for the department.
              </p>

              <div className="fac-list">
                {/* sample placeholders - ideally you'll map real faculty from backend */}
                <div className="fac-item">
                  <img className="fac-avatar" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=60&auto=format&fit=crop" alt="Faculty" />
                  <div>
                    <div className="fac-meta">Dr. A. Example</div>
                    <div style={{ color: "var(--muted)", fontSize: 13 }}>Professor & Head</div>
                  </div>
                </div>

                <div className="fac-item">
                  <img className="fac-avatar" src="https://images.unsplash.com/photo-1545996124-3f8c77f85f33?w=200&q=60&auto=format&fit=crop" alt="Faculty" />
                  <div>
                    <div className="fac-meta">Ms. B. Example</div>
                    <div style={{ color: "var(--muted)", fontSize: 13 }}>Assistant Professor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="info-side">
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                  <h4 style={{ margin: 0 }}>{department.departmentName}</h4>
                  <div style={{ color: "var(--muted)", fontSize: 14 }}>Department overview & quick stats</div>
                </div>
                <img src={department.departmentImage} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 12 }} />
              </div>

              <div style={{ marginTop: 16 }}>
                <div className="stat" style={{ marginBottom: 12 }}>
                  <div className="num">{department.batches?.length || 0}</div>
                  <div>
                    <div className="label">Batches</div>
                    <div className="small">Active / archived</div>
                  </div>
                </div>

                <div className="stat" style={{ marginBottom: 12 }}>
                  <div className="num">—</div>
                  <div>
                    <div className="label">Students</div>
                    <div className="small">Estimated total</div>
                  </div>
                </div>

                <div className="stat">
                  <div className="num">—</div>
                  <div>
                    <div className="label">Faculty</div>
                    <div className="small">Core & visiting</div>
                  </div>
                </div>
              </div>

              <div className="cta" style={{ marginTop: 16 }}>
                <button className="btn btn-primary" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}>
                  Apply to Department
                </button>
                <button className="btn btn-outline" onClick={() => window.location.href = "/contact"}>
                  Contact
                </button>
              </div>
            </div>

            {/* quick links / resources */}
            <div className="card">
              <h4 style={{ marginTop: 0 }}>Quick Links</h4>
              <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)" }}>
                <li style={{ marginBottom: 8 }}>Syllabus & Curriculum</li>
                <li style={{ marginBottom: 8 }}>Lab & Facilities</li>
                <li style={{ marginBottom: 8 }}>Research Publications</li>
                <li>Placement Records</li>
              </ul>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <h4 style={{ marginTop: 0 }}>Student Testimonials</h4>
              <p style={{ color: "var(--muted)" }}>
                "This department helped me unlock my potential." — Student A
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
                {/* decorative stars */}
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill={s<=5 ? "url(#g)" : "none"} xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="g" x1="0" x2="1">
                        <stop offset="0" stopColor="#ffd166"></stop>
                        <stop offset="1" stopColor="#ff7b29"></stop>
                      </linearGradient>
                    </defs>
                    <path d="M12 2L15 9H21L16.5 13L18.5 20L12 16L5.5 20L7.5 13L3 9H9L12 2Z" fill="url(#g)"/>
                  </svg>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DepartmentPage;
