import React, { useState, useEffect } from 'react';
import { fetchBatchesByDepartment ,fetchTeacherandSubjectAllocations,createTimetable,fetchTimetablebyBatchandSection} from '../services/timetableService.jsx';
const TimetablePreparation = () => {
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [formData, setFormData] = useState({
    dayOfWeek: 'Monday',
    periodNumber: 1,
    startTime: '09:00',
    endTime: '10:00',
    teacherAllocation: '',
    roomNumber: '',
    academicYear: '2025-2026'
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [
    { number: 1, start: '09:00', end: '10:00' },
    { number: 2, start: '10:00', end: '11:00' },
    { number: 3, start: '11:00', end: '12:00' },
    { number: 4, start: '12:00', end: '13:00' },
    { number: 5, start: '14:00', end: '15:00' },
    { number: 6, start: '15:00', end: '16:00' },
    { number: 7, start: '16:00', end: '17:00' },
    { number: 8, start: '17:00', end: '18:00' }
  ];

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedBatch && selectedSection) {
      fetchTimetable();
    }
  }, [selectedBatch, selectedSection]);

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

const fetchBatches = async (departmentId) => {
  console.log("Fetching batches for department:", departmentId);
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

  const fetchAllocations = async (departmentId, batchId, section) => {
    try {
      const response = await fetchTeacherandSubjectAllocations(departmentId,batchId,section);
      console.log(response.data);
      if (response.success) {
        setAllocations(response.data);
      } else {
        setError(response.message || 'Failed to fetch batches.');
      }
    } catch (err) {
      setError('Failed to fetch batches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetable = async () => {
  try {
    const data = await fetchTimetablebyBatchandSection(selectedBatch, selectedSection);
    if (data.success) {
      setTimetables(data.data);
    }
  } catch (error) {
    console.error('Error fetching timetable:', error);
    setError(error.message || 'Failed to fetch timetable');
  }
};

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    setSelectedBatch('');
    setAllocations([]);
    if (departmentId) {
      fetchBatches(departmentId);
    }
  };

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    setSelectedBatch(batchId);
    if (batchId && selectedDepartment && selectedSection) {
      fetchAllocations(selectedDepartment, batchId, selectedSection);
    }
  };

  const handleSectionChange = (e) => {
    const section = e.target.value;
    setSelectedSection(section);
    if (selectedBatch && selectedDepartment && section) {
      fetchAllocations(selectedDepartment, selectedBatch, section);
      
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedAllocation = allocations.find(a => a._id === formData.teacherAllocation);
    if (!selectedAllocation) {
      alert('Please select a teacher allocation');
      return;
    }

    const timetableData = {
      department: selectedDepartment,
      batch: selectedBatch,
      section: selectedSection,
      year: selectedAllocation.year,
      dayOfWeek: formData.dayOfWeek,
      periodNumber: formData.periodNumber,
      startTime: formData.startTime,
      endTime: formData.endTime,
      subject: selectedAllocation.subject._id,
      teacher: selectedAllocation.teacher._id,
      teacherAllocation: formData.teacherAllocation,
      roomNumber: formData.roomNumber,
      academicYear: formData.academicYear
    };

    try {
      const response = await createTimetable(timetableData);
      console.log(response.data)
      const data = response.data;
      if (data.success) {
        alert('Timetable entry added successfully!');
        fetchTimetable();
        setFormData({
          dayOfWeek: 'Monday',
          periodNumber: 1,
          startTime: '09:00',
          endTime: '10:00',
          teacherAllocation: '',
          roomNumber: '',
          academicYear: '2025-2026'
        });
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating timetable entry:', error);
      alert('Failed to create timetable entry');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this timetable entry?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/timetable/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        alert('Timetable entry removed successfully');
        fetchTimetable();
      }
    } catch (error) {
      console.error('Error deleting timetable entry:', error);
      alert('Failed to remove timetable entry');
    }
  };

  const getTimetableCell = (day, periodNum) => {
    const dayTimetable = timetables[day] || [];
    return dayTimetable.find(t => t.periodNumber === periodNum);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Timetable Preparation</h1>

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Select Class</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Department
            </label>
            <select
              value={selectedDepartment}
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
              value={selectedBatch}
              onChange={handleBatchChange}
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
              value={selectedSection}
              onChange={handleSectionChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
          </div>
        </div>
      </div>

      {selectedBatch && (
        <>
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Add Timetable Entry</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Day of Week
                  </label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Period
                  </label>
                  <select
                    value={formData.periodNumber}
                    onChange={(e) => {
                      const period = periods.find(p => p.number === parseInt(e.target.value));
                      setFormData({
                        ...formData,
                        periodNumber: period.number,
                        startTime: period.start,
                        endTime: period.end
                      });
                    }}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    {periods.map(period => (
                      <option key={period.number} value={period.number}>
                        Period {period.number} ({period.start} - {period.end})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Teacher & Subject
                  </label>
                  <select
                    value={formData.teacherAllocation}
                    onChange={(e) => setFormData({ ...formData, teacherAllocation: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="">Select Teacher & Subject</option>
                    {allocations.map(allocation => (
                      <option key={allocation._id} value={allocation._id}>
                        {allocation.teacher?.name} - {allocation.subject?.subjectName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    placeholder="e.g., Room 101"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
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
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
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
                Add to Timetable
              </button>
            </form>
          </div>

          <div>
            <h2 style={{ marginBottom: '20px' }}>Weekly Timetable</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd', minWidth: '100px' }}>
                      Period / Day
                    </th>
                    {days.map(day => (
                      <th key={day} style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map(period => (
                    <tr key={period.number}>
                      <td style={{
                        padding: '10px',
                        border: '1px solid #ddd',
                        fontWeight: 'bold',
                        backgroundColor: '#f0f0f0',
                        textAlign: 'center'
                      }}>
                        P{period.number}<br />
                        <small>{period.start}-{period.end}</small>
                      </td>
                      {days.map(day => {
                        const entry = getTimetableCell(day, period.number);
                        return (
                          <td key={day} style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            backgroundColor: entry ? '#e8f4f8' : 'white',
                            verticalAlign: 'top'
                          }}>
                            {entry ? (
                              <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                  {entry.subject?.subjectName}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                  {entry.teacher?.name}
                                </div>
                                {entry.roomNumber && (
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    {entry.roomNumber}
                                  </div>
                                )}
                                <button
                                  onClick={() => handleDelete(entry._id)}
                                  style={{
                                    marginTop: '5px',
                                    padding: '3px 8px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    fontSize: '11px'
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <div style={{ color: '#ccc', textAlign: 'center' }}>-</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TimetablePreparation;
