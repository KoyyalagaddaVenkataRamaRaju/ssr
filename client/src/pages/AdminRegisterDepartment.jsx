import { useState, useEffect } from "react";
import { PlusSquare, CheckCircle, AlertCircle } from "lucide-react";
import { adminRegisterDepartement, getAllDepartments } from "../services/departmentService";
import courseService from '../services/courseService';
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminRegisterDepartment = () => {
  const [formData, setFormData] = useState({
    course: '',
    departmentName: "",
    description: "",
    departmentImage: "",
  });

  const [loading, setLoading] = useState(true); // skeleton loading
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllDepartments();
        if (res.success) setDepartments(res.data);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to fetch departments." });
      }
    };

    const fetchCourses = async () => {
      try {
        const list = await courseService.getAllCourses();
        setCourses(list || []);
      } catch (err) {
        // ignore
      }
    };

    fetchData();
    fetchCourses();
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.course || !formData.departmentName || !formData.description || !formData.departmentImage) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setSubmitting(true);

    try {
      const response = await adminRegisterDepartement(formData);
      if (response.success) {
        setMessage({ type: "success", text: "Department registered successfully!" });
        setFormData({ departmentName: "", description: "", departmentImage: "" });
        const res = await getAllDepartments();
        if (res.success) setDepartments(res.data);
      } else {
        setMessage({ type: "error", text: response.message || "Failed to register department." });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to register department. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
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
          padding: 0;
          height: 100vh;
          overflow: hidden;
        }

        .register-department-page {
          display: flex;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .main-content {
          flex-grow: 1;
          height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 30px 40px;
          transition: margin-left 0.36s ease;
        }

        .page-header {
          margin-bottom: 1.5rem;
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #4a148c;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .page-subtitle {
          color: #666;
          margin-top: 4px;
        }

        .register-form {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(70,60,90,0.06);
          padding: 24px;
          margin-bottom: 2rem;
          transition: all 0.3s ease;
        }

        .register-form:hover {
          transform: translateY(-2px);
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #6a1b9a;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          font-weight: 500;
          color: #444;
          margin-bottom: 4px;
          display: block;
        }

        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
        }

        .form-input:focus {
          border-color: #6a1b9a;
          outline: none;
          box-shadow: 0 0 0 2px rgba(106,27,154,0.2);
        }

        .required {
          color: red;
        }

        .btn-primary {
          background: linear-gradient(90deg,#6a1b9a,#1e88e5);
          border: none;
          color: #fff;
          font-weight: 600;
          padding: 10px 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: linear-gradient(90deg,#5e35b1,#1976d2);
        }

        .btn-loading {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .message {
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 6px;
          padding: 10px;
          margin-top: 10px;
          font-weight: 500;
        }

        .message.success {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #a5d6a7;
        }

        .message.error {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ef9a9a;
        }

        .department-list {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 6px 18px rgba(70,60,90,0.05);
        }

        .department-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .department-item {
          background: #fafafa;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(70,60,90,0.06);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
        }

        .department-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 22px rgba(70,60,90,0.1);
        }

        .department-image {
          width: 100%;
          height: 160px;
          object-fit: cover;
        }

        .department-details {
          padding: 12px 16px;
        }

        .department-name {
          font-size: 16px;
          font-weight: 600;
          color: #4a148c;
          margin-bottom: 6px;
        }

        .department-description {
          color: #555;
          font-size: 14px;
        }

        /* Skeleton Loader */
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

        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
          }
          .department-grid {
            grid-template-columns: 1fr;
          }
        }
        `}
      </style>

      <div className="register-department-page">
        <Sidebar onToggle={setSidebarOpen} />
        <div
          className="main-content"
          style={{
            marginLeft: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed)",
          }}
        >
          {loading ? (
            <>
              {/* Skeleton for heading and sections */}
              <div className="skeleton" style={{ height: 36, width: 280, marginBottom: 12 }}></div>
              <div className="skeleton" style={{ height: 20, width: 200, marginBottom: 24 }}></div>

              {/* Form skeleton */}
              <div className="skeleton" style={{ height: 280, borderRadius: 12, marginBottom: 24 }}></div>

              {/* Departments skeleton */}
              <div className="skeleton" style={{ height: 36, width: 240, marginBottom: 16 }}></div>
              <div className="skeleton" style={{ height: 200, borderRadius: 10 }}></div>
            </>
          ) : (
            <>
              {/* Page Header */}
              <div className="page-header">
                <h1 className="page-title">
                  <PlusSquare size={30} /> Register Department
                </h1>
                <p className="page-subtitle">Add new departments to the system</p>
              </div>

              {/* Register Form */}
              <form className="register-form" onSubmit={handleSubmit}>
                <h3 className="section-title">Department Information</h3>

                <div className="form-group">
                  <label htmlFor="course" className="form-label">
                    Course <span className="required">*</span>
                  </label>
                  <select
                    id="course"
                    name="course"
                    className="form-input"
                    value={formData.course}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.courseName}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="departmentName" className="form-label">
                    Department Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="departmentName"
                    name="departmentName"
                    className="form-input"
                    placeholder="Enter department name"
                    value={formData.departmentName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    className="form-input"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="departmentImage" className="form-label">
                    Department Image URL <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="departmentImage"
                    name="departmentImage"
                    className="form-input"
                    placeholder="Enter image URL"
                    value={formData.departmentImage}
                    onChange={handleChange}
                    required
                  />
                </div>

                {message.text && (
                  <div className={`message ${message.type}`}>
                    {message.type === "success" ? <CheckCircle /> : <AlertCircle />}
                    <span>{message.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className={`btn btn-primary ${submitting ? "btn-loading" : ""}`}
                  disabled={submitting}
                >
                  {submitting ? "Registering..." : "Register Department"}
                </button>
              </form>

              {/* Department List */}
              <div className="department-list">
                <h3 className="section-title">Registered Departments</h3>
                {departments.length > 0 ? (
                  <div className="department-grid">
                    {departments.map((department) => (
                      <Link
                        to={`/departments/${department._id}`}
                        key={department._id}
                        className="department-item"
                      >
                        <img
                          src={department.departmentImage}
                          alt={department.departmentName}
                          className="department-image"
                        />
                        <div className="department-details">
                          <h4 className="department-name">{department.departmentName}</h4>
                          <p className="department-description">{department.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p>No departments registered yet.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminRegisterDepartment;
