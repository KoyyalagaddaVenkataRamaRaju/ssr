import { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, AlertCircle, Lock, Loader2 } from 'lucide-react';
import { teacherRegisterStudent, getMyStudents } from '../services/authService';
import { fetchBatchesByDepartment, fetchSectionsByDepartment } from '../services/teacherAllocationService.jsx';

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
    section: '',
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
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.canRegisterStudents) {
      setHasPermission(true);
      fetchInitialData();
    } else {
      setHasPermission(false);
    }
  }, [user]);

  const fetchInitialData = async () => {
 
    fetchDepartments();
    fetchMyStudents();
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
      section: "",
    });
    if (departmentId) {
      console.group("section"+departmentId)
      fetchBatches(departmentId);
      fetchSections(departmentId);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setMessage({ type: "", text: "" });
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

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const { name, email, password,section, department, batch } = formData;

    if (!name || !email || !password || !department || !batch || !section) {
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
          section: '',
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

<div className="form-group">
  <label>Name <span className="required">*</span></label>
  <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    className="form-input"
    placeholder="Enter name"
  />
</div>

{/* EMAIL */}
<div className="form-group">
  <label>Email <span className="required">*</span></label>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    className="form-input"
    placeholder="Enter email"
  />
</div>

{/* PASSWORD */}
<div className="form-group">
  <label>Password <span className="required">*</span></label>
  <input
    type="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    className="form-input"
    placeholder="Enter password"
  />
</div>


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
            {/* PHONE */}
<div className="form-group">
  <label>Phone</label>
  <input
    type="text"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    className="form-input"
    placeholder="Enter phone"
  />
</div>

{/* ENROLLMENT ID */}
<div className="form-group">
  <label>Enrollment ID</label>
  <input
    type="text"
    name="enrollmentId"
    value={formData.enrollmentId}
    onChange={handleChange}
    className="form-input"
    placeholder="Enter enrollment ID"
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
