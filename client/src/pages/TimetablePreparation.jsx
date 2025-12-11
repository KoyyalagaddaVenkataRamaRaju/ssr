// src/pages/TimetablePreparation.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  fetchBatchesByDepartment,
  fetchTeacherandSubjectAllocations,
  createTimetable,
  fetchTimetablebyBatchandSection,
} from "../services/timetableService.jsx";
import { fetchDepartment } from "../services/attendanceService.jsx";

const TimetablePreparation = () => {
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSection, setSelectedSection] = useState("A");

  const [formData, setFormData] = useState({
    dayOfWeek: "Monday",
    periodNumber: 1,
    startTime: "09:00",
    endTime: "10:00",
    teacherAllocation: "",
    roomNumber: "",
    academicYear: "2025-2026",
  });

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periods = [
    { number: 1, start: "09:00", end: "10:00" },
    { number: 2, start: "10:00", end: "11:00" },
    { number: 3, start: "11:00", end: "12:00" },
    { number: 4, start: "12:00", end: "13:00" },
    { number: 5, start: "14:00", end: "15:00" },
    { number: 6, start: "15:00", end: "16:00" },
    { number: 7, start: "16:00", end: "17:00" },
    { number: 8, start: "17:00", end: "18:00" },
  ];

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedBatch && selectedSection) {
      fetchTimetable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBatch, selectedSection]);

  const fetchDepartments = async () => {
    try {
      const response = await fetchDepartment();
      const data = response.data;
      if (response.success) {
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Failed to fetch departments");
    }
  };

  const fetchBatches = async (departmentId) => {
    console.log("Fetching batches for department:", departmentId);
    try {
      const response = await fetchBatchesByDepartment(departmentId);
      console.log(response.data.batches);
      if (response.success) {
        setBatches(response.data.batches);
      } else {
        setError(response.message || "Failed to fetch batches.");
      }
    } catch (err) {
      setError("Failed to fetch batches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllocations = async (departmentId, batchId, section) => {
    try {
      const response = await fetchTeacherandSubjectAllocations(
        departmentId,
        batchId,
        section
      );
      console.log(response.data);
      if (response.success) {
        setAllocations(response.data);
        // reset teacher/subject selection when allocations change
        setSelectedTeacher("");
        setSelectedSubject("");
        setFormData((prev) => ({ ...prev, teacherAllocation: "" }));
      } else {
        setError(response.message || "Failed to fetch batches.");
      }
    } catch (err) {
      setError("Failed to fetch batches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetable = async () => {
    try {
      const data = await fetchTimetablebyBatchandSection(
        selectedBatch,
        selectedSection
      );

      if (data.success) {
        setTimetables(data.data);
      }
    } catch (error) {
      console.error("Error fetching timetable:", error);
      setError(error.message || "Failed to fetch timetable");
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    setSelectedBatch("");
    setAllocations([]);
    if (departmentId) {
      fetchBatches(departmentId);
    }
  };

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    console.log(batchId);
    setSelectedBatch(batchId);
    if (batchId && selectedDepartment && selectedSection) {
      fetchAllocations(selectedDepartment, batchId, selectedSection);
    }
  };

  const handleSectionChange = (e) => {
    const section = e.target.value;
    setSelectedSection(section);
    if (selectedBatch && selectedDepartment && section) {
      fetchAllocations(selectedDepartment, selectedBatch, section);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedAllocation = allocations.find(
      (a) => a._id === formData.teacherAllocation
    );
    if (!selectedAllocation) {
      alert("Please select a teacher allocation");
      return;
    }

    const timetableData = {
      department: selectedDepartment,
      batch: selectedBatch,
      section: selectedSection,
      year: selectedAllocation.year,
      dayOfWeek: formData.dayOfWeek,
      periodNumber: formData.periodNumber,
      startTime: formData.startTime,
      endTime: formData.endTime,
      subject: selectedAllocation.subject._id,
      teacher: selectedAllocation.teacher._id,
      teacherAllocation: formData.teacherAllocation,
      roomNumber: formData.roomNumber,
      academicYear: formData.academicYear,
    };

    try {
      const response = await createTimetable(timetableData);
      console.log(response.data);
      const data = response.data;
      if (data.success) {
        alert("Timetable entry added successfully!");
        fetchTimetable();
        setFormData({
          dayOfWeek: "Monday",
          periodNumber: 1,
          startTime: "09:00",
          endTime: "10:00",
          teacherAllocation: "",
          roomNumber: "",
          academicYear: "2025-2026",
        });
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error creating timetable entry:", error);
      alert("Failed to create timetable entry");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this timetable entry?"
      )
    )
      return;

    try {
      const response = await fetch(`http://localhost:3000/api/timetable/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        alert("Timetable entry removed successfully");
        fetchTimetable();
      }
    } catch (error) {
      console.error("Error deleting timetable entry:", error);
      alert("Failed to remove timetable entry");
    }
  };

  const getTimetableCell = (day, periodNum) => {
    const dayTimetable = timetables[day] || [];
    return dayTimetable.find((t) => t.periodNumber === periodNum);
  };

  return (
    <>
      <style>{`
        :root {
          --primary: #6a4ed9;
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
          padding: 24px 32px;
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
        }

        .card-surface {
          background: var(--card-bg);
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(15,23,42,0.08);
          margin-bottom: 22px;
        }

        .table-card {
          background: var(--card-bg);
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(15,23,42,0.08);
        }

        .period-cell {
          background-color: #f1f5f9;
          font-weight: 600;
        }

        @media (max-width: 992px) {
          .main-content { padding: 20px 14px; }
        }
        @media (max-width: 768px) {
          .main-content { padding: 16px 10px; }
          .page-title { font-size: 22px; text-align: center; }
        }
        @media (max-width: 480px) {
          .main-content { padding: 10px 6px; }
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
              <h2 className="page-title">Timetable Preparation</h2>
              <p className="small-muted mb-0">
                Prepare weekly timetables for each department, batch, and section.
              </p>
            </div>
            {loading && (
              <span className="small-muted">Loading...</span>
            )}
          </div>

          {error && (
            <div className="alert alert-danger py-2">{error}</div>
          )}

          {/* Select Class */}
          <section className="card-surface">
            <h5 className="mb-3">Select Class</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
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

              <div className="col-md-4">
                <label className="form-label fw-semibold">Batch</label>
                <select
                  value={selectedBatch}
                  onChange={handleBatchChange}
                  className="form-control"
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch._id} value={batch.batchId}>
                      {batch.batchName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Section</label>
                <select
                  value={selectedSection}
                  onChange={handleSectionChange}
                  className="form-control"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>
            </div>
          </section>

          {/* Add Timetable Entry */}
          {selectedBatch && (
            <section className="card-surface">
              <h5 className="mb-3">Add Timetable Entry</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Day of Week</label>
                    <select
                      value={formData.dayOfWeek}
                      onChange={(e) =>
                        setFormData({ ...formData, dayOfWeek: e.target.value })
                      }
                      required
                      className="form-control"
                    >
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Period</label>
                    <select
                      value={formData.periodNumber}
                      onChange={(e) => {
                        const period = periods.find(
                          (p) => p.number === parseInt(e.target.value)
                        );
                        setFormData({
                          ...formData,
                          periodNumber: period.number,
                          startTime: period.start,
                          endTime: period.end,
                        });
                      }}
                      required
                      className="form-control"
                    >
                      {periods.map((period) => (
                        <option key={period.number} value={period.number}>
                          Period {period.number} ({period.start} - {period.end})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Teacher</label>
                    <select
                      value={selectedTeacher}
                      onChange={(e) => {
                        const teacherId = e.target.value;
                        setSelectedTeacher(teacherId);
                        setSelectedSubject("");
                        setFormData({ ...formData, teacherAllocation: "" });
                      }}
                      required
                      className="form-control"
                    >
                      <option value="">Select Teacher</option>
                      {Array.from(
                        new Map(
                          allocations.map((a) => [a.teacher?._id, a.teacher])
                        ).values()
                      )
                        .filter(Boolean)
                        .map((teacher) => (
                          <option key={teacher._id} value={teacher._id}>
                            {teacher.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Subject</label>
                    <select
                      value={formData.teacherAllocation}
                      onChange={(e) => {
                        const allocationId = e.target.value;
                        setSelectedSubject(allocationId);
                        const alloc = allocations.find(
                          (a) => a._id === allocationId
                        );
                        if (alloc && alloc.teacher)
                          setSelectedTeacher(alloc.teacher._id);
                        setFormData({
                          ...formData,
                          teacherAllocation: allocationId,
                        });
                      }}
                      required
                      className="form-control"
                    >
                      <option value="">Select Subject</option>
                      {allocations
                        .filter((a) =>
                          selectedTeacher
                            ? a.teacher && a.teacher._id === selectedTeacher
                            : true
                        )
                        .map((allocation) => (
                          <option key={allocation._id} value={allocation._id}>
                            {allocation.subject?.subjectName}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Room Number</label>
                    <input
                      type="text"
                      value={formData.roomNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, roomNumber: e.target.value })
                      }
                      placeholder="e.g., Room 101"
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Academic Year</label>
                    <input
                      type="text"
                      value={formData.academicYear}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          academicYear: e.target.value,
                        })
                      }
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                >
                  Add to Timetable
                </button>
              </form>
            </section>
          )}

          {/* Weekly Timetable */}
          {selectedBatch && (
            <section className="table-card">
              <h5 className="mb-3">Weekly Timetable</h5>
              <div className="table-responsive">
                <table
                  className="table table-bordered align-middle"
                  style={{ minWidth: "900px" }}
                >
                  <thead className="table-primary text-center">
                    <tr>
                      <th style={{ minWidth: "120px" }}>Period / Day</th>
                      {days.map((day) => (
                        <th key={day}>{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periods.map((period) => (
                      <tr key={period.number}>
                        <td className="text-center period-cell">
                          P{period.number}
                          <br />
                          <small>
                            {period.start} - {period.end}
                          </small>
                        </td>
                        {days.map((day) => {
                          const entry = getTimetableCell(day, period.number);
                          return (
                            <td
                              key={day}
                              style={{
                                backgroundColor: entry ? "#e8f4f8" : "white",
                                verticalAlign: "top",
                              }}
                            >
                              {entry ? (
                                <div>
                                  <div className="fw-semibold mb-1">
                                    {entry.subject?.subjectName}
                                  </div>
                                  <div
                                    className="small text-muted"
                                    style={{ lineHeight: 1.3 }}
                                  >
                                    {entry.teacher?.name}
                                  </div>
                                  {entry.roomNumber && (
                                    <div className="small text-muted">
                                      {entry.roomNumber}
                                    </div>
                                  )}
                                  <button
                                    onClick={() => handleDelete(entry._id)}
                                    className="btn btn-sm btn-danger mt-2"
                                    style={{ fontSize: "11px" }}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ) : (
                                <div className="text-muted">-</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default TimetablePreparation;
