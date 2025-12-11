// src/pages/AdminCreateCourse.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import { PlusSquare } from "lucide-react";
import courseService from "../services/courseService";

export default function AdminCreateCourse() {
  const [form, setForm] = useState({ courseName: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [courses, setCourses] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const list = await courseService.getAllCourses();
        if (!mounted) return;
        setCourses(list || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!form.courseName) return setMessage({ type: "error", text: "Course name required" });
    setSubmitting(true);
    try {
      const res = await courseService.createCourse(form);
      if (res.success) {
        setMessage({ type: "success", text: "Course created" });
        setForm({ courseName: "", description: "" });
        const list = await courseService.getAllCourses();
        setCourses(list || []);
      } else {
        setMessage({ type: "error", text: res.message || "Failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Server error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --sidebar-width: 300px;        /* INCREASED */
          --sidebar-collapsed: 88px;    /* adjusted */
          --bg-1: #0f172a;              /* deep */
          --muted: #6b7280;
          --accent-1: #0ea5a4;          /* teal */
          --accent-2: #7c3aed;          /* purple */
        }

        /* overall page */
        .admin-course-page {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          color: var(--bg-1);
        }

        /* main area to the right of sidebar */
        .admin-main {
          flex: 1;
          padding: 36px 44px;  /* increased padding */
          transition: margin-left .28s ease, padding .2s ease;
          min-height: 100vh;
        }

        /* wider container for larger screens */
        .course-container {
          max-width: 1400px;  /* increased */
          margin: 0 auto;
        }

        /* header */
        .course-header {
          display:flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 22px;
        }

        .title-block {
          display:flex;
          align-items:center;
          gap:16px;
        }

        .course-title {
          font-size: 26px;     /* increased */
          font-weight: 900;
          letter-spacing: -0.02em;
          color: var(--bg-1);
        }

        .course-sub {
          color: var(--muted);
          font-size: 15px;     /* increased */
          margin-top: 6px;
        }

        /* card styles */
        .card {
          background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95));
          border-radius: 16px; /* larger */
          padding: 22px;       /* larger */
          box-shadow: 0 14px 40px rgba(15,23,42,0.06);
          border: 1px solid rgba(15,23,42,0.03);
          margin-bottom: 20px;
        }

        /* form layout - two column, with larger aside */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 380px; /* increased aside */
          gap: 20px;
          align-items: start;
        }

        .form-col { display:flex; flex-direction:column; gap:14px; }

        .label {
          font-weight: 700;
          color: var(--bg-1);
          font-size: 15px;  /* increased */
          margin-bottom: 6px;
        }

        .input {
          width:100%;
          padding: 14px 16px;   /* larger inputs */
          border-radius: 12px;  /* larger */
          border: 1px solid rgba(15,23,42,0.06);
          background: white;
          font-size: 15px;      /* larger text */
          color: var(--bg-1);
        }

        .input:focus {
          outline: none;
          box-shadow: 0 8px 26px rgba(14,165,164,0.08);
          border-color: rgba(124,58,237,0.9);
        }

        .btn {
          display:inline-flex;
          align-items:center;
          gap:12px;
          padding: 12px 18px;  /* larger buttons */
          border-radius: 12px; /* larger */
          border: none;
          font-weight: 800;
          cursor: pointer;
          transition: transform .12s ease, box-shadow .12s ease;
          font-size: 15px;
        }

        .btn:active { transform: translateY(1px); }

        .btn-primary {
          background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
          color: white;
          box-shadow: 0 12px 30px rgba(124,58,237,0.14);
        }

        .btn-ghost {
          background: transparent;
          border: 1px solid rgba(15,23,42,0.06);
          color: var(--bg-1);
        }

        .info-aside {
          background: linear-gradient(180deg, rgba(124,58,237,0.06), rgba(14,165,164,0.03));
          padding: 18px;
          border-radius: 12px;
          border: 1px solid rgba(15,23,42,0.03);
          font-size: 14px;
          color: var(--bg-1);
        }

        .muted { color: var(--muted); }

        /* course list */
        .list-grid { display:grid; gap:12px; }
        .list-item {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:16px;
          padding: 16px;              /* larger */
          border-radius: 12px;
          border: 1px solid rgba(15,23,42,0.04);
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,255,0.98));
        }

        .course-meta { display:flex; gap:16px; align-items:center; }
        .course-name { font-weight:800; font-size:17px; color: var(--bg-1); }
        .course-code { font-size:14px; color: var(--muted); }

        .avatar-blob {
          width: 64px;          /* larger avatar */
          height: 64px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg,#eef2ff,#fff);
          border: 1px solid rgba(15,23,42,0.03);
          font-weight: 900;
          color: var(--accent-2);
          font-size: 18px;
        }

        /* responsive */
        @media (max-width: 1100px) {
          .form-grid { grid-template-columns: 1fr 320px; }
          .admin-main { padding: 28px 28px; }
        }

        @media (max-width: 980px) {
          .form-grid { grid-template-columns: 1fr; }
          .admin-main { padding: 22px 18px; }
          .course-title { font-size: 22px; }
        }

        @media (max-width: 560px) {
          .admin-main { padding: 14px; }
          .course-title { font-size: 18px; }
          .input { padding: 12px 12px; font-size: 15px; }
          .btn { padding: 10px 12px; font-size: 14px; }
          .avatar-blob { width: 56px; height: 56px; font-size: 16px; }
          .form-grid { gap: 12px; }
        }
      `}</style>

      <div className="admin-course-page">
        <Sidebar onToggle={setSidebarOpen} />

        <main
          className="admin-main"
          style={{ marginLeft: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed)" }}
        >
          <div className="course-container">
            <div className="course-header">
              <div className="title-block">
                <div style={{ width: 64, height: 64, borderRadius: 12, background: "linear-gradient(135deg,var(--accent-1),var(--accent-2))", display: "grid", placeItems: "center", color: "white", boxShadow: "0 12px 30px rgba(14,165,164,0.12)" }}>
                  <PlusSquare size={26} />
                </div>
                <div>
                  <div className="course-title">Course Management</div>
                  <div className="course-sub">Create and manage courses used across the system</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => { setForm({ courseName: "", description: "" }); setMessage({ type: "", text: "" }); }}
                >
                  Reset
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  Quick top
                </button>
              </div>
            </div>

            <div className="card">
              <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-col">
                  <div>
                    <label className="label">Course Name</label>
                    <input
                      name="courseName"
                      value={form.courseName}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., Bachelor of Computer Science"
                    />
                  </div>

                  <div>
                    <label className="label">Description</label>
                    <input
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="input"
                      placeholder="Short description (optional)"
                    />
                  </div>

                  {message.text && (
                    <div style={{
                      marginTop: 10,
                      padding: 12,
                      borderRadius: 10,
                      color: message.type === "success" ? "#064e3b" : "#7f1d1d",
                      background: message.type === "success" ? "#ecfdf5" : "#fff1f2",
                      border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`
                    }}>
                      {message.text}
                    </div>
                  )}

                  <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? "Creating..." : "Create Course"}
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => { setForm({ courseName: "", description: "" }); setMessage({ type: "", text: "" }); }}>
                      Cancel
                    </button>
                  </div>
                </div>

                <aside className="info-aside">
                  <div style={{ fontWeight: 800, marginBottom: 10, color: "var(--bg-1)" }}>Quick tips</div>
                  <div className="muted" style={{ fontSize: 14 }}>
                    • Use consistent course codes (e.g., BCS-101).<br />
                    • Short names are preferred in dropdown menus.<br />
                    • Courses are used across departments, allocations and timetables.
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontWeight: 800, marginBottom: 8 }}>Last updated</div>
                    <div className="muted" style={{ fontSize: 14 }}>{courses.length} courses in system</div>
                  </div>
                </aside>
              </form>
            </div>

            <div className="card">
              <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 18 }}>Existing Courses</h3>

              {loading ? (
                <div className="muted">Loading...</div>
              ) : courses?.length ? (
                <div className="list-grid">
                  {courses.map((c) => (
                    <div key={c._id} className="list-item">
                      <div className="course-meta">
                        <div className="avatar-blob">
                          {(c.courseName || "—").slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <div className="course-name">{c.courseName}</div>
                          <div className="course-code">{c.courseCode || "—"}</div>
                        </div>
                      </div>

                      <div style={{ textAlign: "right", minWidth: 220 }}>
                        <div className="muted" style={{ fontSize: 14 }}>{c.description || "No description"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="muted">No courses created yet.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
