import React, { useState } from 'react';
import TeacherAllocation from '../pages/TeacherAllocation';
import TimetablePreparation from '../pages/TimetablePreparation';
import TakeAttendance from '../pages/TakeAttendance';
import AttendanceReport from '../pages/AttendanceReport';

function AttendanceSidebar() {
  const [activeTab, setActiveTab] = useState('allocation');
  const [currentTeacherId, setCurrentTeacherId] = useState('68e53e8cccbc2832a367206f');

  const renderContent = () => {
    switch (activeTab) {
      case 'allocation':
        return <TeacherAllocation />;
      case 'timetable':
        return <TimetablePreparation />;
      case 'attendance':
        return <TakeAttendance teacherId={currentTeacherId} />;
      case 'report':
        return <AttendanceReport />;
      default:
        return <TeacherAllocation />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{
        backgroundColor: '#007bff',
        padding: '15px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>
            College Attendance System
          </h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('allocation')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'allocation' ? 'white' : 'transparent',
                color: activeTab === 'allocation' ? '#007bff' : 'white',
                border: activeTab === 'allocation' ? 'none' : '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: activeTab === 'allocation' ? 'bold' : 'normal'
              }}
            >
              Teacher Allocation
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'timetable' ? 'white' : 'transparent',
                color: activeTab === 'timetable' ? '#007bff' : 'white',
                border: activeTab === 'timetable' ? 'none' : '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: activeTab === 'timetable' ? 'bold' : 'normal'
              }}
            >
              Timetable
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'attendance' ? 'white' : 'transparent',
                color: activeTab === 'attendance' ? '#007bff' : 'white',
                border: activeTab === 'attendance' ? 'none' : '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: activeTab === 'attendance' ? 'bold' : 'normal'
              }}
            >
              Take Attendance
            </button>
            <button
              onClick={() => setActiveTab('report')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'report' ? 'white' : 'transparent',
                color: activeTab === 'report' ? '#007bff' : 'white',
                border: activeTab === 'report' ? 'none' : '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: activeTab === 'report' ? 'bold' : 'normal'
              }}
            >
              Reports
            </button>
          </div>
        </div>
      </nav>

      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default AttendanceSidebar;
