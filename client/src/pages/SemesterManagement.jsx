// src/pages/SemesterManagement.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import { semesterService } from "../services/semesterService.js";
import { fetchDepartment } from "../services/attendanceService.jsx";

const SemesterManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [filteredSemesters, setFilteredSemesters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);

  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterAcademicYear, setFilterAcademicYear] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [formData, setFormData] = useState({
    semesterName: "",
    semesterNumber: 1,
    academicYear: "",
    department: "",
    year: 1,
    startDate: "",
    endDate: "",
    isActive: true,
    isCurrent: false,
  });

  useEffect(() => {
    fetchDepartments();
    fetchSemesters();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [semesters, filterDepartment, filterAcademicYear]);

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

  const fetchSemesters = async () => {
    try {
      const data = await semesterService.getAll();
      if (data.success) {
        setSemesters(data.data);
      }
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...semesters];

    if (filterDepartment) {
      filtered = filtered.filter((s) => s.department?._id === filterDepartment);
    }
    if (filterAcademicYear) {
      filtered = filtered.filter((s) => s.academicYear === filterAcademicYear);
    }

    setFilteredSemesters(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSemester) {
        const data = await semesterService.update(editingSemester._id, formData);
        if (data.success) {
          alert("Semester updated successfully!");
        }
      } else {
        const data = await semesterService.create(formData);
        if (data.success) {
          alert("Semester created successfully!");
        }
      }
      resetForm();
      fetchSemesters();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleSetCurrent = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to set this as the current semester? This will change the active semester for all related operations."
      )
    )
      return;

    try {
      const data = await semesterService.setAsCurrent(id);
      if (data.success) {
        alert("Current semester updated successfully!");
        fetchSemesters();
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleEdit = (semester) => {
    setEditingSemester(semester);
    setFormData({
      semesterName: semester.semesterName,
      semesterNumber: semester.semesterNumber,
      academicYear: semester.academicYear,
      department: semester.department._id,
      year: semester.year,
      startDate: new Date(semester.startDate).toISOString().split("T")[0],
      endDate: new Date(semester.endDate).toISOString().split("T")[0],
      isActive: semester.isActive,
      isCurrent: semester.isCurrent,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this semester? This action cannot be undone."
      )
    )
      return;

    try {
      const data = await semesterService.delete(id);
      if (data.success) {
        alert("Semester deleted successfully");
        fetchSemesters();
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      semesterName: "",
      semesterNumber: 1,
      academicYear: "",
      department: "",
      year: 1,
      startDate: "",
      endDate: "",
      isActive: true,
      isCurrent: false,
    });
    setEditingSemester(null);
    setShowForm(false);
  };

  const getUniqueAcademicYears = () => {
    const years = [...new Set(semesters.map((s) => s.academicYear))];
    return years.sort().reverse();
  };

  return (
    <>
      {/* PAGE STYLES (aligned with other admin pages) */}
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
          padding: 10px 20px;
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
          grid-template-columns: repeat(2,minmax(0,1fr));
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

        @media (max-width: 992px) {
          .main-content { padding: 22px 12px; }
          .form-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .main-content { padding: 16px 8px; }
          .page-title { font-size: 22px; text-align:center; }
          .small-muted { text-align:center; }
          .header-actions { justify-content:center; }
          .filter-grid { grid-template-columns: 1fr; }
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
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <div>
              <h2 className="page-title">Semester Management</h2>
              <p className="small-muted mb-0">
                Manage semesters for all departments. The current semester affects timetables, attendance, and allocations.
              </p>
            </div>
            <div className="header-actions">
              <button
                onClick={() => setShowForm(!showForm)}
                className={`btn-main ${showForm ? "danger" : ""}`}
              >
                {showForm ? "Cancel" : "+ Create Semester"}
              </button>
            </div>
          </div>

          {/* CREATE / EDIT FORM */}
          {showForm && (
            <section className="card-surface">
              <h4 className="mb-3">
                {editingSemester ? "Edit Semester" : "Create New Semester"}
              </h4>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div>
                    <label className="form-label-strong">
                      Semester Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.semesterName}
                      onChange={(e) =>
                        setFormData({ ...formData, semesterName: e.target.value })
                      }
                      required
                      placeholder="e.g., Fall Semester 2025"
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
                      Semester Number <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      value={formData.semesterNumber}
                      onChange={(e) => {
                        const semNum = parseInt(e.target.value);
                        setFormData({
                          ...formData,
                          semesterNumber: semNum,
                          year: Math.ceil(semNum / 2),
                        });
                      }}
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
                      disabled
                      className="form-control"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                    <small style={{ color: "#666" }}>
                      Auto-calculated from semester number
                    </small>
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Academic Year <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.academicYear}
                      onChange={(e) =>
                        setFormData({ ...formData, academicYear: e.target.value })
                      }
                      required
                      placeholder="e.g., 2025-2026"
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Start Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      required
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label-strong">
                      End Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      required
                      className="form-control"
                    />
                  </div>

                  <div
                    style={{
                      gridColumn: "1 / -1",
                      display: "flex",
                      gap: "30px",
                      marginTop: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        style={{
                          marginRight: "8px",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                      <span style={{ fontWeight: "bold" }}>Active Semester</span>
                    </label>

                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.isCurrent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isCurrent: e.target.checked,
                          })
                        }
                        style={{
                          marginRight: "8px",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                      <span style={{ fontWeight: "bold" }}>
                        Set as Current Semester
                      </span>
                      <small style={{ marginLeft: "10px", color: "#666" }}>
                        (Will affect timetables and attendance)
                      </small>
                    </label>
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2 flex-wrap">
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      padding: "12px 30px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {editingSemester ? "Update Semester" : "Create Semester"}
                  </button>
                  {editingSemester && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn"
                      style={{
                        padding: "12px 30px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "16px",
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
            <h5 className="mb-3">Filter Semesters</h5>
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
                <label className="form-label-strong">
                  Filter by Academic Year
                </label>
                <select
                  value={filterAcademicYear}
                  onChange={(e) => setFilterAcademicYear(e.target.value)}
                  className="form-control"
                >
                  <option value="">All Academic Years</option>
                  {getUniqueAcademicYears().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* TABLE */}
          <section className="table-card">
            <h5 className="table-heading">
              All Semesters ({filteredSemesters.length})
            </h5>
            <div style={{ overflowX: "auto" }}>
              <table className="table table-bordered table-striped mb-0">
                <thead>
                  <tr style={{ backgroundColor: "#007bff", color: "white" }}>
                    <th>Semester Name</th>
                    <th>Department</th>
                    <th className="text-center">Sem #</th>
                    <th className="text-center">Year</th>
                    <th className="text-center">Academic Year</th>
                    <th className="text-center">Duration</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSemesters.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-3 text-muted"
                      >
                        No semesters found
                      </td>
                    </tr>
                  ) : (
                    filteredSemesters.map((semester, index) => (
                      <tr key={semester._id}>
                        <td>
                          <strong>{semester.semesterName}</strong>
                        </td>
                        <td>{semester.department?.departmentName || "N/A"}</td>
                        <td className="text-center">
                          {semester.semesterNumber}
                        </td>
                        <td className="text-center">{semester.year}</td>
                        <td className="text-center">{semester.academicYear}</td>
                        <td
                          className="text-center"
                          style={{ fontSize: "12px" }}
                        >
                          {new Date(
                            semester.startDate
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            semester.endDate
                          ).toLocaleDateString()}
                        </td>
                        <td className="text-center">
                          {semester.isCurrent && (
                            <span
                              style={{
                                display: "block",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                backgroundColor: "#28a745",
                                color: "white",
                                fontSize: "12px",
                                marginBottom: "5px",
                              }}
                            >
                              CURRENT
                            </span>
                          )}
                          {semester.isActive && !semester.isCurrent && (
                            <span
                              style={{
                                display: "block",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                backgroundColor: "#17a2b8",
                                color: "white",
                                fontSize: "12px",
                              }}
                            >
                              Active
                            </span>
                          )}
                          {!semester.isActive && (
                            <span
                              style={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                                backgroundColor: "#6c757d",
                                color: "white",
                                fontSize: "12px",
                              }}
                            >
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="text-center">
                          <div
                            style={{
                              display: "flex",
                              gap: "5px",
                              justifyContent: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            {!semester.isCurrent && (
                              <button
                                onClick={() => handleSetCurrent(semester._id)}
                                className="btn btn-sm"
                                style={{
                                  padding: "6px 12px",
                                  backgroundColor: "#007bff",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                }}
                                title="Set as current semester"
                              >
                                Set Current
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(semester)}
                              className="btn btn-sm"
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "12px",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(semester._id)}
                              className="btn btn-sm"
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "12px",
                              }}
                              disabled={semester.isCurrent}
                              title={
                                semester.isCurrent
                                  ? "Cannot delete current semester"
                                  : "Delete semester"
                              }
                            >
                              Delete
                            </button>
                          </div>
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

export default SemesterManagement;
