import React, { useState, useEffect } from 'react';
import { teacherAllocationService } from '../services/teacherAllocationService.js';
import { subjectService } from '../services/subjectService.js';
import axios from 'axios';
import {fetchTeachersByDepartment,fetchBatchesByDepartment} from '../services/teacherAllocationService.jsx';

const TeacherAllocation = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
  const [batches, setBatches] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [formData, setFormData] = useState({
    teacher: '',
    subject: '',
    department: '',
    batch: '',
    section: 'A',
    year: 1,
    academicYear: '2025-2026'
  });

  useEffect(() => {
    fetchAllocations();
    fetchDepartments();
  }, []);



const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);




  const fetchAllocations = async () => {
    try {
      const data = await teacherAllocationService.getAll();
      if (data.success) {
        setAllocations(data.data);
      }
    } catch (error) {
      console.error('Error fetching allocations:', error);
    }
  };

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

  const fetchTeachers = async (departmentId) => {
    try {
      const response = await fetchTeachersByDepartment(departmentId);
      console.log(response.data);
      if (response.success) {
        
        setTeachers(response.users);
      } else {
        setError(response.message || 'Failed to fetch batches.');
      }
    } catch (err) {
      setError('Failed to fetch batches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectsByDepartment = async (departmentId, year) => {
    try {
      const data = await subjectService.getByDepartmentAndYear(departmentId, year);
      if (data.success) {
        setSubjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
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
    setFormData({ ...formData, department: departmentId });
    if (departmentId) {
      fetchTeachers(departmentId);
      fetchBatches(departmentId);
      if (formData.year) {
        fetchSubjectsByDepartment(departmentId, formData.year);
      }
    }
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setFormData({ ...formData, year: parseInt(year) });
    if (formData.department && year) {
      fetchSubjectsByDepartment(formData.department, year);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await teacherAllocationService.create(formData);
      if (data.success) {
        alert('Teacher allocated successfully!');
        fetchAllocations();
        setFormData({
          teacher: '',
          subject: '',
          department: '',
          batch: '',
          section: 'A',
          year: 1,
          academicYear: '2025-2026'
        });
      }
    } catch (error) {
      console.error('Error creating allocation:', error);
      alert('Failed to allocate teacher: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this allocation?')) return;

    try {
      const data = await teacherAllocationService.delete(id);
      if (data.success) {
        alert('Allocation removed successfully');
        fetchAllocations();
      }
    } catch (error) {
      console.error('Error deleting allocation:', error);
      alert('Failed to remove allocation: ' + error.message);
    }
  };


  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Teacher Subject Allocation</h1>

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Allocate Teacher to Subject</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Department
              </label>
              <select
                value={formData.department}
                onChange={handleDepartmentChange}
                required
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
                Year
              </label>
              <select
                value={formData.year}
                onChange={handleYearChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Teacher
              </label>
              <select
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Select Teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {console.log(teacher)}
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subjectName} ({subject.subjectCode})
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
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                required
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
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>

          
          </div>

          <button
            type="submit"
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Allocate Teacher
          </button>
        </form>
      </div>

      <div>
        <h2 style={{ marginBottom: '20px' }}>Current Allocations</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Teacher</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Subject</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Department</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Year</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Batch</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Section</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Academic Year</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map(allocation => (
                <tr key={allocation._id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {allocation.teacher?.name}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {allocation.subject?.subjectName}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {allocation.department?.departmentName}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {allocation.year}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {allocation.batch?.batchName}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {allocation.section}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {allocation.academicYear}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button
                      onClick={() => handleDelete(allocation._id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherAllocation;
