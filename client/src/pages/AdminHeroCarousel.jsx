import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminHeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [formData, setFormData] = useState({
    order: 0,
    isActive: true,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // ======================================================
  //  ✅ FIXED: MOVED fetchSlides OUTSIDE useEffect
  // ======================================================
  const fetchSlides = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hero-carousel/slides`);
      const data = await response.json();

      if (data.success) {
        setSlides(data.data);
      } else {
        showAlert("danger", data.message);
      }
    } catch (error) {
      showAlert("danger", "Error fetching slides: " + error.message);
    }
  };

  // Load slides on page load
  useEffect(() => {
    let alive = true;

    fetchSlides();

    const timer = setTimeout(() => alive && setLoading(false), 1000);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // Image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Form change
  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add / Update Slide
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("order", formData.order);
      form.append("isActive", formData.isActive);

      if (selectedImage) form.append("image", selectedImage);

      const url = editingSlide
        ? `${API_URL}/api/hero-carousel/slides/${editingSlide._id}`
        : `${API_URL}/api/hero-carousel/slides`;

      const method = editingSlide ? "PUT" : "POST";

      const response = await fetch(url, { method, body: form });
      const data = await response.json();

      if (data.success) {
        showAlert("success", data.message);
        await fetchSlides();
        handleCloseModal();
      } else {
        showAlert("danger", data.message);
      }
    } catch (error) {
      showAlert("danger", "Error saving slide: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Slide
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/hero-carousel/slides/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        showAlert("success", data.message);
        await fetchSlides(); // FIXED
      } else {
        showAlert("danger", data.message);
      }
    } catch (error) {
      showAlert("danger", "Error deleting slide: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit Slide
  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      order: slide.order,
      isActive: slide.isActive,
    });
    setPreview(`${API_URL}${slide.imageUrl}`);
    setShowModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSlide(null);
    setFormData({ order: 0, isActive: true });
    setSelectedImage(null);
    setPreview(null);
  };

  return (
    <>
      <style>
        {`
        :root {
          --sidebar-width: 250px;
          --sidebar-collapsed: 80px;
        }

        body {
          background: linear-gradient(135deg, #f3e5f5, #e0f7fa);
          font-family: 'Poppins', sans-serif;
          color: #333;
          margin: 0;
          height: 100vh;
          overflow: hidden;
        }

        .carousel-page {
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
        `}
      </style>

      <div className="carousel-page">
        <Sidebar onToggle={setSidebarOpen} />

        <div
          className="main-content"
          style={{
            marginLeft: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed)",
          }}
        >
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            {loading ? (
              <div className="skeleton" style={{ height: 30, width: 220 }}></div>
            ) : (
              <h1 className="page-title">Manage Hero Carousel</h1>
            )}

            {!loading && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                + Add New
              </button>
            )}
          </div>

          {/* ALERT */}
          {alert && (
            <div className={`alert alert-${alert.type}`} role="alert">
              {alert.message}
            </div>
          )}

          {/* LOADING SKELETON */}
          {loading ? (
            <>
              <div className="skeleton" style={{ height: 200, marginBottom: 12 }}></div>
              <div className="skeleton" style={{ height: 200, marginBottom: 12 }}></div>
            </>
          ) : (
            <div className="row g-3">
              {slides.length === 0 ? (
                <p className="text-center text-muted">No slides uploaded.</p>
              ) : (
                slides.map((slide) => (
                  <div className="col-md-3 col-sm-6" key={slide._id}>
                    <div className="card shadow-sm">
                      <img
                        src={`${API_URL}${slide.imageUrl}`}
                        className="card-img-top"
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                      <div className="card-body text-center">
                        <p className="mb-1">
                          <strong>Order:</strong> {slide.order}
                        </p>
                        <span
                          className={`badge ${
                            slide.isActive ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {slide.isActive ? "Active" : "Inactive"}
                        </span>

                        <div className="mt-3 d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(slide)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(slide._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* MODAL */}
          {showModal && (
            <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.4)" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editingSlide ? "Edit Slide" : "Add Slide"}
                    </h5>
                    <button className="btn-close" onClick={handleCloseModal}></button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                      <label className="form-label">Select Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                        required={!editingSlide}
                      />

                      {preview && (
                        <img
                          src={preview}
                          className="img-fluid rounded mt-3"
                          style={{ maxHeight: "250px", objectFit: "cover" }}
                        />
                      )}

                      <div className="mt-3">
                        <label className="form-label">Order</label>
                        <input
                          type="number"
                          name="order"
                          className="form-control"
                          value={formData.order}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="form-check form-switch mt-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label">
                          {formData.isActive ? "Active" : "Inactive"}
                        </label>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {loading ? "Saving..." : editingSlide ? "Update" : "Add"}
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

export default AdminHeroCarousel;
