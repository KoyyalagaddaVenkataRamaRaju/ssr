import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminHeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    order: 0,
    isActive: true,
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch all slides
  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/hero-carousel/slides`);
      const data = await response.json();
      if (data.success) setSlides(data.data);
      else showAlert('danger', data.message);
    } catch (error) {
      showAlert('danger', 'Error fetching slides: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append('order', formData.order);
      form.append('isActive', formData.isActive);
      if (selectedImage) form.append('image', selectedImage);

      const url = editingSlide
        ? `${API_URL}/api/hero-carousel/slides/${editingSlide._id}`
        : `${API_URL}/api/hero-carousel/slides`;

      const method = editingSlide ? 'PUT' : 'POST';

      const response = await fetch(url, { method, body: form });
      const data = await response.json();

      if (data.success) {
        showAlert('success', data.message);
        fetchSlides();
        handleCloseModal();
      } else {
        showAlert('danger', data.message);
      }
    } catch (error) {
      showAlert('danger', 'Error saving slide: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/hero-carousel/slides/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        showAlert('success', data.message);
        fetchSlides();
      } else showAlert('danger', data.message);
    } catch (error) {
      showAlert('danger', 'Error deleting slide: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      order: slide.order,
      isActive: slide.isActive,
    });
    setPreview(`${API_URL}${slide.imageUrl}`);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSlide(null);
    setFormData({ order: 0, isActive: true });
    setSelectedImage(null);
    setPreview(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Hero Carousel</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-2"></i> Add New Image
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {loading && !showModal ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : (
        <div className="row g-3">
          {slides.length === 0 ? (
            <p className="text-center text-muted">No images found.</p>
          ) : (
            slides.map((slide) => (
              <div className="col-md-3 col-sm-6" key={slide._id}>
                <div className="card shadow-sm border-0">
                  <img
                    src={`${API_URL}${slide.imageUrl}`}
                    alt="carousel"
                    className="card-img-top"
                    style={{ height: '180px', objectFit: 'cover', borderRadius: '10px' }}
                  />
                  <div className="card-body text-center">
                    <p className="mb-1">
                      <strong>Order:</strong> {slide.order}
                    </p>
                    <span
                      className={`badge ${slide.isActive ? 'bg-success' : 'bg-secondary'}`}
                    >
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="mt-3 d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleEdit(slide)}
                      >
                        <i className="bi bi-pencil me-1"></i> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(slide._id)}
                      >
                        <i className="bi bi-trash me-1"></i> Delete
                      </button>
                    </div>
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
          tabIndex="-1"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                </h5>
                <button className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Select Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!editingSlide}
                    />
                  </div>

                  {preview && (
                    <div className="mb-3 text-center">
                      <img
                        src={preview}
                        alt="Preview"
                        className="img-fluid rounded"
                        style={{ maxHeight: '250px', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Order</label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="form-control"
                      min="0"
                    />
                  </div>

                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label">
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : editingSlide ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeroCarousel;
