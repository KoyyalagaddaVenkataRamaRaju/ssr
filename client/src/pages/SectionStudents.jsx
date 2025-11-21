import React, { useState, useEffect } from 'react';
import { getAllDepartments } from '../services/departmentService';
import { fetchBatchesByDepartment } from '../services/teacherAllocationService.jsx';
import { fetchSectionsbyDepartementandBatchandYear,fetchStudentsbyBatchandSection} from '../services/sectionService.jsx';

const SectionStudents = () => {
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    department: '',
    batch: '',
    section: '',
    year: ''
  });

  const [displayInfo, setDisplayInfo] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await getAllDepartments();
      const data = await response;
      if (data.success) {
        setDepartments(data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const getBatchesByDepartment = async (departmentId) => {
    try {
      const response = await fetchBatchesByDepartment(departmentId);
      const data =  response;
      console.log(data);
      if (data.success) {
        setBatches(data.data);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const fetchSectionsByBatch = async (batchId, academicYear = '2025-2026') => {
    console.log(filters.department,batchId,academicYear)
    try {
      const response = await  fetchSectionsbyDepartementandBatchandYear(filters.department,batchId, academicYear);
      const data = response;
      if (data.success) {
        setSections(data.data);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setFilters({
      ...filters,
      department: departmentId,
      batch: '',
      section: '',
      year: ''
    });
    setBatches([]);
    setSections([]);
    setStudents([]);

    if (departmentId) {
      getBatchesByDepartment(departmentId);
    }
  };

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    const selectedBatch = batches.find(b => b._id === batchId);
    setFilters({
      ...filters,
      batch: batchId,
      year: selectedBatch?.year || '',
      section: ''
    });
    setSections([]);
    setStudents([]);

    if (batchId) {
      fetchSectionsByBatch(batchId);
    }
  };

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;
    const selectedSection = sections.find(s => s._id === sectionId);
    setFilters({
      ...filters,
      section: sectionId
    });
    setDisplayInfo(selectedSection);
    setStudents([]);
  };

  const fetchStudents = async () => {
    if (!filters.batch || !filters.section) {
      alert('Please select batch and section');
      return;
    }

    setLoading(true);
    try {
      const selectedBatch = batches.find(b => b._id === filters.batch);
      const selectedSection = sections.find(s => s._id === filters.section);
    console.log(filters.batch,selectedSection.sectionName);
      const response = await fetchStudentsbyBatchandSection(filters.batch,selectedSection.sectionName);
      const data = response;

      if (data.success) {
        setStudents(data.data);
        setDisplayInfo(selectedSection);
      } else {
        alert('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (students.length === 0) {
      alert('No students to export');
      return;
    }

    const headers = ['S.No', 'Name', 'Email', 'Roll Number', 'Phone', 'Status'];
    const rows = students.map((student, index) => [
      index + 1,
      student.name,
      student.email,
      student.rollNumber || 'N/A',
      student.phone || 'N/A',
      student.isActive ? 'Active' : 'Inactive'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_section_${displayInfo?.sectionName || 'export'}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Section Students</h1>

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Select Section</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Department *
            </label>
            <select
              value={filters.department}
              onChange={handleDepartmentChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
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
              Batch *
            </label>
            <select
              value={filters.batch}
              onChange={handleBatchChange}
              disabled={!filters.department}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px',
                opacity: !filters.department ? 0.5 : 1
              }}
            >
              <option value="">Select Batch</option>
              {batches.map(batch => (
                <option key={batch._id} value={batch._id}>
                  {batch.batchName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Section *
            </label>
            <select
              value={filters.section}
              onChange={handleSectionChange}
              disabled={!filters.batch}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px',
                opacity: !filters.batch ? 0.5 : 1
              }}
            >
              <option value="">Select Section</option>
              {sections.map(section => (
                <option key={section._id} value={section._id}>
                  Section {section.sectionName} (Capacity: {section.capacity})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={fetchStudents}
          disabled={loading || !filters.batch || !filters.section}
          style={{
            padding: '10px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !filters.batch || !filters.section ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: loading || !filters.batch || !filters.section ? 0.6 : 1
          }}
        >
          {loading ? 'Loading...' : 'Load Students'}
        </button>
      </div>

      {displayInfo && (
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          borderLeft: '4px solid #28a745'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Section Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>
              <span style={{ fontWeight: 'bold' }}>Section:</span> {displayInfo.sectionName}
            </div>
            <div>
              <span style={{ fontWeight: 'bold' }}>Batch:</span> {displayInfo.batch?.batchName || batches.find(b => b._id === filters.batch)?.batchName}
            </div>
            <div>
              <span style={{ fontWeight: 'bold' }}>Year:</span> {displayInfo.year}
            </div>
            <div>
              <span style={{ fontWeight: 'bold' }}>Capacity:</span> {displayInfo.capacity}
            </div>
            <div>
              <span style={{ fontWeight: 'bold' }}>Academic Year:</span> {displayInfo.academicYear}
            </div>
          </div>
        </div>
      )}

      {students.length > 0 && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ margin: 0 }}>
              Students in Section {displayInfo?.sectionName} ({students.length})
            </h2>
            <button
              onClick={exportToCSV}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Export to CSV
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>S.No</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Student Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Roll Number</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Phone</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                    <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {student.name}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {student.email}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {student.rollNumber || '-'}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {student.phone || '-'}
                    </td>
                    <td style={{
                      padding: '12px',
                      border: '1px solid #ddd',
                      textAlign: 'center',
                      color: student.isActive ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {students.length === 0 && displayInfo && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          color: '#666'
        }}>
          No students found in Section {displayInfo.sectionName}
        </div>
      )}

      {!displayInfo && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          color: '#666'
        }}>
          Select a section to view students
        </div>
      )}
    </div>
  );
};

export default SectionStudents;
