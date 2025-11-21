import React, { useState, useEffect } from 'react';
import { fetchTeacherByDepartment, getAllDepartments } from '../services/departmentService';
import { fetchBatchesByDepartment } from '../services/teacherAllocationService.jsx';
import { teacherClasses } from '../services/timetableService.jsx';

const TeacherClasses = () => {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState({});
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    teacher: '',
    department: '',
    batch: '',
    academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
  });

  // GROUP BY DAY LOGIC (CRITICAL)
  const groupByDay = (items) => {
    const result = {};
    items.forEach((item) => {
      const day = item.dayOfWeek;
      if (!result[day]) result[day] = [];
      result[day].push(item);
    });
    return result;
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await getAllDepartments();
      if (res.success) setDepartments(res.data);
    } catch (err) {
      console.error("Error loading departments:", err);
    }
  };

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;

    setFilters({
      ...filters,
      department: departmentId,
      batch: '',
      teacher: ''
    });

    if (!departmentId) {
      setTeachers([]);
      setBatches([]);
      return;
    }

    try {
      const [teacherRes, batchRes] = await Promise.all([
        fetchTeacherByDepartment(departmentId),
        fetchBatchesByDepartment(departmentId)
      ]);

      if (teacherRes.success) setTeachers(teacherRes.data);
      if (batchRes.success) setBatches(batchRes.data);
    } catch (err) {
      console.error("Error loading teachers/batches:", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchTeacherClassesData = async () => {
    if (!filters.teacher) return alert("Please select a teacher");

    setLoading(true);
    try {
      const response = await teacherClasses(
        filters.teacher,
        filters.department,
        filters.batch,
        filters.academicYear
      );

      console.log("Teacher Classes Response:", response);

      if (response.success) {
        const grouped = groupByDay(response.data);
        setClasses(grouped);
      } else {
        setClasses({});
      }
    } catch (err) {
      console.error("Error fetching teacher classes:", err);
      alert("Failed to fetch teacher classes");
    } finally {
      setLoading(false);
    }
  };

  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const selectedTeacher = teachers.find(t => t._id === filters.teacher);

  const getTimeColor = (startTime) => {
    const hour = parseInt(startTime.split(':')[0]);
    if (hour < 12) return '#e3f2fd';
    if (hour < 14) return '#fff3e0';
    return '#f3e5f5';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Teacher Classes & Schedule</h1>

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Select Teacher</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          
          <div>
            <label>Department</label>
            <select
              name="department"
              value={filters.department}
              onChange={handleDepartmentChange}
              style={{ width: '100%', padding: '10px' }}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.departmentName}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Batch (Optional)</label>
            <select
              name="batch"
              value={filters.batch}
              onChange={handleFilterChange}
              disabled={!filters.department}
              style={{ width: '100%', padding: '10px' }}
            >
              <option value="">All Batches</option>
              {batches.map((b) => (
                <option key={b._id} value={b._id}>{b.batchName}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Teacher *</label>
            <select
              name="teacher"
              value={filters.teacher}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '10px' }}
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Academic Year</label>
            <input
              type="text"
              name="academicYear"
              value={filters.academicYear}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '10px' }}
            />
          </div>
        </div>

        <button
          onClick={fetchTeacherClassesData}
          disabled={loading || !filters.teacher}
          style={{ padding: '10px 30px', backgroundColor: '#007bff', color: 'white' }}
        >
          {loading ? 'Loading...' : 'Load Teacher Classes'}
        </button>
      </div>

      {Object.keys(classes).length > 0 && (
        <div>
          <div style={{
            backgroundColor: '#e3f2fd',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3>Teacher Information</h3>
            <div>
              <strong>Name:</strong> {selectedTeacher?.name}<br />
              <strong>Email:</strong> {selectedTeacher?.email}<br />
              <strong>Department:</strong> {selectedTeacher?.department?.departmentName}
            </div>
          </div>

          <h2>Weekly Schedule</h2>
          {dayOrder.map((day) => {
            const dayClasses = classes[day] || [];
            if (dayClasses.length === 0) return null;

            return (
              <div key={day} style={{ marginBottom: '30px' }}>
                <h3 style={{ backgroundColor: '#007bff', color: 'white', padding: '10px' }}>
                  {day}
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                }}>
                  {dayClasses.map((c, i) => (
                    <div key={i} style={{ padding: '15px', backgroundColor: getTimeColor(c.startTime) }}>
                      <div><strong>Period:</strong> {c.periodNumber}</div>
                      <div><strong>Subject:</strong> {c.subject?.subjectName}</div>
                      <div><strong>Code:</strong> {c.subject?.subjectCode}</div>
                      <div><strong>Batch:</strong> {c.batch?.batchName}</div>
                      <div><strong>Section:</strong> {c.section}</div>
                      <div><strong>Room:</strong> {c.roomNumber || 'N/A'}</div>
                      <div><strong>Time:</strong> {c.startTime} - {c.endTime}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {Object.keys(classes).length === 0 && !loading && filters.teacher && (
        <div>No classes found.</div>
      )}
    </div>
  );
};

export default TeacherClasses;
