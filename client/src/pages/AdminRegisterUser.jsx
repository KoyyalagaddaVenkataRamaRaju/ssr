import { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { adminRegisterUser, getAllUsers } from '../services/authService';
import { getAllDepartments } from '../services/departmentService'; // Import getAllDepartments
import Card from '../components/Card';
import '../styles/register.css';

const AdminRegisterUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    section: '',
    phone: '',
    enrollmentId: '',
    employeeId: '',
    canRegisterStudents: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [recentUsers, setRecentUsers] = useState([]);
  const [departments, setDepartments] = useState([]); // State for departments

  useEffect(() => {
    fetchRecentUsers();
    fetchDepartments(); // Fetch departments on component mount
  }, []);

  const fetchRecentUsers = async () => {
    try {
      const response = await getAllUsers({ limit: 10 });
      if (response.success) {
        setRecentUsers(response.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getAllDepartments();
      if (response.success) {
        setDepartments(response.data);
      } else {
        console.error('Error fetching departments:', response.message);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    // require section for students
    if (formData.role === 'student' && !formData.section) {
      setMessage({ type: 'error', text: 'Please select a section for the student' });
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      const response = await adminRegisterUser(formData);

      if (response.success) {
        setMessage({ type: 'success', text: 'User registered successfully!' });
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'student',
          department: '',
          section: '',
          phone: '',
          enrollmentId: '',
          employeeId: '',
          canRegisterStudents: false,
        });
        fetchRecentUsers();
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to register user. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-user-page">
      <div className="page-header">
        <h1 className="page-title">
          <UserPlus size={32} />
          Register New User
        </h1>
        <p className="page-subtitle">Create new student or teacher accounts</p>
      </div>

      <div className="register-content">

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>

              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="form-group">
                <label htmlFor="role" className="form-label">
                  Role <span className="required">*</span>
                </label>
                <select
                  id="role"
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
            </div>

              {formData.role === 'student' && (
  <div className="form-group">
    <label htmlFor="section" className="form-label">
      Section
    </label>
    <select
      id="section"
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


            <div className="form-section">
              <h3 className="section-title">Additional Details</h3>

              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  className="form-input"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.departmentName}
                    </option>
                  ))}
                </select>
              </div>

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

              {formData.role === 'student' && (
                <div className="form-group">
                  <label htmlFor="section" className="form-label">
                    Section
                  </label>
                  <select
                    id="section"
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

                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="canRegisterStudents"
                        checked={formData.canRegisterStudents}
                        onChange={handleChange}
                      />
                      <span>Allow this teacher to register students</span>
                    </label>
                  </div>
                </>
              )}
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === 'success' ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register User'}
            </button>
          </form>

    
          <h3 className="section-title">Recently Created Users</h3>
          <div className="users-table">
            {recentUsers.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Section</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>{user.role}</span>
                      </td>
                      <td>{user.department || '-'}</td>
                      <td>{user.section || '-'}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No users created yet</p>
            )}
          </div>
    
      </div>
    </div>
  );
};

export default AdminRegisterUser;