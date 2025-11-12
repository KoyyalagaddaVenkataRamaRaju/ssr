import { useState, useEffect } from "react";
import { UserPlus, CheckCircle, AlertCircle, ClipboardList } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { adminRegisterUser, getAllUsers } from "../services/authService";
import { getAllDepartments } from "../services/departmentService";
import { fetchBatchesByDepartment } from '../services/teacherAllocationService.jsx';
import "bootstrap/dist/css/bootstrap.min.css";

const AdminRegisterUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
    batch: "",
    section: "",
    phone: "",
    enrollmentId: "",
    employeeId: "",
    canRegisterStudents: false,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [recentUsers, setRecentUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 🕐 Initial Load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    fetchRecentUsers();
    fetchDepartments();
    return () => clearTimeout(timer);
  }, []);

  const fetchRecentUsers = async () => {
    try {
      const response = await getAllUsers({ limit: 10 });
      if (response.success) setRecentUsers(response.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getAllDepartments();
      if (response.success) setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchBatches = async (departmentId) => {
    try {
      const response = await fetchBatchesByDepartment(departmentId);
      if (response.success) setBatches(response.data);
    } catch (err) {
      console.error("Failed to fetch batches:", err);
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setFormData({
      ...formData,
      department: departmentId,
      batch: "",
    });
    if (departmentId) fetchBatches(departmentId);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.name || !formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setSubmitting(true);

    try {
      const response = await adminRegisterUser(formData);
      if (response.success) {
        setMessage({ type: "success", text: "User registered successfully!" });
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "student",
          department: "",
          batch: "",
          section: "",
          phone: "",
          enrollmentId: "",
          employeeId: "",
          canRegisterStudents: false,
        });
        fetchRecentUsers();
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to register user.",
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
          height: 100vh;
          overflow: hidden;
        }

        .register-page {
          display: flex;
          height: 100vh;
          width: 100%;
        }

        /* Scrollable main content */
        .main-content {
          flex-grow: 1;
          padding: 30px 40px;
          transition: margin-left 0.36s ease;
          overflow-y: auto;
          height: 100vh;
          scrollbar-width: thin;
          scrollbar-color: #c1a9f1 #f4f4f4;
        }

        .main-content::-webkit-scrollbar {
          width: 8px;
        }
        .main-content::-webkit-scrollbar-thumb {
          background: #b39ddb;
          border-radius: 8px;
        }
        .main-content::-webkit-scrollbar-thumb:hover {
          background: #9575cd;
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

        /* FORM STYLING */
        .form-section {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 6px 18px rgba(70,60,90,0.06);
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-weight: 600;
          color: #4a148c;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          font-weight: 500;
          display: block;
          margin-bottom: 6px;
        }

        .form-input, select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          transition: border 0.2s;
        }

        .form-input:focus, select:focus {
          border-color: #6a1b9a;
          outline: none;
          box-shadow: 0 0 4px rgba(106,27,154,0.3);
        }

        .btn-primary {
          background: linear-gradient(90deg,#6a1b9a,#1e88e5);
          border: none;
          padding: 10px 20px;
          color: #fff;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: linear-gradient(90deg,#5e35b1,#1976d2);
          transform: scale(1.02);
        }

        /* MESSAGE */
        .message {
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 6px;
          padding: 10px;
          margin-bottom: 10px;
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

        /* RECENT USERS TABLE */
        .users-table {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 6px 18px rgba(70,60,90,0.04);
          overflow-x: auto;
          margin-top: 1.5rem;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px;
          border-bottom: 1px solid #f3f3f3;
          text-align: left;
        }

        th {
          background: #6a1b9a;
          color: #fff;
        }

        tr:hover td {
          background: #faf1ff;
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

        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
          }
        }
        `}
      </style>

      <div className="register-page">
        {/* Sticky Sidebar */}
        <Sidebar onToggle={setSidebarOpen} />

        {/* Scrollable Content */}
        <div
          className="main-content"
          style={{
            marginLeft: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed)",
          }}
        >
          {loading ? (
            <>
              <div className="skeleton" style={{ height: 35, width: 250, marginBottom: 20 }}></div>
              <div className="skeleton" style={{ height: 500, borderRadius: 12 }}></div>
            </>
          ) : (
            <>
              <div className="page-header">
                <h1 className="page-title">
                  <UserPlus size={28} /> Register New User
                </h1>
                <p className="page-subtitle">Create new student or teacher accounts</p>
              </div>

              {/* Form */}
              <form className="form-section" onSubmit={handleSubmit}>
                <h3 className="section-title">User Information</h3>

                {/* Fields */}
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password (min 6 chars)"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select
                    name="role"
                    className="form-input"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>

                {/* Department & Batch */}
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    name="department"
                    className="form-input"
                    value={formData.department}
                    onChange={handleDepartmentChange}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dep) => (
                      <option key={dep._id} value={dep._id}>
                        {dep.departmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Batch</label>
                  <select
                    name="batch"
                    className="form-input"
                    value={formData.batch}
                    onChange={handleChange}
                    disabled={!formData.department}
                  >
                    <option value="">Select Batch</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.batchName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role-based fields */}
                {formData.role === "student" && (
                  <div className="form-group">
                    <label className="form-label">Section</label>
                    <select
                      name="section"
                      className="form-input"
                      value={formData.section}
                      onChange={handleChange}
                    >
                      <option value="">Select Section</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                )}

                {formData.role === "teacher" && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Employee ID</label>
                      <input
                        type="text"
                        name="employeeId"
                        className="form-input"
                        value={formData.employeeId}
                        onChange={handleChange}
                        placeholder="Enter employee ID"
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="canRegisterStudents"
                          checked={formData.canRegisterStudents}
                          onChange={handleChange}
                        />{" "}
                        Allow teacher to register students
                      </label>
                    </div>
                  </>
                )}

                {/* Message */}
                {message.text && (
                  <div className={`message ${message.type}`}>
                    {message.type === "success" ? <CheckCircle /> : <AlertCircle />}
                    <span>{message.text}</span>
                  </div>
                )}

                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Registering..." : "Register User"}
                </button>
              </form>

              {/* Recent Users */}
              <h3 className="section-title">
                <ClipboardList size={20} /> Recently Created Users
              </h3>
              <div className="users-table">
                {recentUsers.length ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Section</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>{user.department || "-"}</td>
                          <td>{user.section || "-"}</td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ padding: "12px" }}>No users created yet.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminRegisterUser;
