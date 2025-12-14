import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicationById, updateOfficeUseOnly } from '../services/admissonService';
function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admitted, setAdmitted] = useState(false);
  const [admissionNo, setAdmissionNo] = useState('');
  const [portalNumber, setPortalNumber] = useState('');
  const [savingOffice, setSavingOffice] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getApplicationById(id);
        const result =  response;
        console.log(result.data);
        if (result.success) {
          const app = result.data[0];
          setData(app);
          const admittedFlag = !!(app?.officeUseOnly?.studentIdGenerated);
          setAdmitted(admittedFlag);
          setAdmissionNo(app?.officeUseOnly?.studentIdGenerated || '');
          setPortalNumber(app?.officeUseOnly?.portalNumber || '');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (!data) {
    return <div style={styles.container}>Application not found</div>;
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
      <button onClick={() => navigate(-1)} style={styles.backButton}>← Back</button>
      
      <h1>Application Details</h1>
      <div style={styles.appId}>Application ID: {data.applicationId}</div>

      <div style={styles.section}>
        <h2>Student Details</h2>
        <div style={styles.grid}>
          <div><strong>Name:</strong> {data.studentDetails?.studentName}</div>
          <div><strong>Father:</strong> {data.studentDetails?.fatherName}</div>
          <div><strong>Mother:</strong> {data.studentDetails?.motherName}</div>
          <div><strong>DOB:</strong> {data.studentDetails?.dateOfBirth}</div>
          <div><strong>Gender:</strong> {data.studentDetails?.gender}</div>
          <div><strong>Aadhar:</strong> {data.studentDetails?.aadharNumber}</div>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Address Details</h2>
        <div style={styles.grid}>
          <div><strong>House No:</strong> {data.addressDetails?.houseNo}</div>
          <div><strong>Street:</strong> {data.addressDetails?.street}</div>
          <div><strong>Village:</strong> {data.addressDetails?.village}</div>
          <div><strong>Mandal:</strong> {data.addressDetails?.mandal}</div>
          <div><strong>District:</strong> {data.addressDetails?.district}</div>
          <div><strong>Pin Code:</strong> {data.addressDetails?.pinCode}</div>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Contact Details</h2>
        <div style={styles.grid}>
          <div><strong>Mobile:</strong> {data.contactDetails?.mobileNo}</div>
          <div><strong>Email:</strong> {data.contactDetails?.email}</div>
          <div><strong>Parents Contact:</strong> {data.contactDetails?.parentsContactNo}</div>
          <div><strong>Guardian Contact:</strong> {data.contactDetails?.guardianContactNo}</div>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Other Details</h2>
        <div style={styles.grid}>
          <div><strong>Category:</strong> {data.otherDetails?.category}</div>
          <div><strong>Religion:</strong> {data.otherDetails?.religion}</div>
          <div><strong>Caste:</strong> {data.otherDetails?.caste}</div>
          <div><strong>Bank:</strong> {data.otherDetails?.bankName}</div>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Preferences</h2>
        <div style={styles.grid}>
          <div><strong>Degree Group:</strong> {data.preferences?.degreeGroup}</div>
          <div><strong>Language:</strong> {data.preferences?.secondLanguage}</div>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Office Use Only</h2>
        <div style={styles.grid}>
          <div><strong>Fee Paid:</strong> {data.officeUseOnly?.applicationFeePaid}</div>
          <div><strong>Student ID:</strong> {data.officeUseOnly?.studentIdGenerated || '—'}</div>
          <div><strong>Portal No:</strong> {data.officeUseOnly?.portalNumber || '—'}</div>
        </div>

        <div style={{ marginTop: 14 }}>
          {!admitted ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                style={{ ...styles.button, backgroundColor: '#2563eb' }}
                onClick={() => setAdmitted(true)}
              >
                Mark as Admitted
              </button>
              <div style={{ color: '#6b7280' }}>Not admitted</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ fontWeight: 700, color: '#065f46' }}>Admitted</div>
                <button
                  style={{ ...styles.button, backgroundColor: '#ef4444' }}
                  onClick={async () => {
                    // mark as not admitted: clear officeUseOnly fields
                    setSavingOffice(true);
                    try {
                      const res = await updateOfficeUseOnly(data.applicationId, { studentIdGenerated: '', portalNumber: '' });
                      if (res.success) {
                        setData(res.data);
                        setAdmitted(false);
                        setAdmissionNo('');
                        setPortalNumber('');
                      }
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setSavingOffice(false);
                    }
                  }}
                >
                  Mark as Not Admitted
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input
                  placeholder="Admission Number"
                  value={admissionNo}
                  onChange={(e) => setAdmissionNo(e.target.value)}
                  style={styles.inputSmall}
                />
                <input
                  placeholder="Portal Number"
                  value={portalNumber}
                  onChange={(e) => setPortalNumber(e.target.value)}
                  style={styles.inputSmall}
                />
              </div>

              <div style={{ marginTop: 8 }}>
                <button
                  style={{ ...styles.button, backgroundColor: '#06b6d4' }}
                  onClick={async () => {
                    navigate(`/applications`);
                    setSavingOffice(true);
                    try {
                      const officeUseData = { studentIdGenerated: admissionNo, portalNumber };
                      const res = await updateOfficeUseOnly(data.applicationId, officeUseData);
                      if (res.success) {
                        setData(res.data);
                      }
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setSavingOffice(false);
                    }
                  }}
                  disabled={savingOffice}
                >
                  {savingOffice ? 'Saving...' : 'Save Admission'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

   
    </div>
    </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
  },
  backButton: {
    marginBottom: '20px',
    padding: '8px 16px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  appId: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: '20px',
  },
  section: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #ddd',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginTop: '10px',
  },
  buttonContainer: {
    marginTop: '30px',
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  inputSmall: {
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #ddd'
  }
};

export default ApplicationDetails;