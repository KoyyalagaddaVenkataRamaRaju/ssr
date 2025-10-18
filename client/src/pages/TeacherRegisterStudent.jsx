import { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { teacherRegisterStudent, getMyStudents } from '../services/authService';
import { getAllBatchesbyTeacher, getBatchById ,getAllDepartments} from '../services/batchService';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

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
  const [allDepartments, setAllDepartments] = useState([]);
  const [hasPermission, setHasPermission] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    if (user && user.canRegisterStudents) {
      setHasPermission(true);
      fetchMyStudents();
      fetchBatches();
      fetchDepartments();
    } else {
      setHasPermission(false);
    }
  }, [user]);

  const fetchDepartments = async () => {
    try {
      const response = await getAllDepartments();
      // response.data expected to be an array of department objects
      if (response && response.success) {
        setAllDepartments(response.data || []);
      } else {
        setAllDepartments([]);
      }
    } catch (err) {
      console.log('Failed to fetch departments', err);
      setAllDepartments([]);
    }
  };

  // Fetch all batches
  const fetchBatches = async () => {
    try {
      const response = await getAllBatchesbyTeacher();
      if (response.success) setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  // Fetch departments dynamically based on selected batch
  const fetchDepartmentsByBatch = async (batchId) => {
    try {
      console.log(batchId)
      const response = await getBatchById(batchId);
      console.log("page",response.data)
      // response.data is expected to be an object like { departments: [...] }
      if (response && response.success && response.data && Array.isArray(response.data.departments)) {
        setDepartments(response.data.departments);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    }
  };

  // Fetch students created by the logged-in teacher
  const fetchMyStudents = async () => {
    try {
      const response = await getMyStudents();
      if (response.success) setMyStudents(response.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage({ type: '', text: '' });

    if (name === 'batch') {
      setFormData({ ...formData, batch: value, department: '' });
      fetchDepartmentsByBatch(value);
      fetchDepartments();
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.department || !formData.batch) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
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
        setFormData({ name: '', email: '', password: '', department: '', batch: '', phone: '', enrollmentId: '' });
        setDepartments([]);
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
        <p className="page-subtitle">Create and manage your assigned students</p>
      </div>

      <div className="register-content">
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">Student Information</h3>

            <div className="form-group">
              <label>Full Name <span className="required">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="Enter full name" />
            </div>

            <div className="form-group">
              <label>Email Address <span className="required">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="Enter email" />
            </div>

            <div className="form-group">
              <label>Password <span className="required">*</span></label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-input" placeholder="Min 6 characters" />
            </div>

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
            >
              <option value="">Select Department</option>
              {/* If a batch is selected, show only departments assigned to that batch (resolve names from allDepartments). Otherwise show all departments. */}
  
           {departments.map((d) => {
                    // d could be an object like { department: deptId } or might be just an 
                return (
                      <option key={d._id} value={d._id}>
                        {d.departmentName}
                      </option>
                    );
                  })}
            </select>
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="Enter phone number" />
            </div>

            <div className="form-group">
              <label>Enrollment ID</label>
              <input type="text" name="enrollmentId" value={formData.enrollmentId} onChange={handleChange} className="form-input" placeholder="Enter enrollment ID" />
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
