import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Layers } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { createBatch, getAllDepartments, getAllBatches } from "../services/batchService";
import courseService from '../services/courseService';
import "bootstrap/dist/css/bootstrap.min.css";

const AdminRegisterBatchPage = () => {
  const [batchFormData, setBatchFormData] = useState({
    startYear: new Date().getFullYear(),
  });
  const [batchMessage, setBatchMessage] = useState({ type: "", text: "" });

  const [allDepartments, setAllDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // skeleton loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [depsResp, batchesResp] = await Promise.all([
          getAllDepartments(),
          getAllBatches(),
        ]);
        const coursesResp = await courseService.getAllCourses();
        if (!alive) return;
        if (depsResp?.success) setAllDepartments(depsResp.data || []);
        if (batchesResp?.success) setBatches(batchesResp.data || []);
        setCourses(coursesResp || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    load();

    const timer = setTimeout(() => {
      if (alive) setLoading(false);
    }, 1000);

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  const handleDepartmentCheckbox = (deptId) => {
    if (selectedDepartments.find((d) => d.departmentId === deptId)) {
      setSelectedDepartments(selectedDepartments.filter((d) => d.departmentId !== deptId));
    } else {
      setSelectedDepartments([...selectedDepartments, { departmentId: deptId, numberOfSections: 1 }]);
    }
  };

  const handleSectionChange = (deptId, value) => {
    setSelectedDepartments(
      selectedDepartments.map((d) =>
        d.departmentId === deptId ? { ...d, numberOfSections: value } : d
      )
    );
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    setBatchMessage({ type: "", text: "" });

    if (selectedDepartments.length === 0) {
      setBatchMessage({ type: "error", text: "Select at least one department" });
      return;
    }

    const startYear = parseInt(batchFormData.startYear, 10);
    const endYear = startYear + 3;
    const batchName = `${startYear}-${endYear}`; 

    try {
      const response = await createBatch({ batchName,course:selectedCourse, departments: selectedDepartments });

      if (response.success) {
        setBatchMessage({ type: "success", text: "Batch created successfully!" });
        setBatchFormData({ startYear: new Date().getFullYear() });
        setSelectedDepartments([]);
        setBatches((prev) => [...prev, response.data]);
      } else {
        setBatchMessage({ type: "error", text: response.message || "Failed to create batch" });
      }
    } catch (err) {
      setBatchMessage({ type: "error", text: "Failed to create batch. Try again." });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <>
      <style>
        {`
        :root {
          --sidebar-width: 250px;
          --sidebar-collapsed: 80px;
        }

        body {
          background: linear-gradient(135deg, #f3e5f5, #e0f7fa);
          font-family: 'Poppins', sans-serif;
          color: #333;
          margin: 0;
          padding: 0;
          height: 100vh;
          overflow: hidden;
        }

        .batch-page {
          display: flex;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .main-content {
          flex-grow: 1;
          height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 30px 40px;
          transition: margin-left 0.36s ease;
        }

        .page-header {
          margin-bottom: 1.5rem;
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #4a148c;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .page-subtitle {
          color: #666;
          margin-top: 4px;
        }

        .batch-form {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 6px 18px rgba(70,60,90,0.06);
          margin-bottom: 2rem;
          transition: all 0.3s ease;
        }

        .batch-form:hover {
          transform: translateY(-2px);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          font-weight: 500;
          color: #444;
          margin-bottom: 6px;
          display: block;
        }

        select, input[type="number"] {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
        }

        select:focus, input:focus {
          border-color: #6a1b9a;
          outline: none;
          box-shadow: 0 0 0 2px rgba(106,27,154,0.2);
        }

        .department-checkbox {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fafafa;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 10px;
          transition: background 0.3s;
        }

        .department-checkbox:hover {
          background: #f0f0ff;
        }

        .message {
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 6px;
          padding: 10px;
          margin-top: 10px;
          font-weight: 500;
        }

        .message.success {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #a5d6a7;
        }

        .message.error {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ef9a9a;
        }

        .btn-primary {
          background: linear-gradient(90deg,#6a1b9a,#1e88e5);
          border: none;
          color: #fff;
          font-weight: 600;
          padding: 10px 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: linear-gradient(90deg,#5e35b1,#1976d2);
        }

        .batch-list {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 6px 18px rgba(70,60,90,0.05);
        }

        .batch-card {
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 14px 18px;
          margin-bottom: 16px;
          transition: all 0.2s ease;
        }

        .batch-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(70,60,90,0.08);
        }

        .batch-card h4 {
          color: #4a148c;
          font-weight: 600;
        }

        .section-title {
          font-weight: 600;
          color: #6a1b9a;
          margin-bottom: 1rem;
        }

        .skeleton {
          background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite linear;
          border-radius: 8px;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
          }
        }
        `}
      </style>

      <div className="batch-page">
        <Sidebar onToggle={setSidebarOpen} />

        <div
          className="main-content"
          style={{
            marginLeft: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed)",
          }}
        >
          {loading ? (
            <>
              {/* skeleton for page title & subtitle */}
              <div className="skeleton" style={{ height: 36, width: 280, marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 20, width: 220, marginBottom: 20 }} />

              {/* skeleton for form */}
              <div className="skeleton" style={{ height: 260, borderRadius: 12, marginBottom: 20 }} />

              {/* skeleton for batch list */}
              <div className="skeleton" style={{ height: 36, width: 240, marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 140, borderRadius: 10 }} />
            </>
          ) : (
            <>
              <div className="page-header">
                <h1 className="page-title">
                  <Layers size={28} /> Register Batches
                </h1>
                <p className="page-subtitle">Create and manage academic batches</p>
              </div>

              {/* Batch Form */}
              <form className="batch-form" onSubmit={handleBatchSubmit}>
                <h3 className="section-title">Batch Information</h3>

                <div className="form-group">
                  <label>Start Year:</label>
                  <select
                    value={batchFormData.startYear}
                    onChange={(e) =>
                      setBatchFormData({ ...batchFormData, startYear: e.target.value })
                    }
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Course (choose to filter departments):</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <option value="">-- Select Course --</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.courseName}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Departments:</label>
                  {selectedCourse === '' ? (
                    <p>Please select a course to choose departments.</p>
                  ) : (
                    (allDepartments.filter(d => String(d.course) === String(selectedCourse))).length === 0 ? (
                      <p>No departments available for this course.</p>
                    ) : (
                      allDepartments.filter(d => String(d.course) === String(selectedCourse)).map((dept) => {
                        const isSelected = selectedDepartments.find(
                          (d) => d.departmentId === dept._id
                        );
                        return (
                          <div key={dept._id} className="department-checkbox">
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <input
                                type="checkbox"
                                checked={!!isSelected}
                                onChange={() => handleDepartmentCheckbox(dept._id)}
                              />
                              <div>
                                <div style={{ fontWeight: 600 }}>{dept.departmentName}</div>
                                <div style={{ fontSize: 13, color: "#666" }}>{dept.description || ""}</div>
                              </div>
                            </div>

                            {isSelected && (
                              <input
                                type="number"
                                min="1"
                                value={isSelected.numberOfSections}
                                onChange={(e) =>
                                  handleSectionChange(dept._id, parseInt(e.target.value || "1", 10))
                                }
                                style={{ width: "70px", textAlign: "center" }}
                              />
                            )}
                          </div>
                        );
                      })
                    )
                  )}
                </div>

                {batchMessage.text && (
                  <div className={`message ${batchMessage.type}`}>
                    {batchMessage.type === "success" ? <CheckCircle /> : <AlertCircle />}
                    <span>{batchMessage.text}</span>
                  </div>
                )}

                <button type="submit" className="btn btn-primary mt-3">
                  Create Batch
                </button>
              </form>

              {/* Batch List */}
              <div className="batch-list">
                <h3 className="section-title">Existing Batches</h3>
                {batches.length === 0 ? (
                  <p>No batches created yet.</p>
                ) : (
                  batches.map((batch) => (
                    <div key={batch._id} className="batch-card">
                      <h4>{batch.batchName}</h4>
                      {batch.departments?.map((d) => (
  <p key={d.departmentId} style={{ margin: "6px 0" }}>
    <strong>{d.departmentName}</strong> — {d.numberOfSections} Sections
  </p>
))}

                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminRegisterBatchPage;
