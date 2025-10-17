import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { PlusSquare, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import { getDepartmentById, createBatch, getAllBatchesByDepartmentId } from '../services/departmentService'; // You'll need to create these API functions
import '../styles/department.css'; // Create a new CSS file for department-specific styles

const DepartmentPage = () => {
  const { departmentId } = useParams(); // Get the department ID from the URL
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [batchFormData, setBatchFormData] = useState({
    startYear: new Date().getFullYear(), // Default to current year
    numberOfSections: 1,
  });
  const [batchMessage, setBatchMessage] = useState({ type: '', text: '' });
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await getDepartmentById(departmentId);
        if (response.success) {
          console.log(response)
          setDepartment(response.data);
        } else {
          setError(response.message || 'Failed to fetch department.');
        }
      } catch (err) {
        setError('Failed to fetch department. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchBatches = async () => {
      try {
        const response = await getAllBatchesByDepartmentId(departmentId);
        if (response.success) {
          console.log(response.data)
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

    fetchDepartment();
    fetchBatches();
  }, [departmentId]);

  const handleBatchChange = (e) => {
    const { name, value } = e.target;
    setBatchFormData({ ...batchFormData, [name]: value });
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    setBatchMessage({ type: '', text: '' });

    try {
      // Calculate batch name based on start year
      const startYear = parseInt(batchFormData.startYear);
      const endYear = startYear + 3;
      const batchName = `${startYear}-${endYear}`;

      const response = await createBatch(departmentId, {
        batchName: batchName,
        numberOfSections: batchFormData.numberOfSections,
      });

      if (response.success) {
        setBatchMessage({ type: 'success', text: 'Batch created successfully!' });
        setBatchFormData({ startYear: new Date().getFullYear(), numberOfSections: 1 });
        // Optionally refresh the department data to show the new batch
        const fetchBatches = async () => {
          try {
            const response = await getAllBatchesByDepartmentId(departmentId);
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
        fetchBatches();
      } else {
        setBatchMessage({ type: 'error', text: response.message || 'Failed to create batch.' });
      }
    } catch (err) {
      setBatchMessage({ type: 'error', text: 'Failed to create batch. Please try again.' });
    }
  };

  if (loading) {
    return <div>Loading department details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!department) {
    return <div>Department not found.</div>;
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="department-page">
      <div className="page-header">
        <img
          src={department.departmentImage}
          alt={department.departmentName}
          className="department-box-image"
        />
        <h1 className="page-title">{department.departmentName}</h1>
        <p className="page-subtitle">{department.description}</p>
      </div>

      <div className="department-content">
        
          <h2 className="section-title">Create New Batch</h2>
          <form className="batch-form" onSubmit={handleBatchSubmit}>
            <div className="form-group">
              <label htmlFor="startYear" className="form-label">
                Start Year:
              </label>
              <select
                id="startYear"
                name="startYear"
                className="form-input"
                value={batchFormData.startYear}
                onChange={handleBatchChange}
                required
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="numberOfSections" className="form-label">
                Number of Sections:
              </label>
              <input
                type="number"
                id="numberOfSections"
                name="numberOfSections"
                className="form-input"
                value={batchFormData.numberOfSections}
                onChange={handleBatchChange}
                min="1"
                required
              />
            </div>
            {batchMessage.text && (
              <div className={`message ${batchMessage.type}`}>
                {batchMessage.type === 'success' ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span>{batchMessage.text}</span>
              </div>
            )}
            <button type="submit" className="btn btn-primary">
              Create Batch
            </button>
          </form>
        

        {/* Display existing batches */}
        
          <h2 className="section-title">Existing Batches</h2>
          {batches.length > 0 ? (
            <ul className="existing-batches">
              {batches.map((batch) => (
                <li key={batch._id}>
                  {batch.batchName} - {batch.numberOfSections} Sections
                </li>
              ))}
            </ul>
          ) : (
            <p>No batches created yet.</p>
          )}
        
      </div>
    </div>
  );
};

export default DepartmentPage;