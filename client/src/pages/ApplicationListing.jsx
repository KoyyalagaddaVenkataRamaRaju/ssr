import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllApplications } from '../services/admissonService.jsx';
import Sidebar from '../components/Sidebar';
function ApplicationListing() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getAllApplications();
        const result = response;
        if (result.success) {
          setApplications(result.data);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <div style={styles.container}>Loading applications...</div>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
        
        {/* ✅ Sidebar ONLY */}
        <Sidebar onToggle={setSidebarOpen} />
    
        {/* ✅ Your existing page UI */}
        <main
          style={{
            flex: 1,
            marginLeft: sidebarOpen ? "250px" : "80px",
            transition: "margin-left 0.3s ease",
            padding: "20px"
          }}
        >
    <div style={styles.container}>
      <h1>Applications List</h1>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th>Application ID</th>
              <th>Student Name</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.applicationId || app._id} style={styles.tableRow}>
                <td style={styles.tableCell}>{app.applicationId}</td>
                <td style={styles.tableCell}>{app.studentName}</td>
                <td style={styles.tableCell}>{app.mobileNo}</td>
                <td style={styles.tableCell}>{app.gender}</td>
                <td style={styles.tableCell}>{app.status}</td>
                <td style={styles.tableCell}>
                  <button
                    onClick={() => navigate(`/applications/${app.applicationId}`)}
                    style={styles.viewButton}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  tableHeader: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
  tableCell: {
    padding: '12px',
    textAlign: 'left',
  },
  viewButton: {
    padding: '6px 12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ApplicationListing;