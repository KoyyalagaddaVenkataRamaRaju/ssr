import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const AdminFeesManager = () => {
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    department: "",
    batch: "",
    semester: "",
    amount: "",
    description: "",
  });

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  // Fetch departments, batches, semesters, and fees
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const config = getAuthConfig();
        const [deptRes, batchRes, semRes, feesRes] = await Promise.all([
          axios.get(`${API_URL}/api/departments`, config),
          axios.get(`${API_URL}/api/batches`, config),
          axios.get(`${API_URL}/api/semesters`, config),
          axios.get(`${API_URL}/api/fees`, config),
        ]);

        setDepartments(deptRes.data.data || deptRes.data.departments || []);
        setBatches(batchRes.data.data || batchRes.data.batches || []);
        setSemesters(semRes.data.data || semRes.data.semesters || []);
        setFees(feesRes.data.fees || []); // <-- Updated to match backend

        setLoading(false);
      } catch (err) {
        console.error("❌ Error loading data:", err);
        setLoading(false);
        if (err.response?.status === 401) {
          toast.error("Unauthorized! Please log in again.");
          localStorage.removeItem("token");
        } else {
          toast.error("Failed to load data from server!");
        }
      }
    };

    fetchAllData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.department || !form.batch || !form.semester || !form.amount) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/fees`, form, getAuthConfig());
      if (res.data?.success && res.data.fee) {
        toast.success("✅ Fee record created successfully!");
        setFees((prev) => [res.data.fee, ...prev]); // Add new record at top
        setForm({
          department: "",
          batch: "",
          semester: "",
          amount: "",
          description: "",
        });
      } else {
        toast.error("❌ Something went wrong while creating fee!");
      }
    } catch (err) {
      console.error("❌ Error creating fee:", err);
      toast.error(err.response?.data?.message || "Error creating fee record!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-gray-600">
        <Loader2 className="animate-spin mr-2" />
        Loading data...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Fees Manager</h2>

      {/* Fee Creation Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Department */}
          <div>
            <label className="block text-sm font-semibold mb-1">Department</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="border rounded-md w-full p-2"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          {/* Batch */}
          <div>
            <label className="block text-sm font-semibold mb-1">Batch</label>
            <select
              name="batch"
              value={form.batch}
              onChange={handleChange}
              className="border rounded-md w-full p-2"
              required
            >
              <option value="">Select Batch</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.batchName}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-semibold mb-1">Semester</label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className="border rounded-md w-full p-2"
              required
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem._id} value={sem._id}>
                  {sem.semesterName}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="₹ Amount"
              className="border rounded-md w-full p-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description"
              className="border rounded-md w-full p-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Fee Record
        </button>
      </form>

      {/* Existing Fees List */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Existing Fee Records</h3>
        {fees.length === 0 ? (
          <p className="text-gray-500">No fee records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Department</th>
                  <th className="p-2 border">Batch</th>
                  <th className="p-2 border">Semester</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">Description</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((fee) => (
                  <tr key={fee._id} className="text-center">
                    <td className="p-2 border">{fee.department?.departmentName || "—"}</td>
                    <td className="p-2 border">{fee.batch?.batchName || "—"}</td>
                    <td className="p-2 border">{fee.semester?.semesterName || "—"}</td>
                    <td className="p-2 border">₹{fee.amount}</td>
                    <td className="p-2 border">{fee.description || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeesManager;
