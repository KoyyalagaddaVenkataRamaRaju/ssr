import React, { useState, useEffect } from 'react';
import { fetchTeacherTimetableId,fetchStudentbyBatchandSection } from '../services/attendanceService';
import { attendenceofStudents } from '../services/attendanceService';


const TakeAttendance = ({ teacherId }) => {
  const [timetables, setTimetables] = useState({});
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (teacherId) {
      fetchTeacherTimetable();
    }
  }, [teacherId]);

  const fetchTeacherTimetable = async () => {
    console.log("Fetching timetable for teacherId:", teacherId);
    try {
      const response = await fetchTeacherTimetableId(teacherId);
      console.log(response.data)
      if (!response.success) {
        throw new Error('Failed to fetch timetable');
      }
      const data =  response.data;
      if (response.success) {
        setTimetables(response.data);
      } else {
        throw new Error(data.message || 'Failed to fetch timetable data');
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async (batchId, section) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchStudentbyBatchandSection(batchId, section);
      if (!response.success) {
        throw new Error('Failed to fetch students');
      }
      const data =  response.data;
      console.log(response)
      if (response.success) {
        setStudents(data);
        const initialRecords = data.map(student => ({
          student: student._id,
          status: 'Present',
          remarks: ''
        }));
        setAttendanceRecords(initialRecords);
      } else {
        throw new Error(data.message || 'Failed to fetch student data');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError(error.message);
      setStudents([]);
      setAttendanceRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimetableSelect = (timetable) => {
    setSelectedTimetable(timetable);
    fetchStudents(timetable.batch._id, timetable.section);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.student === studentId
          ? { ...record, status }
          : record
      )
    );
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.student === studentId
          ? { ...record, remarks }
          : record
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTimetable) {
      alert('Please select a class period');
      return;
    }

    const attendanceData = {
      timetable: selectedTimetable._id,
      subject: selectedTimetable.subject._id,
      teacher: teacherId,
      department: selectedTimetable.department._id,
      batch: selectedTimetable.batch._id,
      section: selectedTimetable.section,
      date: selectedDate,
      periodNumber: selectedTimetable.periodNumber,
      attendanceRecords: attendanceRecords,
      academicYear: selectedTimetable.academicYear,
      markedBy: teacherId
    };

    try {
      const response = await attendenceofStudents(attendanceData);

      if (!response.success) {
        throw new Error('Network response was not ok');
      }

      const data =  response.data;
      if (response.success) {
        alert('Attendance marked successfully!');
        setSelectedTimetable(null);
        setStudents([]);
        setAttendanceRecords([]);
      } else {
        alert('Error: ' + (data.error || 'Failed to mark attendance'));
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Failed to mark attendance: ' + error.message);
    }
  };

  const markAllPresent = () => {
    setAttendanceRecords(prev =>
      prev.map(record => ({ ...record, status: 'Present' }))
    );
  };

  const markAllAbsent = () => {
    setAttendanceRecords(prev =>
      prev.map(record => ({ ...record, status: 'Absent' }))
    );
  };

  const getCurrentDayTimetable = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    return timetables[today] || [];
  };

  const presentCount = attendanceRecords.filter(r => r.status === 'Present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'Absent').length;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Take Attendance</h1>

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Select Period</h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
          {getCurrentDayTimetable().map(timetable => (
            <div
              key={timetable._id}
              onClick={() => handleTimetableSelect(timetable)}
              style={{
                padding: '15px',
                border: selectedTimetable?._id === timetable._id ? '3px solid #007bff' : '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedTimetable?._id === timetable._id ? '#e8f4f8' : 'white',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>
                Period {timetable.periodNumber}
              </div>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                {timetable.startTime} - {timetable.endTime}
              </div>
              <div style={{ fontSize: '14px', color: '#007bff', marginBottom: '5px' }}>
                {timetable.subject?.subjectName}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {timetable.batch?.batchName} - Section {timetable.section}
              </div>
              {timetable.roomNumber && (
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {timetable.roomNumber}
                </div>
              )}
            </div>
          ))}
        </div>

        {isLoading && (
          <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            Loading...
          </div>
        )}
        
        {!isLoading && error && (
          <div style={{ textAlign: 'center', color: '#dc3545', padding: '20px' }}>
            {error}
          </div>
        )}

        {!isLoading && !error && getCurrentDayTimetable().length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No classes scheduled for today
          </div>
        )}
      </div>

      {selectedTimetable && students.length > 0 && (
        <form onSubmit={handleSubmit}>
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2>Mark Attendance</h2>
                <p style={{ color: '#666', margin: '5px 0' }}>
                  {selectedTimetable.subject?.subjectName} - {selectedTimetable.batch?.batchName} Section {selectedTimetable.section}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                  <span style={{ color: '#28a745', fontWeight: 'bold' }}>Present: {presentCount}</span>
                  {' | '}
                  <span style={{ color: '#dc3545', fontWeight: 'bold' }}>Absent: {absentCount}</span>
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Total: {students.length}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <button
                type="button"
                onClick={markAllPresent}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={markAllAbsent}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Mark All Absent
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>S.No</th>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Student Name</th>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Status</th>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => {
                    const record = attendanceRecords.find(r => r.student === student._id);
                    return (
                      <tr key={student._id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {student.name}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {student.email}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                            {['Present', 'Absent', 'Late', 'Excused'].map(status => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => handleStatusChange(student._id, status)}
                                style={{
                                  padding: '5px 10px',
                                  backgroundColor: record?.status === status
                                    ? (status === 'Present' ? '#28a745' : status === 'Absent' ? '#dc3545' : '#ffc107')
                                    : '#e0e0e0',
                                  color: record?.status === status ? 'white' : '#333',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: record?.status === status ? 'bold' : 'normal'
                                }}
                              >
                                {status.charAt(0)}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <input
                            type="text"
                            value={record?.remarks || ''}
                            onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                            placeholder="Optional remarks"
                            style={{
                              width: '100%',
                              padding: '5px',
                              border: '1px solid #ddd',
                              borderRadius: '4px'
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '12px 30px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Submit Attendance
          </button>
        </form>
      )}
    </div>
  );
};

export default TakeAttendance;
