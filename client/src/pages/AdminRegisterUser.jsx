import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { UserPlus, CheckCircle, AlertCircle, ClipboardList } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { adminRegisterUser, getAllUsers } from "../services/authService";
import { getAllDepartments } from "../services/departmentService";
import { fetchBatchesByDepartment, fetchSectionsByDepartment } from '../services/teacherAllocationService.jsx';
import "bootstrap/dist/css/bootstrap.min.css";

const AdminRegisterUser = () => {
  const location = useLocation();
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
    joiningYear: '',
    designation: '',
    dob: '',
    photoFile: null,
    photo: '',
    bloodGroup: '',
    officialDetails: '',
    panNumber: '',
    aadhaarNumber: '',
    salary: '',
    address: '',
    remarks: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [recentUsers, setRecentUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [photoPreview, setPhotoPreview] = useState(null);

  // 🕐 Initial Load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    fetchRecentUsers();
    fetchDepartments();
    // If navigated with prefill state, apply it
    if (location && location.state && location.state.prefill) {
      const p = location.state.prefill;
      setFormData((prev) => ({ ...prev, ...p }));
      // if a department id/name present, fetch dependent lists
      if (p.department) {
        fetchBatches(p.department);
        fetchSections(p.department);
      }
      // clear the navigation state to avoid reusing on refresh
      try { window.history.replaceState({}, document.title); } catch (e) {}
    }
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

  const isFormComplete = () => {
    // basic always-required
    if (!formData.name || !formData.email || !formData.password || !formData.role) return false;
    // department and phone are shown for both roles
    if (!formData.department || !formData.phone) return false;

    if (formData.role === 'student') {
      if (!formData.batch || !formData.section || !formData.enrollmentId) return false;
    }

    if (formData.role === 'teacher') {
      if (!formData.employeeId) return false;
      if (!formData.joiningYear || !formData.designation || !formData.dob) return false;
      if (!formData.photoFile) return false;
      if (!formData.bloodGroup || !formData.officialDetails || !formData.panNumber || !formData.aadhaarNumber) return false;
      if (!formData.salary && formData.salary !== 0) return false;
      if (!formData.address || !formData.remarks) return false;
    }

    return true;
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
        if (response.success) {
          setBatches(response.data);
        } else {
            setError(response.message || 'Failed to fetch batches.');
        }
      } catch (err) {
        setError('Failed to fetch batches. Please try again.');
      } finally {
        setLoading(false);
      }
    };

      const fetchSections = async (departmentId) => {
        try {
          const response = await fetchSectionsByDepartment(departmentId);
          if (response && response.success) {
            setSections(response.data);
          } else if (Array.isArray(response)) {
            setSections(response);
          }
        } catch (err) {
          console.error('Failed to fetch sections:', err);
          setSections([]);
        }
      };
  
 const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
  // Department changed
    setFormData({
      ...formData,
      department: departmentId,
      batch: "",
    });
    if (departmentId) {
      console.group("section"+departmentId)
      fetchBatches(departmentId);
      fetchSections(departmentId);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'file') {
      const file = e.target.files[0];
      setFormData({ ...formData, [name]: file, photoFile: file });
      if (file) setPhotoPreview(URL.createObjectURL(file));
      return;
    }
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Ensure visible/required fields are filled based on role
    if (!isFormComplete()) {
      setMessage({ type: "error", text: "Please fill in all required fields before registering." });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setSubmitting(true);

    try {
      // If a photo file is present, convert to base64 and attach as `photo`
      const payload = { ...formData };
      if (formData.photoFile) {
        const fileToBase64 = (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
          });
        try {
          const b64 = await fileToBase64(formData.photoFile);
          payload.photo = b64;
        } catch (err) {
          console.error('Failed to convert photo to base64', err);
        }
      }

      const response = await adminRegisterUser(payload);
      if (response.success) {
        setMessage({ type: "success", text: "User registered successfully!" });
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'student',
          department: '',
          batch: '',
          section: '',
          phone: '',
          enrollmentId: '',
          employeeId: '',
          canRegisterStudents: false,
          joiningYear: "",
          designation: '',
          dob: '',
          photoFile: null,
          photo: '',
          bloodGroup: '',
          officialDetails: '',
          panNumber: '',
          aadhaarNumber: '',
          salary: '',
          address: '',
          remarks: '',
        });
        fetchRecentUsers();
        setPhotoPreview(null);
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
 {formData.role === 'student' &&(
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


                  )}
{formData.role === 'teacher' && (
    <>
      <div className="form-group">
        <label htmlFor="joiningYear" className="form-label">Joining Year</label>
        <input
          type="number"
          id="joiningYear"
          name="joiningYear"
          className="form-input"
          placeholder="Enter joining year"
          value={formData.joiningYear}
          onChange={handleChange}
          min="1990"
          max={new Date().getFullYear()}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Designation</label>
        <input
          type="text"
          name="designation"
          className="form-input"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Enter designation"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Date of Birth</label>
        <input
          type="date"
          name="dob"
          className="form-input"
          value={formData.dob}
          onChange={handleChange}
        />
      </div>


      <div className="form-group">
        <label className="form-label">Blood Group</label>
        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="form-input">
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Official / Employment Details</label>
        <textarea name="officialDetails" className="form-input" value={formData.officialDetails} onChange={handleChange} placeholder="Add official/employment details" />
      </div>

      <div className="form-group">
        <label className="form-label">PAN Number</label>
        <input type="text" name="panNumber" className="form-input" value={formData.panNumber} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label className="form-label">Aadhaar Number</label>
        <input type="text" name="aadhaarNumber" className="form-input" value={formData.aadhaarNumber} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label className="form-label">Salary</label>
        <input type="number" name="salary" className="form-input" value={formData.salary} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label className="form-label">Address</label>
        <textarea name="address" className="form-input" value={formData.address} onChange={handleChange} />
      </div>

      

      <div className="form-group">
        <label className="form-label">Remarks / Notes</label>
        <textarea name="remarks" className="form-input" value={formData.remarks} onChange={handleChange} placeholder="Any remarks" />
      </div>

    </>
)}

           
              

            

                            {formData.role === 'student' && (
<div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Section
              </label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                {sections && sections.length > 0 ? (
                  <>
                    <option value="">Select Section</option>
                    {sections.map(sec => (
                      <option key={sec._id || sec.sectionName} value={sec.sectionName || sec._id}>
                        {sec.sectionName || sec.section}
                      </option>
                    ))}
                  </>
                ) : (
                  <>
                   <option value="A">Select departement</option>
                  </>
                )}
              </select>
            </div>
)}



              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {formData.role === 'student' && (
                <div className="form-group">
                  <label htmlFor="enrollmentId" className="form-label">
                    Enrollment ID
                  </label>
                  <input
                    type="text"
                    id="enrollmentId"
                    name="enrollmentId"
                    className="form-input"
                    placeholder="Enter enrollment ID"
                    value={formData.enrollmentId}
                    onChange={handleChange}
                  />
                </div>
              )}

           

              {formData.role === 'teacher' && (
                <>
                  <div className="form-group">
                    <label htmlFor="employeeId" className="form-label">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      id="employeeId"
                      name="employeeId"
                      className="form-input"
                      placeholder="Enter employee ID"
                      value={formData.employeeId}
                      onChange={handleChange}
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
                    <div className="form-group">
                      <label className="form-label">Photo</label>
                      <input type="file" name="photoFile" accept="image/*" onChange={handleChange} />
                      {photoPreview && (
                        <div style={{ marginTop: 8 }}>
                          <img src={photoPreview} alt="preview" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }} />
                        </div>
                      )}
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

                <button type="submit" className="btn-primary" disabled={submitting || !isFormComplete()}>
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
