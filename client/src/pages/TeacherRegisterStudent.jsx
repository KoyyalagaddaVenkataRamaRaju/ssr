import { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { teacherRegisterStudent, getMyStudents } from '../services/authService';
import { getAllDepartments } from '../services/departmentService';
import { getAllBatches } from '../services/batchService'; // Add this service to fetch batches
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

const TeacherRegisterStudent = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '', // Dynamic dropdown
    batch: '',      // Dynamic dropdown
    phone: '',
    enrollmentId: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [myStudents, setMyStudents] = useState([]);
  const [hasPermission, setHasPermission] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    if (user && user.canRegisterStudents) {
      fetchMyStudents();
      setHasPermission(true);
    } else {
      setHasPermission(false);
    }
    fetchDepartments();
    fetchBatches();
  }, [user]);

  const fetchMyStudents = async () => {
    try {
      const response = await getMyStudents();
      if (response.success) setMyStudents(response.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getAllDepartments();
      if (response.success) setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await getAllBatches(); // Create service similar to getAllDepartments
      if (response.success) setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.name || !formData.email || !formData.password || !formData.department || !formData.batch) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
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
      const response = await teacherRegisterStudent(formData);
      if (response.success) {
        setMessage({ type: 'success', text: 'Student registered successfully!' });
        setFormData({ ...formData, name: '', email: '', password: '', phone: '', enrollmentId: '' });
        fetchMyStudents();
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to register student. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission) {
    return (
      <div className="register-user-page">
        <div className="page-header">
          <h1 className="page-title">
            <Lock size={32} />
            Access Denied
          </h1>
        </div>

        <Card>
          <div className="permission-denied">
            <AlertCircle size={64} className="denied-icon" />
            <h2>Permission Required</h2>
            <p>You do not have permission to register students. Please contact your administrator.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="register-user-page">
      <div className="page-header">
        <h1 className="page-title">
          <UserPlus size={32} />
          Register New Student
        </h1>
        <p className="page-subtitle">Create new student accounts</p>
      </div>

      <div className="register-content">
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">Student Information</h3>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="Enter student full name"
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
                placeholder="Enter student email"
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
                placeholder="Enter password (min 6 chars)"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Department Dropdown */}
            <div className="form-group">
              <label htmlFor="department" className="form-label">
                Department <span className="required">*</span>
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Dropdown */}
            <div className="form-group">
              <label htmlFor="batch" className="form-label">
                Batch <span className="required">*</span>
              </label>
              <select
                id="batch"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.batchName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
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

            <div className="form-group">
              <label htmlFor="enrollmentId" className="form-label">Enrollment ID</label>
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
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span>{message.text}</span>
            </div>
          )}

          <button type="submit" className={`btn btn-primary ${loading ? 'btn-loading' : ''}`} disabled={loading}>
            {loading ? 'Registering...' : 'Register Student'}
          </button>
        </form>

        <h3 className="section-title">My Registered Students ({myStudents.length})</h3>
        <div className="users-table">
          {myStudents.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Enrollment ID</th>
                  <th>Department</th>
                  <th>Batch</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {myStudents.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.enrollmentId || '-'}</td>
                    <td>{student.department?.departmentName || '-'}</td>
                    <td>{student.batch?.batchName || '-'}</td>
                    <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No students registered yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherRegisterStudent;
