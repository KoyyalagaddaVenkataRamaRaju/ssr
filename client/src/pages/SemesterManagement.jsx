import React, { useState, useEffect } from 'react';
import { semesterService } from '../services/semesterService.js';

const SemesterManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [filteredSemesters, setFilteredSemesters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterAcademicYear, setFilterAcademicYear] = useState('');
  const [formData, setFormData] = useState({
    semesterName: '',
    semesterNumber: 1,
    academicYear: '',
    department: '',
    year: 1,
    startDate: '',
    endDate: '',
    isActive: true,
    isCurrent: false
  });

  useEffect(() => {
    fetchDepartments();
    fetchSemesters();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [semesters, filterDepartment, filterAcademicYear]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/departments');
      const data = await response.json();
      if (data.success) {
        setDepartments(data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const data = await semesterService.getAll();
      if (data.success) {
        setSemesters(data.data);
      }
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...semesters];

    if (filterDepartment) {
      filtered = filtered.filter(s => s.department?._id === filterDepartment);
    }
    if (filterAcademicYear) {
      filtered = filtered.filter(s => s.academicYear === filterAcademicYear);
    }

    setFilteredSemesters(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSemester) {
        const data = await semesterService.update(editingSemester._id, formData);
        if (data.success) {
          alert('Semester updated successfully!');
        }
      } else {
        const data = await semesterService.create(formData);
        if (data.success) {
          alert('Semester created successfully!');
        }
      }
      resetForm();
      fetchSemesters();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleSetCurrent = async (id) => {
    if (!window.confirm('Are you sure you want to set this as the current semester? This will change the active semester for all related operations.')) return;

    try {
      const data = await semesterService.setAsCurrent(id);
      if (data.success) {
        alert('Current semester updated successfully!');
        fetchSemesters();
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleEdit = (semester) => {
    setEditingSemester(semester);
    setFormData({
      semesterName: semester.semesterName,
      semesterNumber: semester.semesterNumber,
      academicYear: semester.academicYear,
      department: semester.department._id,
      year: semester.year,
      startDate: new Date(semester.startDate).toISOString().split('T')[0],
      endDate: new Date(semester.endDate).toISOString().split('T')[0],
      isActive: semester.isActive,
      isCurrent: semester.isCurrent
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this semester? This action cannot be undone.')) return;

    try {
      const data = await semesterService.delete(id);
      if (data.success) {
        alert('Semester deleted successfully');
        fetchSemesters();
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      semesterName: '',
      semesterNumber: 1,
      academicYear: '',
      department: '',
      year: 1,
      startDate: '',
      endDate: '',
      isActive: true,
      isCurrent: false
    });
    setEditingSemester(null);
    setShowForm(false);
  };

  const getUniqueAcademicYears = () => {
    const years = [...new Set(semesters.map(s => s.academicYear))];
    return years.sort().reverse();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Semester Management</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Manage semesters for all departments. The current semester affects timetables, attendance, and allocations.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: showForm ? '#dc3545' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {showForm ? 'Cancel' : '+ Create Semester'}
        </button>
      </div>

      {showForm && (
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '25px',
          borderRadius: '8px',
          marginBottom: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '20px', marginTop: 0 }}>
            {editingSemester ? 'Edit Semester' : 'Create New Semester'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Semester Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.semesterName}
                  onChange={(e) => setFormData({ ...formData, semesterName: e.target.value })}
                  required
                  placeholder="e.g., Fall Semester 2025"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Department/Branch <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Semester Number <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  value={formData.semesterNumber}
                  onChange={(e) => {
                    const semNum = parseInt(e.target.value);
                    setFormData({
                      ...formData,
                      semesterNumber: semNum,
                      year: Math.ceil(semNum / 2)
                    });
                  }}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Year <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                  disabled
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#e9ecef' }}
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
                <small style={{ color: '#666' }}>Auto-calculated from semester number</small>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Academic Year <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  required
                  placeholder="e.g., 2025-2026"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Start Date <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  End Date <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '30px', marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ marginRight: '8px', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontWeight: 'bold' }}>Active Semester</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isCurrent}
                    onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                    style={{ marginRight: '8px', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontWeight: 'bold' }}>Set as Current Semester</span>
                  <small style={{ marginLeft: '10px', color: '#666' }}>
                    (Will affect timetables and attendance)
                  </small>
                </label>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {editingSemester ? 'Update Semester' : 'Create Semester'}
              </button>
              {editingSemester && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Filter Semesters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Filter by Department
            </label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
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
              Filter by Academic Year
            </label>
            <select
              value={filterAcademicYear}
              onChange={(e) => setFilterAcademicYear(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">All Academic Years</option>
              {getUniqueAcademicYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: '15px' }}>
          All Semesters ({filteredSemesters.length})
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Semester Name</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Department</th>
                <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Sem #</th>
                <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Year</th>
                <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Academic Year</th>
                <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Duration</th>
                <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSemesters.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    No semesters found
                  </td>
                </tr>
              ) : (
                filteredSemesters.map((semester, index) => (
                  <tr key={semester._id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                    <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                      {semester.semesterName}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {semester.department?.departmentName || 'N/A'}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {semester.semesterNumber}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {semester.year}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {semester.academicYear}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', fontSize: '12px' }}>
                      {new Date(semester.startDate).toLocaleDateString()} - {new Date(semester.endDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {semester.isCurrent && (
                        <span style={{
                          display: 'block',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          fontSize: '12px',
                          marginBottom: '5px'
                        }}>
                          CURRENT
                        </span>
                      )}
                      {semester.isActive && !semester.isCurrent && (
                        <span style={{
                          display: 'block',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: '#17a2b8',
                          color: 'white',
                          fontSize: '12px'
                        }}>
                          Active
                        </span>
                      )}
                      {!semester.isActive && (
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: '#6c757d',
                          color: 'white',
                          fontSize: '12px'
                        }}>
                          Inactive
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {!semester.isCurrent && (
                          <button
                            onClick={() => handleSetCurrent(semester._id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#007bff',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                            title="Set as current semester"
                          >
                            Set Current
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(semester)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(semester._id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                          disabled={semester.isCurrent}
                          title={semester.isCurrent ? 'Cannot delete current semester' : 'Delete semester'}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SemesterManagement;
