import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminHeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [editingSlide, setEditingSlide] = useState(null);
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // UI controls
  const [searchQ, setSearchQ] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);
  const [sortDir, setSortDir] = useState("asc");

  const API_URL = import.meta.env.VITE_API_URL;
  const fileInputRef = useRef(null);

  // Fetch slides
  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/hero-carousel/slides`);
      const data = await res.json();
      if (data.success) setSlides(data.data || []);
      else showAlert("danger", "Failed to load slides");
    } catch (err) {
      showAlert("danger", "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // ESC closes modal
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
      form.append("order", order);
      form.append("isActive", isActive ? "true" : "false");

      if (imageFile) form.append("image", imageFile);

      const method = editingSlide ? "PUT" : "POST";
      const url = editingSlide
        ? `${API_URL}/api/hero-carousel/slides/${editingSlide._id}`
        : `${API_URL}/api/hero-carousel/slides`;

      const res = await fetch(url, { method, body: form });
      const data = await res.json();

      if (data.success) {
        showAlert("success", editingSlide ? "Slide updated" : "Slide added");
        await fetchSlides();
        closeModal();
      } else {
        showAlert("danger", data.message || "Failed to save slide");
      }
    } catch (err) {
      showAlert("danger", "Saving failed");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSlide(null);
    setOrder(0);
    setIsActive(true);
    setImageFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setOrder(slide.order);
    setIsActive(slide.isActive);
    setPreview(slide.imageUrl);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slide?")) return;

    try {
      const res = await fetch(`${API_URL}/api/hero-carousel/slides/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        showAlert("success", "Slide deleted");
        fetchSlides();
      } else {
        showAlert("danger", "Delete failed");
      }
    } catch (err) {
      showAlert("danger", "Network error");
    }
  };

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

  // Filter + sort
  const displayed = slides
    .filter((s) => {
      if (!searchQ) return true;
      return String(s.order).includes(searchQ);
    })
    .filter((s) => (onlyActive ? s.isActive : true))
    .sort((a, b) => {
      const A = Number(a.order || 0);
      const B = Number(b.order || 0);
      return sortDir === "asc" ? A - B : B - A;
    });

  return (
    <>
      {/* RESPONSIVE STYLING */}
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

        .slide-wrap {
          width: 100%;
          height: 150px;
          background: #fafafa;
          border-radius: 8px;
          overflow: hidden;
        }

        .slide-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
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
          object-fit: cover;
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
          style={{
            marginLeft: sidebarOpen ? "250px" : "80px",
          }}
        >
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <div>
              <h2 className="page-title">Hero Carousel</h2>
              <div className="small-muted">Manage homepage hero slider images</div>
            </div>

            <div className="toolbar">
              <div className="search-input">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search by order…"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
              </div>
              <div className="d-flex gap-2 align-items-center">
                <div className="form-check form-switch me-1">
                  <input
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
                  className={`btn btn-sm btn-outline-secondary ${sortDir === "asc" ? "active" : ""}`}
                  onClick={() => setSortDir("asc")}
                >
                  Order ↑
                </button>
                <button
                  className={`btn btn-sm btn-outline-secondary ${sortDir === "desc" ? "active" : ""}`}
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
            <div className="small-muted">Loading slides…</div>
          ) : displayed.length === 0 ? (
            <div className="small-muted mt-3">No slides found.</div>
          ) : (
            <section className="cards-grid mt-3">
              {displayed.map((slide) => (
                <article key={slide._id} className="card-advanced">
                  <div className="slide-wrap">
                    <img src={slide.imageUrl} alt="Slide" />
                  </div>
                  <div className="meta d-flex gap-2 mt-3">
                    <div className="badge-order">Order: {slide.order}</div>
                    <div
                      className={`badge-state ${
                        slide.isActive ? "badge-active" : "badge-inactive"
                      }`}
                    >
                      {slide.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                  <div className="card-actions mt-2">
                    <button
                      className="btn btn-outline-warning btn-sm me-2"
                      onClick={() => handleEdit(slide)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(slide._id)}
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
                    {editingSlide ? "Edit Slide" : "Add Slide"}
                  </h3>
                  <div className="d-flex gap-2">
                    <button className="btn btn-light btn-sm" onClick={clearImage}>
                      Clear Image
                    </button>
                    <button className="btn btn-outline-secondary btn-sm" onClick={closeModal}>
                      Close
                    </button>
                  </div>
                </header>
                <form onSubmit={handleSubmit}>
                  <div className="form-group mt-3">
                    <label className="form-label">Slide Image</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={onFileChange}
                      required={!editingSlide}
                    />
                  </div>
                  {preview && (
                    <div className="text-center mt-3">
                      <img src={preview} className="preview-img" alt="Preview" />
                    </div>
                  )}
                  <div className="form-group mt-3">
                    <label className="form-label">Order</label>
                    <input
                      type="number"
                      className="form-control"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                    />
                  </div>
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
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button className="btn btn-primary btn-primary-adv">
                      {editingSlide ? "Update" : "Add"}
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

export default AdminHeroCarousel;
