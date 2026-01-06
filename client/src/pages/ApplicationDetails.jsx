import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicationById, updateOfficeUseOnly } from '../services/admissonService';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Settings,
  GraduationCap,
  Building2,
  CheckCircle,
  XCircle,
  Save,
  FileText
} from 'lucide-react';

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admitted, setAdmitted] = useState(false);
  const [admissionNo, setAdmissionNo] = useState('');
  const [portalNumber, setPortalNumber] = useState('');
  const [savingOffice, setSavingOffice] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getApplicationById(id);
        if (response.success) {
          const app = response.data[0];
          setData(app);
          setAdmitted(!!app?.officeUseOnly?.studentIdGenerated);
          setAdmissionNo(app?.officeUseOnly?.studentIdGenerated || '');
          setPortalNumber(app?.officeUseOnly?.portalNumber || '');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div style={styles.center}>Loading application…</div>;
  if (!data) return <div style={styles.center}>Application not found</div>;

  return (
    <div style={styles.layout}>
      <Sidebar onToggle={setSidebarOpen} />

      <main
        style={{
          ...styles.main,
          marginLeft: sidebarOpen ? '250px' : '80px',
        }}
      >
        <div style={styles.container}>
          {/* HEADER */}
          <div style={styles.header}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>
              <ArrowLeft size={18} /> Back
            </button>

            <div>
              <h1 style={styles.title}>Application Details</h1>
              <div style={styles.appId}>ID: {data.applicationId}</div>
            </div>
          </div>

          <div style={styles.grid}>
            {/* LEFT COLUMN */}
            <div style={styles.column}>
              <Card icon={<User size={18} />} title="Student Details">
                <Detail label="Name" value={data.studentDetails?.studentName} />
                <Detail label="Father" value={data.studentDetails?.fatherName} />
                <Detail label="Mother" value={data.studentDetails?.motherName} />
                <Detail label="DOB" value={data.studentDetails?.dateOfBirth} />
                <Detail label="Gender" value={data.studentDetails?.gender} />
                <Detail label="Aadhar" value={data.studentDetails?.aadharNumber} />
              </Card>

              <Card icon={<MapPin size={18} />} title="Address Details">
                <Detail label="House No" value={data.addressDetails?.houseNo} />
                <Detail label="Street" value={data.addressDetails?.street} />
                <Detail label="Village" value={data.addressDetails?.village} />
                <Detail label="Mandal" value={data.addressDetails?.mandal} />
                <Detail label="District" value={data.addressDetails?.district} />
                <Detail label="Pin Code" value={data.addressDetails?.pinCode} />
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div style={styles.column}>
              <Card icon={<Phone size={18} />} title="Contact Details">
                <Detail label="Mobile" value={data.contactDetails?.mobileNo} />
                <Detail label="Email" value={data.contactDetails?.email} />
                <Detail label="Parents Contact" value={data.contactDetails?.parentsContactNo} />
                <Detail label="Guardian Contact" value={data.contactDetails?.guardianContactNo} />
              </Card>

              <Card icon={<Settings size={18} />} title="Other Details">
                <Detail label="Category" value={data.otherDetails?.category} />
                <Detail label="Religion" value={data.otherDetails?.religion} />
                <Detail label="Caste" value={data.otherDetails?.caste} />
                <Detail label="Bank" value={data.otherDetails?.bankName} />
              </Card>

              <Card icon={<GraduationCap size={18} />} title="Preferences">
                <Detail label="Degree Group" value={data.preferences?.degreeGroup} />
                <Detail label="Language" value={data.preferences?.secondLanguage} />
              </Card>

              {/* UPLOADED DOCUMENTS */}
              <Card icon={<FileText size={18} />} title="Uploaded Documents">
                <FileLink label="10th Marks Memo" file={data.uploadedFiles?.tenthMarksMemo} />
                <FileLink label="Inter Marks / TC" file={data.uploadedFiles?.interMarksTC} />
                <FileLink label="Student Aadhar" file={data.uploadedFiles?.studentAadhar} />
                <FileLink label="Mother Aadhar" file={data.uploadedFiles?.motherAadhar} />
                <FileLink label="Caste Certificate" file={data.uploadedFiles?.casteCertificate} />
                <FileLink label="Income Certificate" file={data.uploadedFiles?.incomeCertificate} />
                <FileLink label="Ration / Rice Card" file={data.uploadedFiles?.rationRiceCard} />
              </Card>

              <Card icon={<User size={18} />} title="Signature & Photo">
                <FileLink label="Student Signature" file={data.signatureUpload?.studentSignature} />
                <FileLink label="Passport Photo" file={data.signatureUpload?.passportSizePhoto} />
              </Card>

              {/* OFFICE USE */}
              <div style={styles.officeCard}>
                <h3 style={styles.cardTitle}>
                  <Building2 size={18} /> Office Use Only
                </h3>

                <Detail label="Student ID" value={data.officeUseOnly?.studentIdGenerated || '—'} />
                <Detail label="Portal No" value={data.officeUseOnly?.portalNumber || '—'} />

                <div style={styles.divider} />

                {!admitted ? (
                  <button style={styles.primaryBtn} onClick={() => setAdmitted(true)}>
                    <CheckCircle size={18} /> Mark as Admitted
                  </button>
                ) : (
                  <>
                    <div style={styles.inputGrid}>
                      <input
                        style={styles.input}
                        placeholder="Admission Number"
                        value={admissionNo}
                        onChange={(e) => setAdmissionNo(e.target.value)}
                      />
                      <input
                        style={styles.input}
                        placeholder="Portal Number"
                        value={portalNumber}
                        onChange={(e) => setPortalNumber(e.target.value)}
                      />
                    </div>

                    <button
                      style={styles.saveBtn}
                      disabled={savingOffice || !admissionNo}
                      onClick={async () => {
                        setSavingOffice(true);
                        await updateOfficeUseOnly(data.applicationId, {
                          studentIdGenerated: admissionNo,
                          portalNumber,
                        });
                        setSavingOffice(false);
                      }}
                    >
                      <Save size={18} /> Save Admission
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- FILE LINK COMPONENT ---------- */
const FileLink = ({ label, file }) => {
  if (!file?.url) return null;

  const isImage = /\.(jpg|jpeg|png)$/i.test(file.url);

  return (
    <div style={styles.fileRow}>
      <span style={styles.fileLabel}>{label}</span>
      {isImage ? (
        <a href={file.url} target="_blank" rel="noreferrer">
          <img src={file.url} alt={label} style={styles.filePreview} />
        </a>
      ) : (
        <a href={file.url} target="_blank" rel="noreferrer" style={styles.fileBtn}>
          View / Download
        </a>
      )}
    </div>
  );
};

/* ---------- SMALL UI COMPONENTS ---------- */
const Card = ({ title, icon, children }) => (
  <div style={styles.card}>
    <h3 style={styles.cardTitle}>{icon} {title}</h3>
    {children}
  </div>
);

const Detail = ({ label, value }) => (
  <div style={styles.detail}>
    <span style={styles.label}>{label}</span>
    <span style={styles.value}>{value || '—'}</span>
  </div>
);

/* ---------- STYLES ---------- */
const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#f8fafc' },
  main: { flex: 1, transition: 'margin-left .3s', overflowY: 'auto' },
  container: { maxWidth: 1400, margin: '0 auto', padding: 20 },
  header: { display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700 },
  appId: { background: '#e2e8f0', padding: '6px 12px', borderRadius: 8 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 24 },
  column: { display: 'flex', flexDirection: 'column', gap: 20 },
  card: { background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 6px 18px rgba(0,0,0,.06)' },
  officeCard: { background: '#fff', borderRadius: 16, padding: 22, border: '2px solid #e5e7eb' },
  cardTitle: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, marginBottom: 14 },
  detail: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #e5e7eb' },
  label: { fontWeight: 600, color: '#475569' },
  value: { color: '#0f172a' },
  divider: { height: 1, background: '#e5e7eb', margin: '16px 0' },
  inputGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 },
  input: { padding: 12, borderRadius: 8, border: '1px solid #cbd5f5' },
  backBtn: { display: 'flex', alignItems: 'center', gap: 6, background: '#334155', color: '#fff', padding: '10px 16px', borderRadius: 8, border: 'none' },
  primaryBtn: { background: '#2563eb', color: '#fff', padding: '12px 18px', borderRadius: 10, border: 'none' },
  saveBtn: { marginTop: 14, width: '100%', background: '#10b981', color: '#fff', padding: 14, borderRadius: 12, border: 'none', fontWeight: 800 },

  fileRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px dashed #e5e7eb' },
  fileLabel: { fontWeight: 600 },
  fileBtn: { padding: '6px 12px', background: '#2563eb', color: '#fff', borderRadius: 6, fontSize: 13, textDecoration: 'none' },
  filePreview: { width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' },

  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
};

export default ApplicationDetails;
