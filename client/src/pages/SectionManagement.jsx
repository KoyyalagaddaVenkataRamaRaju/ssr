// src/pages/SectionManagement.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchBatchesByDepartment } from "../services/teacherAllocationService.jsx";
import {
  createSection,
  fetchSectionsbyDepartementandBatchandYear,
} from "../services/sectionService.jsx";
import { fetchDepartment } from "../services/attendanceService.jsx";

const SectionManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formMode, setFormMode] = useState("create"); // still kept, in case you use later
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [formData, setFormData] = useState({
    department: "",
    batch: "",
    year: "",
    numberOfSections: 1,
    capacity: 60,
    academicYear:
      new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
  });

  const [viewFilters, setViewFilters] = useState({
    department: "",
    batch: "",
    academicYear:
      new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetchDepartment();
      const data = response.data;
      if (response.success) {
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      alert("Failed to fetch departments");
    }
  };

  const fetchBatches = async (departmentId) => {
    try {
      const response = await fetchBatchesByDepartment(departmentId);
      console.log(response.data);
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

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    console.log(departmentId);
    console.log("Selected Department ID:", departmentId);
    setFormData({
      ...formData,
      department: departmentId,
      batch: "",
      year: "",
    });
    if (departmentId) {
      fetchBatches(departmentId);
    }
  };

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    const selectedBatch = batches.find((b) => b._id === batchId);
    setFormData({
      ...formData,
      batch: batchId,
      year: selectedBatch?.year || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "numberOfSections" || name === "capacity" || name === "year"
          ? parseInt(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.department || !formData.batch || !formData.year) {
      alert("Please select department, batch, and year");
      setLoading(false);
      return;
    }

    try {
      const sectionData = {
        department: formData.department,
        batch: formData.batch,
        year: formData.year,
        numberOfSections: formData.numberOfSections,
        capacity: formData.capacity,
        academicYear: formData.academicYear,
      };

      console.log(sectionData);

      const response = await createSection(sectionData);
      const data = await response.data;
      console.log(data);

      if (response.success) {
        alert(data.message || "Sections created successfully!");
        setFormData({
          department: "",
          batch: "",
          year: "",
          numberOfSections: 1,
          capacity: 60,
          academicYear:
            new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
        });
        fetchSections();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error creating sections:", error);
      alert("Failed to create sections");
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    const departmentId = viewFilters.department || "";
    const batchId = viewFilters.batch || "";
    const academicYear = viewFilters.academicYear || "";

    try {
      const response =
        await fetchSectionsbyDepartementandBatchandYear(
          departmentId,
          batchId,
          academicYear
        );
      const data = response.data;

      if (response.success) {
        setSections(data);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const handleViewDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    console.log("view" + departmentId);
    setViewFilters({
      ...viewFilters,
      department: departmentId,
      batch: "",
    });

    if (departmentId) {
      console.log("view" + departmentId);
      await fetchBatchesByDepartment(departmentId); // keep same logic
    }
  };

  const handleViewBatchChange = (e) => {
    setViewFilters({
      ...viewFilters,
      batch: e.target.value,
    });
  };

  const handleViewApply = () => {
    fetchSections();
  };

  const handleDeleteSection = async (sectionId) => {
    if (
      window.confirm(
        "Are you sure you want to deactivate this section?"
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/sections/${sectionId}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();

        if (data.success) {
          alert("Section deactivated successfully");
          fetchSections();
        } else {
          alert("Error: " + data.error);
        }
      } catch (error) {
        console.error("Error deleting section:", error);
        alert("Failed to delete section");
      }
    }
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

        @media (max-width: 992px) {
          .main-content { padding: 20px 16px; }
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
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <div>
              <h2 className="page-title">Section Management</h2>
              <p className="small-muted mb-0">
                Create and manage sections for each department, batch, and academic year.
              </p>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="alert alert-danger py-2">{error}</div>
          )}

          {/* CREATE SECTIONS */}
          <section className="card-surface">
            <h5 className="mb-3">Create Sections</h5>

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Department
                  </label>
                  <select
                    value={formData.department}
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
                  <label className="form-label fw-semibold">
                    Batch
                  </label>
                  <select
                    value={formData.batch}
                    onChange={handleBatchChange}
                    disabled={!formData.department}
                    className="form-control"
                    style={{
                      opacity: !formData.department ? 0.5 : 1,
                    }}
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
                  <label className="form-label fw-semibold">
                    Year
                  </label>
                  <select
                    value={formData.year}
                    onChange={handleInputChange}
                    name="year"
                    disabled={!formData.batch}
                    className="form-control"
                    style={{
                      opacity: !formData.batch ? 0.5 : 1,
                    }}
                  >
                    <option value="">Select Year</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Number of Sections
                  </label>
                  <select
                    name="numberOfSections"
                    value={formData.numberOfSections}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="1">1 (A)</option>
                    <option value="2">2 (A, B)</option>
                    <option value="3">3 (A, B, C)</option>
                    <option value="4">4 (A, B, C, D)</option>
                    <option value="5">5 (A, B, C, D, E)</option>
                    <option value="6">6 (A, B, C, D, E, F)</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Student Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="10"
                    max="200"
                    className="form-control"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Academic Year
                  </label>
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
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ minWidth: "180px" }}
              >
                {loading ? "Creating..." : "Create Sections"}
              </button>
            </form>
          </section>

          {/* VIEW SECTIONS FILTER */}
          <section className="card-surface">
            <h5 className="mb-3">View Sections</h5>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Department (Optional)
                </label>
                <select
                  value={viewFilters.department}
                  onChange={handleViewDepartmentChange}
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

              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Batch (Optional)
                </label>
                <select
                  value={viewFilters.batch}
                  onChange={handleViewBatchChange}
                  className="form-control"
                >
                  <option value="">All Batches</option>
                  {batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.batchName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={viewFilters.academicYear}
                  onChange={(e) =>
                    setViewFilters({
                      ...viewFilters,
                      academicYear: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </div>
            </div>

            <button
              onClick={handleViewApply}
              className="btn btn-success"
              style={{ minWidth: "150px" }}
            >
              Load Sections
            </button>
          </section>

          {/* SECTIONS TABLE */}
          {sections.length > 0 && (
            <section className="table-card">
              <h5 className="mb-3">
                Sections List ({sections.length})
              </h5>
              <div className="table-responsive">
                <table className="table table-bordered table-striped align-middle">
                  <thead className="table-primary">
                    <tr>
                      <th>Section</th>
                      <th>Department</th>
                      <th>Batch</th>
                      <th className="text-center">Year</th>
                      <th className="text-center">Capacity</th>
                      <th className="text-center">Academic Year</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections.map((section) => (
                      <tr key={section._id}>
                        <td className="fw-semibold">
                          {section.sectionName}
                        </td>
                        <td>
                          {section.department?.departmentName || "N/A"}
                        </td>
                        <td>
                          {section.batch?.batchName || "N/A"}
                        </td>
                        <td className="text-center">
                          {section.year}
                        </td>
                        <td className="text-center">
                          {section.capacity}
                        </td>
                        <td className="text-center">
                          {section.academicYear}
                        </td>
                        <td
                          className="text-center"
                          style={{
                            color: section.isActive
                              ? "#28a745"
                              : "#dc3545",
                            fontWeight: 600,
                          }}
                        >
                          {section.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() =>
                              handleDeleteSection(section._id)
                            }
                            className="btn btn-sm btn-danger"
                          >
                            Deactivate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {sections.length === 0 && viewFilters.department && (
            <div
              className="mt-3 text-center"
              style={{
                padding: "30px",
                backgroundColor: "#f9f9f9",
                borderRadius: "10px",
                color: "#666",
              }}
            >
              No sections found for the selected criteria
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default SectionManagement;
