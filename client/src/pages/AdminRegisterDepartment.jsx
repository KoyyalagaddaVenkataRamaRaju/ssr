import { useState, useEffect } from 'react';
import { PlusSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { adminRegisterDepartement, getAllDepartments } from '../services/departmentService';
import Card from '../components/Card';
import '../styles/register.css';
import { Link } from 'react-router-dom'; // Import Link

const AdminRegisterDepartment = () => {
  const [formData, setFormData] = useState({
    departmentName: '',
    description: '',
    departmentImage: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [departments, setDepartments] = useState([]); // State to store departments

  useEffect(() => {
    fetchDepartments(); // Fetch departments on component mount
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.departmentName || !formData.description || !formData.departmentImage) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setLoading(true);

    try {
      const response = await adminRegisterDepartement(formData);

      if (response.success) {
        setMessage({ type: 'success', text: 'Department registered successfully!' });
        setFormData({
          departmentName: '',
          description: '',
          departmentImage: '',
        });
        fetchDepartments(); // Refresh department list after successful creation
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to register department.' });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to register department. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getAllDepartments();
      if (response.success) {
        setDepartments(response.data); // Assuming the API returns an array of departments
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to fetch departments.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch departments. Please try again.' });
    }
  };

  return (
    <div className="register-user-page">
      <div className="page-header">
        <h1 className="page-title">
          <PlusSquare size={32} />
          Register New Department
        </h1>
        <p className="page-subtitle">Create a new department</p>
      </div>

      <div className="register-content">
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="section-title">Department Information</h3>

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
              {loading ? 'Registering...' : 'Register Department'}
            </button>
          </form>

        {/* Display Departments */}
          <h3 className="section-title">Registered Departments</h3>
          <div className="department-list">
            {departments.length > 0 ? (
              <div className="department-grid">
                {departments.map((department) => (
                  <div key={department._id}>
                  <Link to={`/departments/${department._id}`}>
                  <div key={department._id} className="department-item">
                    <img
                      src={department.departmentImage}
                      alt={department.departmentName}
                      className="department-image"
                    />
                    <div className="department-details">
                     
                        <h4 className="department-name">{department.departmentName}</h4>
        
                      <p className="department-description">{department.description}</p>
                    </div>
                    </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p>No departments registered yet.</p>
            )}
          </div>
      </div>
    </div>
  );
};

export default AdminRegisterDepartment;