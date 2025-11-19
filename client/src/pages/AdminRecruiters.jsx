import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

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

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch Recruiter logos
  const fetchLogos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/recruiters`);
      const data = await res.json();
      if (data.success) setLogos(data.data);
      else triggerAlert("danger", "Failed to load recruiters");
    } catch (err) {
      triggerAlert("danger", "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    fetchLogos();
    const timer = setTimeout(() => alive && setLoading(false), 800);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  // Alerts
  const triggerAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3500);
  };

  // Submit Add/Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("companyName", companyName);
      form.append("order", order);
      form.append("isActive", isActive);
      if (imageFile) form.append("image", imageFile);

      const method = editingLogo ? "PUT" : "POST";
      const url = editingLogo
        ? `${API_URL}/api/recruiters/${editingLogo._id}`
        : `${API_URL}/api/recruiters`;

      const res = await fetch(url, { method, body: form });
      const data = await res.json();

      if (data.success) {
        triggerAlert("success", data.message || "Saved successfully");
        fetchLogos();
        closeModal();
      } else {
        triggerAlert("danger", data.message || "Save failed");
      }
    } catch (err) {
      triggerAlert("danger", "Error saving image");
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
  };

  const handleEdit = (logo) => {
    setEditingLogo(logo);
    setCompanyName(logo.companyName);
    setOrder(logo.order ?? 0);
    setIsActive(logo.isActive ?? true);
    setPreview(API_URL + logo.imageUrl);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this recruiter logo?")) return;

    try {
      const res = await fetch(`${API_URL}/api/recruiters/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        triggerAlert("success", "Logo deleted");
        fetchLogos();
      } else {
        triggerAlert("danger", "Delete failed");
      }
    } catch (err) {
      triggerAlert("danger", "Network error");
    }
  };

  return (
    <>
      <style>{`
        :root {
          --sidebar-width: 250px;
          --sidebar-collapsed: 80px;
          --primary: #7A54B1;
          --accent: #ff7b29;
        }

        body {
          background: linear-gradient(135deg, #f3e5f5, #e0f7fa);
          font-family: 'Poppins', sans-serif;
          color: #333;
          margin: 0;
          height: 100vh;
          overflow: hidden;
        }

        .admin-page {
          display: flex;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .main-content {
          flex-grow: 1;
          height: 100vh;
          overflow-y: auto;
          padding: 30px 40px;
          transition: margin-left 0.36s ease;
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #4a148c;
        }

        .skeleton {
          background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite linear;
          border-radius: 8px;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Card styles */
        .card.recruiter {
          border-radius: 12px;
          padding: 18px;
          box-shadow: 0 10px 30px rgba(30,30,60,0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          height: 100%;
        }

        .recruiter-img-wrap {
          width: 100%;
          display:flex;
          align-items:center;
          justify-content:center;
          background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,250,0.95));
          padding: 14px;
          border-radius: 8px;
          min-height: 110px;
        }

        .recruiter-img {
          max-height: 90px;
          object-fit: contain;
          max-width: 100%;
        }

        .recruiter-title {
          font-weight: 700;
          font-size: 15px;
          color: #222;
          text-align:center;
        }

        .meta-row {
          display:flex;
          gap:8px;
          align-items:center;
          justify-content:center;
          flex-wrap:wrap;
        }

        .pill {
          display:inline-flex;
          align-items:center;
          gap:8px;
          font-weight:700;
          padding:6px 10px;
          border-radius:999px;
          font-size:13px;
        }

        .pill.order {
          background: linear-gradient(90deg, rgba(122,84,177,0.12), rgba(157,109,225,0.08));
          color: var(--primary);
          border: 1px solid rgba(122,84,177,0.08);
        }

        .pill.active {
          background: linear-gradient(90deg, #48c774, #2fb86f);
          color: #fff;
        }

        .pill.inactive {
          background: #e9ecef;
          color: #6b6b6b;
        }

        .card-footer-actions {
          display:flex;
          gap:8px;
          margin-top:8px;
        }

        /* Buttons small */
        .btn-sm {
          padding: 6px 10px;
          font-size: 13px;
        }

        /* Responsive grid tweaks */
        @media (max-width: 992px) {
          .main-content { padding: 22px; }
        }
        @media (max-width: 760px) {
          .main-content { padding: 16px; }
        }
      `}</style>

      <div className="admin-page">
        <Sidebar onToggle={setSidebarOpen} />

        <div
          className="main-content"
          style={{
            marginLeft: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed)",
          }}
        >
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            {loading ? (
              <div className="skeleton" style={{ height: 30, width: 220 }}></div>
            ) : (
              <h1 className="page-title">Manage Recruiter Logos</h1>
            )}

            {!loading && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                + Add New
              </button>
            )}
          </div>

          {/* Alerts */}
          {alert && (
            <div className={`alert alert-${alert.type}`} role="alert">
              {alert.message}
            </div>
          )}

          {/* Loading Skeleton */}
          {loading ? (
            <>
              <div className="skeleton" style={{ height: 200, marginBottom: 12 }}></div>
              <div className="skeleton" style={{ height: 200, marginBottom: 12 }}></div>
            </>
          ) : (
            <div className="row g-3">
              {logos.length === 0 ? (
                <p className="text-center text-muted mt-4">No logos uploaded.</p>
              ) : (
                logos.map((logo) => (
                  <div className="col-md-3 col-sm-6" key={logo._id}>
                    <div className="card recruiter">
                      <div className="recruiter-img-wrap">
                        <img
                          src={`${API_URL}${logo.imageUrl}`}
                          alt={logo.companyName}
                          className="recruiter-img"
                        />
                      </div>

                      <div className="recruiter-title">{logo.companyName}</div>

                      <div className="meta-row">
                        <div className={`pill order`}>Order: <strong style={{marginLeft:6}}>{logo.order ?? 0}</strong></div>
                        <div className={`pill ${logo.isActive ? "active" : "inactive"}`}>
                          {logo.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>

                      <div className="card-footer-actions">
                        <button className="btn btn-warning btn-sm" onClick={() => handleEdit(logo)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(logo._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div
              className="modal fade show d-block"
              style={{ background: "rgba(0,0,0,0.4)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                      <h5 className="modal-title">
                        {editingLogo ? "Edit Recruiter" : "Add Recruiter"}
                      </h5>
                      <button className="btn-close" onClick={closeModal}></button>
                    </div>

                    <div className="modal-body">
                      <label className="form-label">Company Name</label>
                      <input
                        className="form-control"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />

                      <label className="form-label mt-3">Order</label>
                      <input
                        type="number"
                        className="form-control"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                      />

                      <label className="form-label mt-3">Logo Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => {
                          setImageFile(e.target.files[0]);
                          setPreview(URL.createObjectURL(e.target.files[0]));
                        }}
                      />

                      {preview && (
                        <img
                          src={preview}
                          className="img-fluid rounded mt-3"
                          style={{ maxHeight: "200px", objectFit: "contain" }}
                          alt="preview"
                        />
                      )}

                      <div className="form-check mt-3">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                          className="form-check-input"
                        />
                        <label className="form-check-label">
                          {isActive ? "Active" : "Inactive"}
                        </label>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={closeModal}>
                        Cancel
                      </button>
                      <button className="btn btn-primary" type="submit">
                        Save
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default AdminRecruiters;
