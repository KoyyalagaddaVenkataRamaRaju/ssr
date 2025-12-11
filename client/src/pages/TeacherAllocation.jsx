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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [allocations, setAllocations] = useState([]);
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

  useEffect(() => {
    fetchAllocations();
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // axios api instance (kept as in earlier pattern, not used directly here but retained)
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
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  const fetchAllocations = async () => {
    try {
      const data = await teacherAllocationService.getAll();
      if (data.success) {
        setAllocations(data.data);
      }
    } catch (err) {
      console.error("Error fetching allocations:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetchDepartment();
      const data = response.data;
      if (response.success) {
        setDepartments(data);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async (departmentId) => {
    try {
      const response = await fetchTeachersByDepartment(departmentId);
      // some services return different shapes; follow existing usage
      if (response.success) {
        // prefer response.users when present, fallback to response.data or response.data.users
        setTeachers(response.users || response.data || []);
      } else {
        setError(response.message || "Failed to fetch teachers.");
      }
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
      setError("Failed to fetch teachers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectsByDepartment = async (departmentId, year) => {
    try {
      const data = await subjectService.getByDepartmentAndYear(departmentId, year);
      if (data.success) setSubjects(data.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  const fetchBatches = async (departmentId) => {
    try {
      const response = await fetchBatchesByDepartment(departmentId);
      if (response.success) {
        // some responses put batches under response.data or response.data.batches
        setBatches(response.data || response.data?.batches || []);
      } else {
        setError(response.message || "Failed to fetch batches.");
      }
    } catch (err) {
      console.error("Failed to fetch batches:", err);
      setError("Failed to fetch batches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async (departmentId) => {
    try {
      const response = await fetchSectionsByDepartment(departmentId);
      if (!response) {
        setSections([]);
        return;
      }
      if (response.success && response.data) setSections(response.data);
      else if (Array.isArray(response)) setSections(response);
      else setSections([]);
    } catch (err) {
      console.error("Failed to fetch sections:", err);
      setSections([]);
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setFormData({ ...formData, department: departmentId, batch: "", section: "A" });
    if (departmentId) {
      fetchTeachers(departmentId);
      fetchBatches(departmentId);
      fetchSections(departmentId);
      if (formData.year) fetchSubjectsByDepartment(departmentId, formData.year);
    } else {
      setTeachers([]);
      setBatches([]);
      setSections([]);
      setSubjects([]);
    }
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setFormData({ ...formData, year: parseInt(year) });
    if (formData.department && year) fetchSubjectsByDepartment(formData.department, year);
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
        // clear dependent lists
        setTeachers([]);
        setSubjects([]);
        setBatches([]);
        setSections([]);
      } else {
        alert("Failed to allocate teacher: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error creating allocation:", err);
      alert("Failed to allocate teacher: " + (err.message || "Unknown error"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this allocation?")) return;
    try {
      const data = await teacherAllocationService.delete(id);
      if (data.success) {
        alert("Allocation removed successfully");
        fetchAllocations();
      } else {
        alert("Failed to remove allocation: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error deleting allocation:", err);
      alert("Failed to remove allocation: " + (err.message || "Unknown error"));
    }
  };

  return (
    <>
      <style>{`
        :root{
          --card-bg: #ffffff;
          --muted: #6b7280;
          --primary: #6a4ed9;
        }

        .ta-page {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(180deg,#f3f4f6,#eef2ff);
        }

        .ta-main {
          flex: 1;
          padding: 24px 32px;
          transition: margin-left .32s ease;
        }

        .ta-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 18px;
          box-shadow: 0 10px 30px rgba(2,6,23,0.06);
          margin-bottom: 20px;
        }

        .ta-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .ta-form-header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:12px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 4px;
        }

        .ta-sub {
          color: var(--muted);
          font-size: 14px;
        }

        .ta-input {
          width:100%;
          padding:10px;
          border:1px solid #e5e7eb;
          border-radius:8px;
          font-size:14px;
        }

        .ta-select {
          width:100%;
          padding:10px;
          border:1px solid #e5e7eb;
          border-radius:8px;
          font-size:14px;
          background:white;
        }

        .ta-btn {
          padding:10px 16px;
          background: var(--primary);
          color:white;
          border:none;
          border-radius:8px;
          cursor:pointer;
          font-weight:600;
        }

        .ta-table {
          width:100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }

        .ta-table th {
          background: #f8fafc;
          text-align: left;
          padding: 10px;
          font-weight: 700;
          font-size: 13px;
          color: #0f172a;
          border-bottom:1px solid #eef2f6;
        }

        .ta-table td {
          padding: 10px;
          border-bottom: 1px solid #f1f5f9;
        }

        .ta-actions button {
          padding:6px 10px;
          border-radius:6px;
          border:none;
          cursor:pointer;
          font-size:13px;
        }

        .ta-remove {
          background:#dc3545;
          color:white;
        }

        @media (max-width: 880px) {
          .ta-grid-2 { grid-template-columns: 1fr; }
        }

        @media (max-width: 520px) {
          .ta-main { padding: 12px; }
          .ta-title { font-size:18px;}
        }
      `}</style>

      <div className="ta-page">
        <Sidebar onToggle={setSidebarOpen} />

        <main className="ta-main" style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}>
          <div className="ta-card">
            <div className="ta-form-header" style={{ marginBottom: 12 }}>
              <div>
                <div className="page-title">Teacher Subject Allocation</div>
                <div className="ta-sub">Allocate teachers to subjects for batches and sections</div>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <form onSubmit={handleSubmit}>
                <div className="ta-grid-2">
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 700 }}>Department</label>
                    <select
                      value={formData.department}
                      onChange={handleDepartmentChange}
                      required
                      className="ta-select"
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
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 700 }}>Year</label>
                    <select
                      value={formData.year}
                      onChange={handleYearChange}
                      required
                      className="ta-select"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 700 }}>Teacher</label>
                    <select
                      value={formData.teacher}
                      onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                      required
                      className="ta-select"
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
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 700 }}>Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="ta-select"
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
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 700 }}>Batch</label>
                    <select
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                      required
                      className="ta-select"
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
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 700 }}>Section</label>
                    <select
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      required
                      className="ta-select"
                    >
                      {sections && sections.length > 0 ? (
                        <>
                          <option value="">Select Section</option>
                          {sections.map((sec) => (
                            <option key={sec._id || sec.sectionName} value={sec.sectionName || sec._id}>
                              {sec.sectionName || sec.section}
                            </option>
                          ))}
                        </>
                      ) : (
                        <>
                          <option value="A">Create sections before selecting</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div style={{ alignSelf: "end" }}>
                    <button type="submit" className="ta-btn" style={{ minWidth: 160 }}>
                      Allocate Teacher
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="ta-card">
            <h3 style={{ marginTop: 0, marginBottom: 12 }}>Current Allocations</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="ta-table">
                <thead>
                  <tr>
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
                      <td colSpan="8" style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>
                        No allocations found
                      </td>
                    </tr>
                  ) : (
                    allocations.map((allocation) => (
                      <tr key={allocation._id}>
                        <td>{allocation.teacher?.name}</td>
                        <td>{allocation.subject?.subjectName}</td>
                        <td>{allocation.department?.departmentName}</td>
                        <td>{allocation.year}</td>
                        <td>{allocation.batch?.batchName}</td>
                        <td>{allocation.section}</td>
                        <td>{allocation.academicYear}</td>
                        <td className="ta-actions">
                          <button
                            onClick={() => handleDelete(allocation._id)}
                            className="ta-remove"
                            title="Remove allocation"
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
          </div>
        </main>
      </div>
    </>
  );
};

export default TeacherAllocation;
