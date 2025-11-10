import React, { useState, useEffect } from 'react';
import { fetchBatchesByDepartmentId, fetchSubjectsByDepartmentId, fetchAttendanceReport,fetchDepartment } from '../services/attendanceService';



const AttendanceReport = () => {
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    batch: '',
    section: 'A',
    subject: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetchDepartment();
      const data = response.data;
      if (response.success) {
        setDepartments(data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchBatchesByDepartment = async (departmentId) => {
    try {
      const response = await fetchBatchesByDepartmentId(departmentId);
      if (response && response.success) {
        setBatches(response.data);
      } else if (Array.isArray(response)) {
        // if service returned array directly
        setBatches(response);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const fetchSubjectsByDepartment = async (departmentId) => {
    try {
      const response = await fetchSubjectsByDepartmentId(departmentId);
      if (response && response.success) {
        setSubjects(response.data);
      } else if (Array.isArray(response)) {
        setSubjects(response);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setFilters({ ...filters, department: departmentId, batch: '', subject: '' });
    if (departmentId) {
      fetchBatchesByDepartment(departmentId);
      fetchSubjectsByDepartment(departmentId);
    }
  };

  const fetchReport = async () => {
    if (!filters.batch || !filters.section) {
      alert('Please select batch and section');
      return;
    }

    try {
      const response = await fetchAttendanceReport(filters);
      if (response && response.success) {
        setReportData(response.data);
      } else if (Array.isArray(response)) {
        // service may return array directly
        setReportData(response);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      alert('Failed to fetch attendance report');
    }
  };

  const exportToCSV = () => {
    if (reportData.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Student Name', 'Email', 'Total Classes', 'Present', 'Absent', 'Late', 'Excused', 'Attendance %'];
    const rows = reportData.map(record => [
      record.student.name,
      record.student.email,
      record.total,
      record.present,
      record.absent,
      record.late,
      record.excused,
      record.attendancePercentage
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    return '#dc3545';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Attendance Report</h1>

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Filters</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Department
            </label>
            <select
              value={filters.department}
              onChange={handleDepartmentChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
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
              Batch
            </label>
            <select
              value={filters.batch}
              onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
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
              Section
            </label>
            <select
              value={filters.section}
              onChange={(e) => setFilters({ ...filters, section: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Subject (Optional)
            </label>
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Start Date (Optional)
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              End Date (Optional)
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={fetchReport}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Generate Report
          </button>
          {reportData.length > 0 && (
            <button
              onClick={exportToCSV}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Export to CSV
            </button>
          )}
        </div>
      </div>

      {reportData.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>
            Attendance Summary ({reportData.length} Students)
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>S.No</th>
                  <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Student Name</th>
                  <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Total Classes</th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Present</th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Absent</th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Late</th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Excused</th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((record, index) => (
                  <tr key={record.student._id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{record.student.name}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{record.student.email}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {record.total}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', color: '#28a745' }}>
                      {record.present}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', color: '#dc3545' }}>
                      {record.absent}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', color: '#ffc107' }}>
                      {record.late}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', color: '#17a2b8' }}>
                      {record.excused}
                    </td>
                    <td style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: getAttendanceColor(parseFloat(record.attendancePercentage))
                    }}>
                      {record.attendancePercentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px'
          }}>
            <h3 style={{ marginBottom: '10px' }}>Legend</h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ color: '#28a745', fontWeight: 'bold' }}>Green</span>: 75% or above (Good)
              </div>
              <div>
                <span style={{ color: '#ffc107', fontWeight: 'bold' }}>Yellow</span>: 60% - 74% (Warning)
              </div>
              <div>
                <span style={{ color: '#dc3545', fontWeight: 'bold' }}>Red</span>: Below 60% (Poor)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;
