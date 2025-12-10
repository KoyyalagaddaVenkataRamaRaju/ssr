// src/pages/SubjectManagement.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import { subjectService } from "../services/subjectService.js";
import { fetchDepartment } from "../services/attendanceService.jsx";

const SubjectManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterSemester, setFilterSemester] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    department: "",
    year: 1,
    semester: 1,
    credits: 3,
    subjectType: "Theory",
    description: "",
  });

  const subjectTypes = ["Theory", "Practical", "Lab", "Project", "Elective"];

  useEffect(() => {
    fetchDepartments();
    fetchSubjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [subjects, filterDepartment, filterYear, filterSemester]);

  const fetchDepartments = async () => {
    try {
      const response = await fetchDepartment();
      const data = response.data;
      if (response.success) {
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await subjectService.getAll();
      if (data.success) {
        setSubjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...subjects];

    if (filterDepartment) {
      filtered = filtered.filter((s) => s.department?._id === filterDepartment);
    }
    if (filterYear) {
      filtered = filtered.filter((s) => s.year === parseInt(filterYear));
    }
    if (filterSemester) {
      filtered = filtered.filter((s) => s.semester === parseInt(filterSemester));
    }

    setFilteredSubjects(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        const data = await subjectService.update(editingSubject._id, formData);
        if (data.success) {
          alert("Subject updated successfully!");
        }
      } else {
        const data = await subjectService.create(formData);
        if (data.success) {
          alert("Subject created successfully!");
        }
      }
      resetForm();
      fetchSubjects();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      department: subject.department._id,
      year: subject.year,
      semester: subject.semester,
      credits: subject.credits,
      subjectType: subject.subjectType || "Theory",
      description: subject.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      const data = await subjectService.delete(id);
      if (data.success) {
        alert("Subject deleted successfully");
        fetchSubjects();
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      subjectName: "",
      subjectCode: "",
      department: "",
      year: 1,
      semester: 1,
      credits: 3,
      subjectType: "Theory",
      description: "",
    });
    setEditingSubject(null);
    setShowForm(false);
  };

  return (
    <>
      {/* PAGE STYLES (similar vibe to AdminHeroCarousel) */}
      <style>{`
        :root {
          --primary: #6a4ed9;
          --accent: #ff8c42;
          --muted: #6b6b6b;
          --card-bg: #ffffff;
        }

        .admin-page {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg,#f3e5f5,#e0f7fa);
        }

        .main-content {
          flex: 1;
          padding: 28px 36px;
          transition: margin-left .32s ease;
        }

        .page-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 4px;
        }

        .small-muted {
          color: var(--muted);
          font-size: 14px;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .btn-main {
          padding: 10px 18px;
          background: var(--primary);
          color: #fff;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-main.danger {
          background: #dc3545;
        }

        .card-surface {
          background: var(--card-bg);
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(15,23,42,0.08);
          margin-bottom: 22px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 18px;
        }

        .form-label-strong {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          font-size: 14px;
        }

        .filter-grid {
          display: grid;
          grid-template-columns: repeat(3,minmax(0,1fr));
          gap: 16px;
        }

        .table-card {
          background: var(--card-bg);
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(15,23,42,0.06);
        }

        .table-heading {
          margin-bottom: 10px;
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .status-pill {
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 12px;
          color: #fff;
        }

        @media (max-width: 992px) {
          .main-content { padding: 22px 12px; }
          .form-grid { grid-template-columns: 1fr; }
          .filter-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
        }
        @media (max-width: 768px) {
          .main-content { padding: 16px 8px; }
          .filter-grid { grid-template-columns: 1fr; }
          .page-title { font-size: 22px; text-align:center; }
          .small-muted { text-align:center; }
          .header-actions { justify-content:center; }
        }
        @media (max-width: 480px) {
          .main-content { padding: 10px 4px; }
          .page-title { font-size: 18px; }
          .card-surface, .table-card { padding: 14px; }
        }
      `}</style>

      <div className="admin-page">
        <Sidebar onToggle={setSidebarOpen} />

        <main
          className="main-content"
          style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}
        >
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <div>
              <h2 className="page-title">Subject Management</h2>
              <div className="small-muted">
                Create, update and manage all subjects across departments
              </div>
            </div>

            <div className="header-actions">
              <button
                onClick={() => setShowForm(!showForm)}
                className={`btn-main ${showForm ? "danger" : ""}`}
              >
                {showForm ? "Cancel" : "+ Create Subject"}
              </button>
            </div>
          </div>

          {/* CREATE / EDIT FORM */}
          {showForm && (
            <section className="card-surface">
              <h4 className="mb-3">
                {editingSubject ? "Edit Subject" : "Create New Subject"}
              </h4>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div>
                    <label className="form-label-strong">
                      Subject Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subjectName}
                      onChange={(e) =>
                        setFormData({ ...formData, subjectName: e.target.value })
                      }
                      required
                      placeholder="e.g., Data Structures"
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Subject Code <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subjectCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subjectCode: e.target.value.toUpperCase(),
                        })
                      }
                      required
                      placeholder="e.g., CS201"
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Department/Branch <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      required
                      className="form-control"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.departmentName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Year <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: parseInt(e.target.value),
                        })
                      }
                      required
                      className="form-control"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Semester <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          semester: parseInt(e.target.value),
                        })
                      }
                      required
                      className="form-control"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Subject Type <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      value={formData.subjectType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subjectType: e.target.value,
                        })
                      }
                      required
                      className="form-control"
                    >
                      {subjectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label-strong">Credits</label>
                    <input
                      type="number"
                      value={formData.credits}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          credits: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      max="6"
                      className="form-control"
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="form-label-strong">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Brief description of the subject (optional)"
                      rows="3"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2 flex-wrap">
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      padding: "10px 24px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "600",
                    }}
                  >
                    {editingSubject ? "Update Subject" : "Create Subject"}
                  </button>
                  {editingSubject && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn"
                      style={{
                        padding: "10px 24px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "500",
                      }}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </section>
          )}

          {/* FILTERS */}
          <section className="card-surface">
            <h5 className="mb-3">Filter Subjects</h5>
            <div className="filter-grid">
              <div>
                <label className="form-label-strong">Filter by Department</label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="form-control"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label-strong">Filter by Year</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="form-control"
                >
                  <option value="">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div>
                <label className="form-label-strong">Filter by Semester</label>
                <select
                  value={filterSemester}
                  onChange={(e) => setFilterSemester(e.target.value)}
                  className="form-control"
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* TABLE */}
          <section className="table-card">
            <h5 className="table-heading">
              All Subjects ({filteredSubjects.length})
            </h5>
            <div style={{ overflowX: "auto" }}>
              <table className="table table-bordered table-striped mb-0">
                <thead>
                  <tr style={{ backgroundColor: "#007bff", color: "white" }}>
                    <th>Code</th>
                    <th>Subject Name</th>
                    <th>Department</th>
                    <th className="text-center">Year</th>
                    <th className="text-center">Semester</th>
                    <th className="text-center">Type</th>
                    <th className="text-center">Credits</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-3 text-muted">
                        No subjects found
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map((subject, index) => (
                      <tr key={subject._id}>
                        <td>
                          <strong>{subject.subjectCode}</strong>
                        </td>
                        <td>{subject.subjectName}</td>
                        <td>
                          {subject.department?.departmentName || "N/A"}
                        </td>
                        <td className="text-center">{subject.year}</td>
                        <td className="text-center">{subject.semester}</td>
                        <td className="text-center">
                          <span
                            className="status-pill"
                            style={{
                              backgroundColor:
                                subject.subjectType === "Practical" ||
                                subject.subjectType === "Lab"
                                  ? "#ffc107"
                                  : "#17a2b8",
                            }}
                          >
                            {subject.subjectType || "Theory"}
                          </span>
                        </td>
                        <td className="text-center">{subject.credits}</td>
                        <td className="text-center">
                          <button
                            onClick={() => handleEdit(subject)}
                            className="btn btn-sm me-2"
                            style={{
                              backgroundColor: "#28a745",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(subject._id)}
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default SubjectManagement;
