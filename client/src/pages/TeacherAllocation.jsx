// src/pages/TeacherAllocation.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

import { teacherAllocationService } from "../services/teacherAllocationService.js";
import { subjectService } from "../services/subjectService.js";
import axios from "axios";
import {
  fetchTeachersByDepartment,
  fetchBatchesByDepartment,
  fetchSectionsByDepartment,
} from "../services/teacherAllocationService.jsx";
import { fetchDepartment } from "../services/attendanceService.jsx";

const TeacherAllocation = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [allocations, setAllocations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [formData, setFormData] = useState({
    teacher: "",
    subject: "",
    department: "",
    batch: "",
    section: "A",
    year: 1,
    academicYear: "2025-2026",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    fetchAllocations();
    fetchDepartments();
    setLoading(false);
  }, []);

  const fetchAllocations = async () => {
    try {
      const data = await teacherAllocationService.getAll();
      if (data.success) {
        setAllocations(data.data);
      }
    } catch (error) {
      console.error("Error fetching allocations:", error);
      setError("Failed to load allocations.");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetchDepartment();
      const data = response.data;
      if (response.success) {
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Failed to load departments.");
    }
  };

  const fetchTeachers = async (departmentId) => {
    try {
      setLoading(true);
      const response = await fetchTeachersByDepartment(departmentId);
      if (response.success) {
        setTeachers(response.users || response.data || []);
      } else {
        setError(response.message || "Failed to fetch teachers.");
      }
    } catch (err) {
      setError("Failed to fetch teachers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectsByDepartment = async (departmentId, year) => {
    try {
      const data = await subjectService.getByDepartmentAndYear(
        departmentId,
        year
      );
      if (data.success) {
        setSubjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setError("Failed to load subjects.");
    }
  };

  const fetchBatches = async (departmentId) => {
    try {
      setLoading(true);
      const response = await fetchBatchesByDepartment(departmentId);
      if (response.success) {
        setBatches(response.data);
      } else {
        setError(response.message || "Failed to fetch batches.");
      }
    } catch (err) {
      setError("Failed to fetch batches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async (departmentId) => {
    try {
      const response = await fetchSectionsByDepartment(departmentId);
      if (response && response.success) {
        setSections(response.data);
      } else if (Array.isArray(response)) {
        setSections(response);
      } else {
        setSections([]);
      }
    } catch (err) {
      console.error("Failed to fetch sections:", err);
      setSections([]);
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    const updated = { ...formData, department: departmentId, teacher: "", batch: "", section: "A", subject: "" };
    setFormData(updated);

    if (departmentId) {
      fetchTeachers(departmentId);
      fetchBatches(departmentId);
      fetchSections(departmentId);
      if (updated.year) {
        fetchSubjectsByDepartment(departmentId, updated.year);
      }
    } else {
      setTeachers([]);
      setBatches([]);
      setSections([]);
      setSubjects([]);
    }
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value, 10);
    const updated = { ...formData, year };
    setFormData(updated);

    if (updated.department && year) {
      fetchSubjectsByDepartment(updated.department, year);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await teacherAllocationService.create(formData);
      if (data.success) {
        alert("Teacher allocated successfully!");
        fetchAllocations();
        setFormData({
          teacher: "",
          subject: "",
          department: "",
          batch: "",
          section: "A",
          year: 1,
          academicYear: "2025-2026",
        });
        setTeachers([]);
        setBatches([]);
        setSections([]);
        setSubjects([]);
      } else {
        alert(data.message || "Failed to allocate teacher.");
      }
    } catch (error) {
      console.error("Error creating allocation:", error);
      alert("Failed to allocate teacher: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this allocation?"
      )
    )
      return;

    try {
      const data = await teacherAllocationService.delete(id);
      if (data.success) {
        alert("Allocation removed successfully");
        fetchAllocations();
      }
    } catch (error) {
      console.error("Error deleting allocation:", error);
      alert("Failed to remove allocation: " + error.message);
    }
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
          gap: 16px;
        }

        .form-label-strong {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          font-size: 14px;
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
              <h2 className="page-title">Teacher Subject Allocation</h2>
              <p className="small-muted mb-0">
                Allocate teachers to subjects, batches and sections for each academic year.
              </p>
            </div>
            <div className="header-actions">
              {loading && (
                <span className="small-muted">Loading data…</span>
              )}
            </div>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}

          {/* ALLOCATION FORM */}
          <section className="card-surface">
            <h5 className="mb-3">Allocate Teacher to Subject</h5>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div>
                  <label className="form-label-strong">Department</label>
                  <select
                    value={formData.department}
                    onChange={handleDepartmentChange}
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
                  <label className="form-label-strong">Year</label>
                  <select
                    value={formData.year}
                    onChange={handleYearChange}
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
                  <label className="form-label-strong">Teacher</label>
                  <select
                    value={formData.teacher}
                    onChange={(e) =>
                      setFormData({ ...formData, teacher: e.target.value })
                    }
                    required
                    className="form-control"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label-strong">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                    className="form-control"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.subjectName} ({subject.subjectCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label-strong">Batch</label>
                  <select
                    value={formData.batch}
                    onChange={(e) =>
                      setFormData({ ...formData, batch: e.target.value })
                    }
                    required
                    className="form-control"
                  >
                    <option value="">Select Batch</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.batchName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label-strong">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) =>
                      setFormData({ ...formData, section: e.target.value })
                    }
                    required
                    className="form-control"
                  >
                    {sections && sections.length > 0 ? (
                      <>
                        <option value="">Select Section</option>
                        {sections.map((sec) => (
                          <option
                            key={sec._id || sec.sectionName}
                            value={sec.sectionName || sec._id}
                          >
                            {sec.sectionName || sec.section}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option value="">
                        Create sections before selecting
                      </option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="form-label-strong">Academic Year</label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        academicYear: e.target.value,
                      })
                    }
                    className="form-control"
                    placeholder="e.g., 2025-2026"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn mt-3"
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Allocate Teacher
              </button>
            </form>
          </section>

          {/* CURRENT ALLOCATIONS TABLE */}
          <section className="table-card">
            <h5 className="table-heading">Current Allocations</h5>
            <div style={{ overflowX: "auto" }}>
              <table className="table table-bordered table-striped mb-0">
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <th>Teacher</th>
                    <th>Subject</th>
                    <th>Department</th>
                    <th>Year</th>
                    <th>Batch</th>
                    <th>Section</th>
                    <th>Academic Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-3 text-muted"
                      >
                        No allocations found
                      </td>
                    </tr>
                  ) : (
                    allocations.map((allocation) => (
                      <tr key={allocation._id}>
                        <td>{allocation.teacher?.name}</td>
                        <td>{allocation.subject?.subjectName}</td>
                        <td>
                          {allocation.department?.departmentName}
                        </td>
                        <td>{allocation.year}</td>
                        <td>{allocation.batch?.batchName}</td>
                        <td>{allocation.section}</td>
                        <td>{allocation.academicYear}</td>
                        <td>
                          <button
                            onClick={() => handleDelete(allocation._id)}
                            className="btn btn-sm"
                            style={{
                              padding: "5px 10px",
                              backgroundColor: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Remove
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

export default TeacherAllocation;
