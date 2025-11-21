import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  fetchBatchesByDepartmentId,
  fetchSubjectsByDepartmentId,
  fetchAttendanceReport,
  fetchDepartment,
} from "../services/attendanceService";
import "bootstrap/dist/css/bootstrap.min.css";

const AttendanceReport = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [reportData, setReportData] = useState([]);

  const [filters, setFilters] = useState({
    department: "",
    batch: "",
    section: "A",
    subject: "",
    startDate: "",
    endDate: "",
  });

  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [loadingFull, setLoadingFull] = useState(true);

  useEffect(() => {
    setLoadingFull(true);
    const timer = setTimeout(() => setLoadingFull(false), 1000);
    return () => clearTimeout(timer);
  }, [filters.department]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoadingDropdowns(true);
      try {
        const res = await fetchDepartment();
        if (!alive) return;
        if (res && res.success) {
          setDepartments(res.data || []);
        } else if (Array.isArray(res)) {
          setDepartments(res);
        }
      } catch (err) {
        console.error("fetchDepartment error:", err);
      } finally {
        // IMMEDIATE: No skeleton for department dropdown
        setLoadingDropdowns(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  const handleDepartmentChange = async (departmentId) => {
    setFilters((p) => ({
      ...p,
      department: departmentId,
      batch: "",
      subject: "",
    }));
    setBatches([]);
    setSubjects([]);
    setReportData([]);
    if (!departmentId) return;
    setLoadingDropdowns(true);
    setLoadingFull(true);
    try {
      const [bResp, sResp] = await Promise.allSettled([
        fetchBatchesByDepartmentId(departmentId),
        fetchSubjectsByDepartmentId(departmentId),
      ]);
      if (bResp.status === "fulfilled") {
        const val = bResp.value;
        if (val?.success) setBatches(val.data || []);
        else if (Array.isArray(val)) setBatches(val);
      }
      if (sResp.status === "fulfilled") {
        const val = sResp.value;
        if (val?.success) setSubjects(val.data || []);
        else if (Array.isArray(val)) setSubjects(val);
      }
    } catch (err) {
      console.error("Error loading batches/subjects:", err);
    } finally {
      setTimeout(() => {
        setLoadingDropdowns(false);
        setLoadingFull(false);
      }, 1000);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value }));
  };

  const fetchReport = async () => {
    if (!filters.batch || !filters.section) {
      return alert("Please select batch and section");
    }
    setLoadingReport(true);
    setReportData([]);
    try {
      const res = await fetchAttendanceReport(filters);
      if (res && res.success) {
        setReportData(res.data || []);
      } else if (Array.isArray(res)) {
        setReportData(res);
      } else {
        setReportData([]);
        alert(res?.message || "No report data");
      }
    } catch (err) {
      console.error("fetchAttendanceReport error:", err);
      alert("Failed to fetch attendance report");
    } finally {
      setTimeout(() => setLoadingReport(false), 1000);
    }
  };

  const exportToCSV = () => {
    if (!reportData.length) {
      alert("No data to export");
      return;
    }
    const headers = [
      "Student Name",
      "Email",
      "Total Classes",
      "Present",
      "Absent",
      "Late",
      "Excused",
      "Attendance %",
    ];
    const rows = reportData.map((r) => [
      r.student?.name || "-",
      r.student?.email || "-",
      r.total ?? 0,
      r.present ?? 0,
      r.absent ?? 0,
      r.late ?? 0,
      r.excused ?? 0,
      r.attendancePercentage ?? 0,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAttendanceColor = (percentage) => {
    const p = Number(percentage);
    if (isNaN(p)) return "#6c757d";
    if (p >= 75) return "#28a745";
    if (p >= 60) return "#ffc107";
    return "#dc3545";
  };

  const printReport = () => {
    if (!reportData.length) {
      alert("No data to print");
      return;
    }
    const rows = reportData
      .map(
        (r, idx) => `
      <tr>
        <td style="padding:8px">${idx + 1}</td>
        <td style="padding:8px">${r.student?.name || "-"}</td>
        <td style="padding:8px">${r.student?.email || "-"}</td>
        <td style="padding:8px;text-align:center">${r.total ?? 0}</td>
        <td style="padding:8px;text-align:center">${r.present ?? 0}</td>
        <td style="padding:8px;text-align:center">${r.absent ?? 0}</td>
        <td style="padding:8px;text-align:center">${r.late ?? 0}</td>
        <td style="padding:8px;text-align:center">${r.excused ?? 0}</td>
        <td style="padding:8px;text-align:center">${r.attendancePercentage ?? 0}%</td>
      </tr>`
      )
      .join("");

    const header = `
      <div style="font-family: Arial, Helvetica, sans-serif; padding:20px;">
        <h2 style="color:#844299; margin:0 0 8px 0;">Attendance Report</h2>
        <p style="margin:0 0 10px 0; color:#333;">
          ${departments.find((d) => d._id === filters.department)?.departmentName || ""} • ${
      batches.find((b) => b._id === filters.batch)?.batchName || ""
    } • Section ${filters.section}
        </p>
        <table style="width:100%;border-collapse:separate;border-spacing:0;margin-top:12px;box-shadow:0 2px 32px 0 rgba(136,63,151,0.07);border-radius:12px;overflow:hidden;">
          <thead>
            <tr style="background: #f3e5f5;">
              <th style="padding:10px;">S.No</th>
              <th style="padding:10px;">Name</th>
              <th style="padding:10px;">Email</th>
              <th style="padding:10px;">Total</th>
              <th style="padding:10px;">Present</th>
              <th style="padding:10px;">Absent</th>
              <th style="padding:10px;">Late</th>
              <th style="padding:10px;">Excused</th>
              <th style="padding:10px;">%</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <p style="margin-top:16px;color:#666;font-size:12px">Generated: ${new Date().toLocaleString()}</p>
      </div>
    `;
    const w = window.open("", "_blank", "width=1000,height=800");
    if (!w) return alert("Unable to open print window.");
    w.document.write(`<html><head><title>Attendance Report</title></head><body>${header}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  };

  const filtered = reportData.filter((r) => {
    if (!searchQ) return true;
    const q = searchQ.toLowerCase();
    return (
      (r.student?.name || "").toLowerCase().includes(q) ||
      (r.student?.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      <style>{`
        :root {
          --sidebar-width: 250px;
          --sidebar-collapsed: 80px;
          --bg: #f6f7fb;
          --card: #ffffff;
          --primary: #844299;
          --accent: #a252bb;
          --muted: #6c757d;
          --shadow: rgba(27,31,40,0.08);
        }
        body { background: var(--bg); font-family: 'Poppins', sans-serif; }
        .page { display:flex; min-height:100vh }
        .main {
          flex: 1;
          padding: 26px;
          transition: margin-left .28s ease;
          overflow: auto;
          position: relative;
          min-height: 100vh;
        }
        .main-loading-overlay {
          position: absolute;
          left: 0; top: 0;
          width: 100%; height: 100%;
          background: rgba(246,247,251, 0.95);
          z-index: 100;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .main-skeleton-box {
          width: 80vw;
          max-width: 1000px;
          height: 50vh;
          max-height: 400px;
          background: linear-gradient(90deg, #e9e9ed 25%, #f6f6f8 50%, #e9e9ed 75%);
          animation: shimmer 1.4s infinite;
          border-radius: 28px;
        }
        .header-card {
          background: linear-gradient(90deg, rgba(132,66,153,0.06), rgba(162,82,187,0.03));
          border-radius: 12px;
          padding: 18px;
          margin-bottom: 18px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:12px;
        }
        .title { color: var(--primary); font-weight:700; margin:0; font-size:28px; }
        .subtitle { color: var(--muted); margin:0; font-size:13px; }
        .card {
          background: var(--card);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 8px 28px var(--shadow);
          margin-bottom: 16px;
        }
        .controls-row {
          display:flex;
          gap:12px;
          flex-wrap:wrap;
          align-items:center;
          justify-content:space-between;
        }
        .controls-left {
          display:flex;
          gap:12px;
          align-items:center;
          flex-wrap:wrap;
        }
        .search-box { min-width:260px; max-width:420px; }
        .filters-grid { display:grid; gap:12px; grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) { .filters-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) {
          .filters-grid { grid-template-columns: 1fr; }
          .search-box { width:100%; }
          .main { padding: 8px; }
        }
        .table-wrap {
          overflow:auto;
          border-radius:12px;
          max-height: 60vh;
          background: white;
          padding: 8px;
          box-shadow: 0 8px 48px rgba(132,66,153, 0.10);
        }
        table.report-table {
          width:100%;
          border-collapse:separate;
          border-spacing:0;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 32px 0 rgba(132,66,153,0.07);
        }
        table.report-table thead th {
          position: sticky;
          top: 0;
          background: #844299;
          color: #fff;
          padding:16px 10px;
          font-weight:800;
          z-index:2;
          text-align:left;
          border-bottom: 2px solid #e1bee7;
          border-right: 1px solid #f3e5f5;
          box-shadow: 0 2px 12px 0 rgba(132,66,153,0.10);
        }
        table.report-table th:last-child {
          border-right: none;
        }
        table.report-table td {
          padding: 14px 12px;
          background: #fff;
          border-bottom: 1.5px solid #f3e5f5;
          transition: background 0.18s;
        }
        table.report-table tbody tr {
          transition: background 0.17s;
        }
        table.report-table tbody tr:nth-child(even) td {
          background: #faf6fd;
        }
        table.report-table tbody tr:hover td {
          background: #f3e5f5;
        }
        .legend { display:flex; gap:12px; flex-wrap:wrap; align-items:center; }
        .badge-dot { width:12px; height:12px; border-radius:50%; display:inline-block; margin-right:8px; vertical-align:middle; }
        .btn-export {
          background: linear-gradient(90deg, #2e7d32, #66bb6a);
          color: white;
          border: none;
        }
        .btn-primary-custom {
          background: linear-gradient(90deg, var(--primary), var(--accent));
          color: white;
          border: none;
        }
        .skeleton {
          background: linear-gradient(90deg, #e9e9ed 25%, #f6f6f8 50%, #e9e9ed 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius:6px;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
        @media (max-width: 900px) {
          .header-card, .card, .controls-row {
            flex-direction: column;
            gap: 10px;
          }
          table.report-table {
            min-width: 600px;
          }
        }
        @media (max-width: 600px) {
          .header-card, .card, .controls-row {
            flex-direction: column;
            gap: 6px;
          }
          table.report-table {
            min-width: 420px;
            font-size: 13px;
          }
          .filters-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page">
        <Sidebar onToggle={setSidebarOpen} />
        <main className="main" style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}>
          {loadingFull && (
            <div className="main-loading-overlay">
              <div className="main-skeleton-box"></div>
            </div>
          )}
          <div className="header-card">
            <div>
              <h2 className="title">Attendance Report</h2>
              <p className="subtitle">Generate attendance summaries by department, batch & section</p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setFilters({
                    department: "",
                    batch: "",
                    section: "A",
                    subject: "",
                    startDate: "",
                    endDate: "",
                  });
                  setBatches([]);
                  setSubjects([]);
                  setReportData([]);
                }}
              >
                Reset
              </button>
            </div>
          </div>
          <div className="card">
            <h5 style={{ marginBottom: 12 }}>Filters</h5>
            <div className="filters-grid mb-3">
              <div>
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={filters.department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                >
                  <option value="">
                    {departments.length ? "Select Department" : "No departments"}
                  </option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.departmentName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Batch</label>
                {loadingDropdowns ? (
                  <div className="skeleton" style={{ height: 40, width: "100%" }} />
                ) : (
                  <select
                    className="form-select"
                    value={filters.batch}
                    onChange={(e) => handleFilterChange("batch", e.target.value)}
                    disabled={!filters.department || !batches.length}
                  >
                    <option value="">
                      {!filters.department ? "Select department first" : "Select batch"}
                    </option>
                    {batches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.batchName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="form-label">Section</label>
                <select
                  className="form-select"
                  value={filters.section}
                  onChange={(e) => handleFilterChange("section", e.target.value)}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div>
                <label className="form-label">Subject (optional)</label>
                {loadingDropdowns ? (
                  <div className="skeleton" style={{ height: 40, width: "100%" }} />
                ) : (
                  <select
                    className="form-select"
                    value={filters.subject}
                    onChange={(e) => handleFilterChange("subject", e.target.value)}
                    disabled={!filters.department || !subjects.length}
                  >
                    <option value="">All subjects</option>
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.subjectName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                />
              </div>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-primary-custom"
                onClick={fetchReport}
                disabled={loadingReport}
              >
                {loadingReport ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" /> Generating...
                  </>
                ) : (
                  "Generate Report"
                )}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setFilters((p) => ({ ...p, startDate: "", endDate: "" }));
                }}
              >
                Clear Dates
              </button>
            </div>
          </div>
          <div className="card d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
            <div className="controls-left" style={{ alignItems: "center" }}>
              <div className="input-group search-box">
                <span className="input-group-text">🔎</span>
                <input
                  className="form-control"
                  placeholder="Search by student name or email"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                className="btn btn-export"
                onClick={exportToCSV}
                disabled={!reportData.length}
                title="Export CSV"
              >
                Export CSV
              </button>
              <button
                className="btn btn-primary-custom"
                onClick={printReport}
                disabled={!reportData.length}
                title="Print report"
              >
                Print
              </button>
            </div>
          </div>
          <div className="card">
            <h6 style={{ marginBottom: 12 }}>Attendance Summary</h6>
            <div className="table-wrap">
              <table className="report-table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>S.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th style={{ width: 110, textAlign: "center" }}>Total</th>
                    <th style={{ width: 110, textAlign: "center" }}>Present</th>
                    <th style={{ width: 110, textAlign: "center" }}>Absent</th>
                    <th style={{ width: 110, textAlign: "center" }}>Late</th>
                    <th style={{ width: 110, textAlign: "center" }}>Excused</th>
                    <th style={{ width: 120, textAlign: "center" }}>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingReport ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i}>
                        <td>
                          <div className="skeleton" style={{ height: 12, width: 28 }} />
                        </td>
                        <td>
                          <div className="skeleton" style={{ height: 12, width: "70%" }} />
                        </td>
                        <td>
                          <div className="skeleton" style={{ height: 12, width: "60%" }} />
                        </td>
                        <td>
                          <div className="skeleton" style={{ height: 12, width: 40 }} />
                        </td>
                        <td>
                          <div className="skeleton" style={{ height: 12, width: 40 }} />
                        </td>
                        <td>
                          <div className="skeleton" style={{ height: 12, width: 40 }} />
                        </td>
                        <td>
                          <div className="skeleton" style={{ height: 12, width: 40 }} />
                        </td>
                        <td>
                          <div className="skeleton" style={{ height: 12, width: 40 }} />
                        </td>
                        <td>
                          <div className="skeleton" style={{ height: 12, width: 60 }} />
                        </td>
                      </tr>
                    ))
                  ) : filtered.length > 0 ? (
                    filtered.map((r, idx) => (
                      <tr key={r.student?._id || idx}>
                        <td>{idx + 1}</td>
                        <td>{r.student?.name || "-"}</td>
                        <td>{r.student?.email || "-"}</td>
                        <td style={{ textAlign: "center" }}>{r.total ?? 0}</td>
                        <td style={{ textAlign: "center", color: "#28a745", fontWeight: 700 }}>{r.present ?? 0}</td>
                        <td style={{ textAlign: "center", color: "#dc3545", fontWeight: 700 }}>{r.absent ?? 0}</td>
                        <td style={{ textAlign: "center", color: "#ffc107", fontWeight: 700 }}>{r.late ?? 0}</td>
                        <td style={{ textAlign: "center", color: "#17a2b8", fontWeight: 700 }}>{r.excused ?? 0}</td>
                        <td
                          style={{
                            textAlign: "center",
                            fontWeight: 800,
                            color: getAttendanceColor(r.attendancePercentage),
                          }}
                        >
                          {r.attendancePercentage ?? 0}%
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", padding: 20, color: "#666" }}>
                        {reportData.length === 0
                          ? "No report yet. Use filters above and click Generate Report."
                          : "No matching results."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 12 }} className="legend">
              <div>
                <span className="badge-dot" style={{ background: "#28a745" }} /> ≥ 75% (Good)
              </div>
              <div>
                <span className="badge-dot" style={{ background: "#ffc107" }} /> 60–74% (Warning)
              </div>
              <div>
                <span className="badge-dot" style={{ background: "#dc3545" }} /> &lt; 60% (Low)
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AttendanceReport;
