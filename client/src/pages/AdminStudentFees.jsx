import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const AdminStudentFees = () => {
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ department: "", batch: "" });
  const [editingFee, setEditingFee] = useState({}); // { studentId, feeId, amount }

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  // Load departments and batches
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthConfig();
        const [deptRes, batchRes] = await Promise.all([
          axios.get(`${API_URL}/api/departments`, config),
          axios.get(`${API_URL}/api/batches`, config),
        ]);
        setDepartments(deptRes.data.data || []);
        setBatches(batchRes.data.data || []);
      } catch (err) {
        toast.error("Error loading departments/batches");
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchStudents = async () => {
    if (!filters.department || !filters.batch) {
      toast.error("Select department and batch");
      return;
    }
    try {
      const config = getAuthConfig();
      const res = await axios.get(`${API_URL}/api/student-fees`, {
        ...config,
        params: filters,
      });
      if (res.data.success) setStudents(res.data.students);
    } catch (err) {
      toast.error("Error fetching students");
    }
  };

  const handleFeeEdit = async (studentId, feeId, amount) => {
    try {
      const config = getAuthConfig();
      const res = await axios.put(`${API_URL}/api/student-fees/${studentId}/fee/${feeId}`, { amount }, config);
      if (res.data.success) {
        toast.success("Fee updated successfully");
        fetchStudents(); // refresh
        setEditingFee({});
      }
    } catch (err) {
      toast.error("Error updating fee");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Student Fee Manager</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select name="department" value={filters.department} onChange={handleFilterChange}>
          <option value="">Select Department</option>
          {departments.map((d) => <option key={d._id} value={d._id}>{d.departmentName}</option>)}
        </select>
        <select name="batch" value={filters.batch} onChange={handleFilterChange}>
          <option value="">Select Batch</option>
          {batches.map((b) => <option key={b._id} value={b._id}>{b.batchName}</option>)}
        </select>
        <button onClick={fetchStudents}>Filter</button>
      </div>

      {/* Students Table */}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Department</th>
            <th>Batch</th>
            <th>Fees</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.rollNumber}</td>
              <td>{student.department.departmentName}</td>
              <td>{student.batch.batchName}</td>
              <td>
                {student.fees.map(fee => (
                  <div key={fee.fee._id} className="flex gap-2 items-center">
                    {editingFee.studentId === student._id && editingFee.feeId === fee.fee._id ? (
                      <>
                        <input
                          type="number"
                          value={editingFee.amount}
                          onChange={(e) => setEditingFee({ ...editingFee, amount: e.target.value })}
                        />
                        <button onClick={() => handleFeeEdit(student._id, fee.fee._id, editingFee.amount)}>Save</button>
                        <button onClick={() => setEditingFee({})}>Cancel</button>
                      </>
                    ) : (
                      <>
                        ₹{fee.amount}
                        <button onClick={() => setEditingFee({ studentId: student._id, feeId: fee.fee._id, amount: fee.amount })}>
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStudentFees;
