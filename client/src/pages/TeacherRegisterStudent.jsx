import { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, AlertCircle, Lock, Loader2 } from 'lucide-react';
import { teacherRegisterStudent, getMyStudents } from '../services/authService';
import { getAllBatchesbyTeacher, getBatchById } from '../services/batchService';
import { getAllDepartments } from '../services/departmentService';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import '../styles/register.css'; // Ensure styling consistency

const TeacherRegisterStudent = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    batch: '',
    phone: '',
    enrollmentId: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [myStudents, setMyStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);

  useEffect(() => {
    if (user && user.canRegisterStudents) {
      setHasPermission(true);
      fetchInitialData();
    } else {
      setHasPermission(false);
    }
  }, [user]);

  const fetchInitialData = async () => {
    fetchBatches();
    fetchDepartments();
    fetchMyStudents();
  };

  const fetchDepartments = async () => {
    try {
      const response = await getAllDepartments();
      if (response && response.success) {
        setDepartments(response.data);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      setDepartments([]);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await getAllBatchesbyTeacher();
      if (response.success) setBatches(response.data);
      else setBatches([]);
    } catch (error) {
      console.error('Error fetching batches:', error);
      setBatches([]);
    }
  };

  const fetchDepartmentsByBatch = async (batchId) => {
    try {
      const response = await getBatchById(batchId);
      if (response?.success && Array.isArray(response.data?.departments)) {
        setDepartments(response.data.departments.map((d) => ({
          _id: d.departmentId?._id || d.departmentId,
          departmentName: d.departmentName,
        })));
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error('Error fetching departments by batch:', error);
      setDepartments([]);
    }
  };

  const fetchMyStudents = async () => {
    setFetchingStudents(true);
    try {
      const response = await getMyStudents();
      if (response.success) setMyStudents(response.students);
      else setMyStudents([]);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setFetchingStudents(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage({ type: '', text: '' });

    if (name === 'batch') {
      setFormData({ ...formData, batch: value, department: '' });
      fetchDepartmentsByBatch(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const { name, email, password, department, batch } = formData;

    if (!name || !email || !password || !department || !batch) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    try {
      const response = await teacherRegisterStudent(formData);
      if (response.success) {
        setMessage({ type: 'success', text: 'Student registered successfully!' });
        setFormData({
          name: '',
          email: '',
          password: '',
          department: '',
          batch: '',
          phone: '',
          enrollmentId: '',
        });
        fetchMyStudents();
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to register student.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission) {
    return (
      <div className="register-user-page">
        <div className="page-header">
          <h1 className="page-title">
            <Lock size={32} /> Access Denied
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
          <UserPlus size={32} /> Register New Student
        </h1>
        <p className="page-subtitle">Create and manage your assigned students.</p>
      </div>

      <div className="register-content">
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">Student Information</h3>

            {['name', 'email', 'password', 'phone', 'enrollmentId'].map((field) => (
              <div key={field} className="form-group">
                <label>
                  {field === 'password'
                    ? 'Password'
                    : field === 'enrollmentId'
                    ? 'Enrollment ID'
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                  {['name', 'email', 'password'].includes(field) && <span className="required">*</span>}
                </label>
                <input
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                />
              </div>
            ))}

            <div className="form-group">
              <label>Batch <span className="required">*</span></label>
              <select name="batch" value={formData.batch} onChange={handleChange} className="form-input">
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch._id}>{batch.batchName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Department <span className="required">*</span></label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-input"
                disabled={!departments.length}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>{dept.departmentName}</option>
                ))}
              </select>
            </div>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span>{message.text}</span>
            </div>
          )}

          <button type="submit" className={`btn btn-primary ${loading ? 'btn-loading' : ''}`} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Register Student'}
          </button>
        </form>

        <h3 className="section-title">My Registered Students ({myStudents.length})</h3>
        <div className="users-table">
          {fetchingStudents ? (
            <p>Loading students...</p>
          ) : myStudents.length > 0 ? (
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
                    <td>{student.enrollmentId || '—'}</td>
                    <td>{student.department?.departmentName || '—'}</td>
                    <td>{student.batch?.batchName || '—'}</td>
                    <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No students registered yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherRegisterStudent;
