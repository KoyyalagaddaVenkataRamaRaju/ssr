import React, { useState, useEffect } from 'react';
import { fetchBatchesByDepartment } from '../services/teacherAllocationService.jsx';
import { createSection,fetchSectionsbyDepartementandBatchandYear} from '../services/sectionService.jsx';
import { fetchDepartment} from '../services/attendanceService.jsx';

const SectionManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [error,setError] = useState('')
  const [formData, setFormData] = useState({
    department: '',
    batch: '',
    year: '',
    numberOfSections: 1,
    capacity: 60,
    academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
  });

  const [viewFilters, setViewFilters] = useState({
    department: '',
    batch: '',
    academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetchDepartment();
      const data =response.data;
      if (response.success) {
        setDepartments(data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      alert('Failed to fetch departments');
    }
  };

 const fetchBatches = async (departmentId) => {
    try {
      const response = await fetchBatchesByDepartment(departmentId);
      console.log(response.data);
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

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    console.log(departmentId)
    console.log('Selected Department ID:', departmentId);
    setFormData({
      ...formData,
      department: departmentId,
      batch: '',
      year: ''
    });
    if (departmentId) {
      fetchBatches(departmentId);
    }
  };

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    const selectedBatch = batches.find(b => b._id === batchId);
    setFormData({
      ...formData,
      batch: batchId,
      year: selectedBatch?.year || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'numberOfSections' || name === 'capacity' || name === 'year'
        ? parseInt(value)
        : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.department || !formData.batch || !formData.year) {
      alert('Please select department, batch, and year');
      setLoading(false);
      return;
    }

    try {
     

      const sectionData = {
        department: formData.department,
        batch: formData.batch,
        year: formData.year,
        numberOfSections: formData.numberOfSections,
        capacity: formData.capacity,
        academicYear: formData.academicYear
      };

       const response = await createSection(sectionData);

      const data = await response.data;
      console.log(data)

      if (response.success) {
        alert(data.message || 'Sections created successfully!');
        setFormData({
          department: '',
          batch: '',
          year: '',
          numberOfSections: 1,
          capacity: 60,
          academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
        });
        fetchSections();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating sections:', error);
      alert('Failed to create sections');
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
     const departmentId = viewFilters.department || '';
    const batchId = viewFilters.batch || '';
    const academicYear = viewFilters.academicYear || '';
    
    try {



      const response = await fetchSectionsbyDepartementandBatchandYear(departmentId,batchId,academicYear);
      const data = response.data;

      if (response.success) {
        setSections(data);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      
    }
  };

  const handleViewDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    console.log("view"+departmentId)
    setViewFilters({
      ...viewFilters,
      department: departmentId,
      batch: ''
    });

    if (departmentId) {
        console.log("view"+departmentId)
      await fetchBatchesByDepartment(departmentId);
    }
  };

  const handleViewBatchChange = (e) => {
    setViewFilters({
      ...viewFilters,
      batch: e.target.value
    });
  };

  const handleViewApply = () => {
    fetchSections();
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm('Are you sure you want to deactivate this section?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/sections/${sectionId}`, {
          method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
          alert('Section deactivated successfully');
          fetchSections();
        } else {
          alert('Error: ' + data.error);
        }
      } catch (error) {
        console.error('Error deleting section:', error);
        alert('Failed to delete section');
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Section Management</h1>

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Create Sections</h2>

        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Department
              </label>
              <select
                value={formData.department}
                onChange={handleDepartmentChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept.batchId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Batch
              </label>
              <select
                value={formData.batch}
                onChange={handleBatchChange}
                disabled={!formData.department}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  opacity: !formData.department ? 0.5 : 1
                }}
              >
                <option value="">Select Batch</option>
                
                {batches.map(batch => (
                  <option key={batch._id} value={batch.batchId}>
                    {batch.batchName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Year
              </label>
              <select
                value={formData.year}
                onChange={handleInputChange}
                name="year"
                disabled={!formData.batch}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  opacity: !formData.batch ? 0.5 : 1
                }}
              >
                <option value="">Select Year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Number of Sections
              </label>
              <select
                name="numberOfSections"
                value={formData.numberOfSections}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="1">1 (A)</option>
                <option value="2">2 (A, B)</option>
                <option value="3">3 (A, B, C)</option>
                <option value="4">4 (A, B, C, D)</option>
                <option value="5">5 (A, B, C, D, E)</option>
                <option value="6">6 (A, B, C, D, E, F)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Student Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="10"
                max="200"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Academic Year
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 30px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Creating...' : 'Create Sections'}
          </button>
        </form>
      </div>

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>View Sections</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Department (Optional)
            </label>
            <select
              value={viewFilters.department}
              onChange={handleViewDepartmentChange}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Batch (Optional)
            </label>
            <select
              value={viewFilters.batch}
              onChange={handleViewBatchChange}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            >
              <option value="">All Batches</option>
              {batches.map(batch => (
                <option key={batch._id} value={batch._id}>
                  {batch.batchName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Academic Year
            </label>
            <input
              type="text"
              value={viewFilters.academicYear}
              onChange={(e) => setViewFilters({ ...viewFilters, academicYear: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <button
          onClick={handleViewApply}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Load Sections
        </button>
      </div>

      {sections.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Sections List ({sections.length})</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Section</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Department</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Batch</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Year</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Capacity</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Academic Year</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section, index) => (
                  <tr key={section._id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                    <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold', fontSize: '16px' }}>
                      {section.sectionName}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {section.department?.departmentName || 'N/A'}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {section.batch?.batchName || 'N/A'}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {section.year}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {section.capacity}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {section.academicYear}
                    </td>
                    <td style={{
                      padding: '12px',
                      border: '1px solid #ddd',
                      textAlign: 'center',
                      color: section.isActive ? '#28a745' : '#dc3545'
                    }}>
                      {section.isActive ? 'Active' : 'Inactive'}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteSection(section._id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {sections.length === 0 && viewFilters.department && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          color: '#666'
        }}>
          No sections found for the selected criteria
        </div>
      )}
    </div>
  );
};

export default SectionManagement;
