import React, { useEffect, useState } from "react";
import {
  getAllBatches,
  getAllDepartments,
} from "../services/batchService.jsx";
import axios from "axios";
import { Modal, Button, Form, Table, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminFeeManager = () => {
  const [fees, setFees] = useState([]);
  const [batches, setBatches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [students, setStudents] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    batch: "",
    department: "",
    semester: "",
    academicYear: "",
    feeName: "",
    totalAmount: "",
  });

  const [discount, setDiscount] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // ✅ Fetch dropdown data using your secure service wrapper
  const fetchDropdownData = async () => {
    try {
      const batchRes = await getAllBatches();
      const deptRes = await getAllDepartments();

      console.log("Batch Response:", batchRes);
      console.log("Department Response:", deptRes);

      setBatches(batchRes.batches || batchRes.data || []);
      setDepartments(deptRes.departments || deptRes.data || []);

      // Fetch semesters directly with token
      const token = localStorage.getItem("token");
      const semRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/semesters`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Semester Response:", semRes.data);
      setSemesters(semRes.data.semesters || semRes.data.data || []);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
      if (err?.status === 401 || err?.response?.status === 401) {
        alert("Session expired. Please log in again.");
      }
    }
  };

  // ✅ Fetch fees (secured)
  const fetchFees = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/fees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFees(data.fees || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching fees:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
    fetchFees();
  }, []);

  // ✅ Generate academic years from batch dates
  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    const selectedBatch = batches.find((b) => b._id === batchId);
    setFormData({ ...formData, batch: batchId, academicYear: "" });

    if (selectedBatch?.startDate && selectedBatch?.endDate) {
      const startYear = new Date(selectedBatch.startDate).getFullYear();
      const endYear = new Date(selectedBatch.endDate).getFullYear();
      const years = [];
      for (let y = startYear; y < endYear; y++) {
        years.push(`${y}-${y + 1}`);
      }
      setAcademicYears(years);
    } else {
      setAcademicYears([]);
    }
  };

  // ✅ Handle input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Add / Edit Fee
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editMode) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/fees/${selectedFee._id}`,
          formData,
          config
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/fees`,
          formData,
          config
        );
      }

      fetchFees();
      setShowModal(false);
      setEditMode(false);
      setFormData({
        batch: "",
        department: "",
        semester: "",
        academicYear: "",
        feeName: "",
        totalAmount: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error saving fee record");
    }
  };

  // ✅ Delete Fee
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this fee record?")) {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/fees/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFees();
    }
  };

  // ✅ Edit Fee
  const handleEdit = (fee) => {
    setSelectedFee(fee);
    setFormData({
      batch: fee.batch?._id || "",
      department: fee.department?._id || "",
      semester: fee.semester?._id || "",
      academicYear: fee.academicYear,
      feeName: fee.feeName,
      totalAmount: fee.totalAmount,
    });
    setEditMode(true);
    setShowModal(true);
  };

  // ✅ View Students
  const handleViewStudents = async (fee) => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/fees/${fee._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setStudents(data.fee.assignedToStudents);
    setSelectedFee(fee);
    setShowStudentModal(true);
  };

  // ✅ Apply Discount
  const applyDiscount = async (studentId) => {
    if (!discount || discount < 0) return alert("Enter valid discount amount");
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/fees/${selectedFee._id}/discount/${studentId}`,
        { discount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Discount applied successfully!");
      handleViewStudents(selectedFee);
      setDiscount(0);
      setSelectedStudent(null);
    } catch (err) {
      console.error(err);
      alert("Error applying discount");
    }
  };

  // ✅ Loading state
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h3 className="mb-2">Fee Management</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add Fee
        </Button>
      </div>

      {/* Fee List Table */}
      <Table bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Fee Name</th>
            <th>Batch</th>
            <th>Department</th>
            <th>Semester</th>
            <th>Academic Year</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee) => (
            <tr key={fee._id}>
              <td>{fee.feeName}</td>
              <td>{fee.batch?.batchName}</td>
              <td>{fee.department?.departmentName}</td>
              <td>{fee.semester?.semesterName}</td>
              <td>{fee.academicYear}</td>
              <td>₹{fee.totalAmount}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleViewStudents(fee)}
                  className="me-2"
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(fee)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(fee._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Fee" : "Add New Fee"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Fee Name</Form.Label>
              <Form.Control
                name="feeName"
                value={formData.feeName}
                onChange={handleChange}
                placeholder="Enter fee name"
                required
              />
            </Form.Group>

            {/* Batch Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>Batch</Form.Label>
              <Form.Select
                name="batch"
                value={formData.batch}
                onChange={handleBatchChange}
                required
              >
                <option value="">Select Batch</option>
                {batches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.batchName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Department Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.departmentName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Semester Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>Semester</Form.Label>
              <Form.Select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
              >
                <option value="">Select Semester</option>
                {semesters.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.semesterName} (Sem {s.semesterNumber})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Academic Year Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>Academic Year</Form.Label>
              <Form.Select
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                required
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((year, idx) => (
                  <option key={idx} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                placeholder="Enter total fee amount"
                required
              />
            </Form.Group>

            <div className="text-end">
              <Button type="submit" variant="success">
                {editMode ? "Update Fee" : "Add Fee"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Student Modal */}
      <Modal
        show={showStudentModal}
        onHide={() => setShowStudentModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Students - {selectedFee?.feeName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered responsive hover>
            <thead className="table-secondary">
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Paid Amount</th>
                <th>Discount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.student._id}>
                  <td>{s.student?.name}</td>
                  <td>
                    {s.isPaid ? (
                      <span className="text-success">Paid</span>
                    ) : (
                      <span className="text-danger">Pending</span>
                    )}
                  </td>
                  <td>₹{s.amountAfterDiscount || selectedFee.totalAmount}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Enter discount"
                      value={
                        selectedStudent === s.student._id ? discount : ""
                      }
                      onChange={(e) => {
                        setDiscount(e.target.value);
                        setSelectedStudent(s.student._id);
                      }}
                    />
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => applyDiscount(s.student._id)}
                    >
                      Apply
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminFeeManager;
