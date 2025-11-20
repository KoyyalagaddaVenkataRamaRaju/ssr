import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Responsive AdminRecruiters.jsx — sidebar aware "like previous one"
 */
const AdminRecruiters = () => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [editingLogo, setEditingLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // UI controls
  const [searchQ, setSearchQ] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);
  const [sortDir, setSortDir] = useState("asc"); // asc / desc

  const API_URL = import.meta.env.VITE_API_URL;
  const fileInputRef = useRef(null);

  // Fetch Recruiter logos
  const fetchLogos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/recruiters`);
      const data = await res.json();
      if (data.success) setLogos(data.data || []);
      else showAlert("danger", "Failed to load recruiters");
    } catch (err) {
      showAlert("danger", "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && showModal) closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append("companyName", companyName);
      form.append("order", order);
      form.append("isActive", isActive ? "true" : "false");
      if (imageFile) form.append("image", imageFile);

      const method = editingLogo ? "PUT" : "POST";
      const url = editingLogo
        ? `${API_URL}/api/recruiters/${editingLogo._id}`
        : `${API_URL}/api/recruiters`;

      const res = await fetch(url, { method, body: form });
      const data = await res.json();

      if (data.success) {
        showAlert("success", data.message || "Saved successfully");
        await fetchLogos();
        closeModal();
      } else {
        showAlert("danger", data.message || "Save failed");
      }
    } catch (err) {
      showAlert("danger", "Error saving image");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLogo(null);
    setCompanyName("");
    setOrder(0);
    setIsActive(true);
    setPreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleEdit = (logo) => {
    setEditingLogo(logo);
    setCompanyName(logo.companyName);
    setOrder(logo.order ?? 0);
    setIsActive(logo.isActive ?? true);
    setPreview(logo.imageUrl);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recruiter logo?")) return;
    try {
      const res = await fetch(`${API_URL}/api/recruiters/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        showAlert("success", "Logo deleted");
        fetchLogos();
      } else {
        showAlert("danger", "Delete failed");
      }
    } catch (err) {
      showAlert("danger", "Network error");
    }
  };

  // UI helpers
  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return setPreview(null);
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };
  const clearImage = () => {
    setImageFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  // Derived list
  const displayed = logos
    .filter((l) => {
      if (!searchQ) return true;
      const q = searchQ.toLowerCase();
      return (
        (l.companyName || "").toLowerCase().includes(q) ||
        String(l.order).includes(q)
      );
    })
    .filter((l) => (onlyActive ? l.isActive === true : true))
    .sort((a, b) => {
      const A = Number(a.order || 0);
      const B = Number(b.order || 0);
      return sortDir === "asc" ? A - B : B - A;
    });

  return (
    <>
      <style>{`
        :root {
          --primary: #6a4ed9;
          --accent: #ff8c42;
          --muted: #6b6b6b;
        }

        .admin-page {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg,#f3e5f5,#e0f7fa);
        }
        .main-content {
          flex: 1;
          padding: 28px 36px;
          transition: margin-left .32s ease;
        }
        .page-title {
          font-size: 32px;
          font-weight: 800;
          color: var(--primary);
        }
        .small-muted {
          color: var(--muted);
          font-size: 15px;
          font-weight: 500;
        }
        .toolbar {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .search-input {
          min-width: 200px;
          max-width: 380px;
          width: 100%;
        }
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill,minmax(240px,1fr));
          gap: 18px;
          margin-top: 18px;
        }
        .card-advanced {
          background: linear-gradient(180deg,#ffffff,#fbfbfd);
          border-radius: 12px;
          padding: 14px;
          border: 1px solid rgba(110,100,180,0.06);
          transition: .22s ease;
          box-shadow: 0 6px 20px rgba(25,30,50,0.04);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .logo-wrap {
          width: 100%;
          height: 120px;
          background: #fafafa;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-wrap img {
          max-height: 92px;
          max-width: 90%;
          object-fit: contain;
        }
        .company { 
          margin-top: 10px; 
          font-weight: 700; 
          text-align: center; 
        }
        .meta.d-flex, .meta {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }
        .badge-order {
          padding: 5px 8px;
          font-size: 14px;
          border-radius: 999px;
          background: rgba(106,78,217,.08);
          color: var(--primary);
          font-weight: 700;
        }
        .badge-state {
          padding: 5px 8px;
          font-size: 14px;
          border-radius: 999px;
          color: white;
          font-weight: 700;
        }
        .badge-active { background: #28c76f; }
        .badge-inactive { background: #99a0a6; }
        .btn, .btn-sm {
          font-size: 15px;
        }
        /* Modal styling */
        .modal-backdrop-custom {
          position: fixed;
          inset: 0;
          background: rgba(7,8,12,0.36);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 12px;
          z-index: 2000;
        }
        .modal-glass {
          width: 100%;
          max-width: 400px;
          background: rgba(255,255,255,.97);
          padding: 14px 8px;
          border-radius: 16px;
          box-shadow: 0 10px 42px rgba(25,30,50,0.08);
          backdrop-filter: blur(8px);
        }
        .preview-img {
          max-height: 180px;
          width: 100%;
          object-fit: contain;
          border-radius: 12px;
        }
        @media (max-width: 992px) {
          .main-content { padding: 22px 10px; }
        }
        @media(max-width: 840px) {
          .main-content { padding: 8px 2vw; }
          .toolbar { gap:6px; }
        }
        @media(max-width: 675px) {
          .page-title { font-size: 20px; text-align:center; }
          .toolbar { flex-direction: column; align-items: stretch; gap:6px; }
          .modal-glass { max-width: 97vw; }
          .main-content { padding:4px 1vw;}
          .search-input { min-width:80px; }
          .cards-grid { grid-template-columns:1fr; }
          .card-advanced { padding: 8px; }
        }
        @media(max-width: 445px) {
          .modal-glass { padding: 3vw 1vw;}
          .main-content { padding:1vw; }
          .page-title { font-size: 15px; }
          .preview-img { max-height: 110px; }
          .card-advanced { font-size:13px;}
          .btn,.btn-sm { font-size:13px;}
        }
      `}</style>
      <div className="admin-page">
        <Sidebar onToggle={setSidebarOpen} />
        <main
          className="main-content"
          style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}
        >
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <div>
              <h2 className="page-title">Recruiter Logos</h2>
              <div className="small-muted">
                Manage logos shown on your placements / partners section
              </div>
            </div>
            <div className="toolbar">
              <div className="search-input">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search by company or order..."
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
              </div>
              <div className="d-flex gap-2 align-items-center">
                <div className="form-check form-switch me-1">
                  <input
                    id="onlyActive"
                    className="form-check-input"
                    type="checkbox"
                    checked={onlyActive}
                    onChange={(e) => setOnlyActive(e.target.checked)}
                  />
                </div>
                <label className="small-muted me-2">Active only</label>
              </div>
              <div className="btn-group">
                <button
                  className={`btn btn-sm btn-outline-secondary ${
                    sortDir === "asc" ? "active" : ""
                  }`}
                  onClick={() => setSortDir("asc")}
                >
                  Order ↑
                </button>
                <button
                  className={`btn btn-sm btn-outline-secondary ${
                    sortDir === "desc" ? "active" : ""
                  }`}
                  onClick={() => setSortDir("desc")}
                >
                  Order ↓
                </button>
              </div>
              <button
                className="btn btn-primary"
                style={{ background: "var(--primary)", border: "none" }}
                onClick={() => setShowModal(true)}
              >
                + Add
              </button>
            </div>
          </div>
          {/* ALERT */}
          {alert && (
            <div className={`alert alert-${alert.type}`}>
              {alert.message}
            </div>
          )}
          {/* GRID */}
          {loading ? (
            <div className="small-muted">Loading recruiters…</div>
          ) : displayed.length === 0 ? (
            <div className="small-muted mt-3">No recruiters found.</div>
          ) : (
            <section className="cards-grid mt-3">
              {displayed.map((logo) => (
                <article key={logo._id} className="card-advanced">
                  <div className="logo-wrap">
                    <img src={logo.imageUrl} alt={`${logo.companyName} logo`} />
                  </div>
                  <div className="company">{logo.companyName}</div>
                  <div className="meta d-flex">
                    <div className="badge-order">Order: {logo.order ?? 0}</div>
                    <div
                      className={`badge-state ${
                        logo.isActive ? "badge-active" : "badge-inactive"
                      }`}
                    >
                      {logo.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                  <div className="card-actions mt-2">
                    <button
                      className="btn btn-outline-warning btn-sm me-2"
                      onClick={() => handleEdit(logo)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(logo._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
          {/* MODAL */}
          {showModal && (
            <div className="modal-backdrop-custom">
              <div className="modal-glass">
                <header className="modal-header d-flex justify-content-between">
                  <h3 className="modal-title">
                    {editingLogo ? "Edit Recruiter" : "Add Recruiter"}
                  </h3>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-light btn-sm"
                      onClick={() => clearImage()}
                    >
                      Clear Image
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </header>
                <form onSubmit={handleSubmit}>
                  <div className="form-group mt-3">
                    <label className="form-label">Company Name</label>
                    <input
                      className="form-control"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label className="form-label">Order</label>
                    <input
                      type="number"
                      className="form-control"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label className="form-label">Logo Image</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={onFileChange}
                    />
                  </div>
                  {preview && (
                    <div className="text-center mt-3">
                      <img src={preview} className="preview-img" alt="Preview"/>
                    </div>
                  )}
                  <div className="form-check form-switch mt-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <label className="form-check-label">Active</label>
                  </div>
                  <div className="d-flex justify-content-end mt-3 gap-2">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button className="btn btn-primary btn-primary-adv">
                      {loading ? "Saving…" : editingLogo ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminRecruiters;
