import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  ClipboardList,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { getAllUsers, toggleTeacherPermission } from "../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    students: 0,
    teachers: 0,
    admins: 0,
    principals: 0,
  });
  const [filters, setFilters] = useState({
    role: "",
    department: "",
    search: "",
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    fetchUsers();
    return () => clearTimeout(timer);
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryFilters = {};
      if (filters.role) queryFilters.role = filters.role;
      if (filters.department) queryFilters.department = filters.department;
      if (filters.search) queryFilters.search = filters.search;

      const response = await getAllUsers(queryFilters);
      if (response.success) {
        setUsers(response.users);
        setStats(response.stats);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage({ type: "error", text: "Failed to fetch users" });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleTogglePermission = async (userId) => {
    try {
      const response = await toggleTeacherPermission(userId);
      if (response.success) {
        setMessage({ type: "success", text: response.message });
        fetchUsers();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update permission",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const clearFilters = () => {
    setFilters({
      role: "",
      department: "",
      search: "",
    });
  };

  return (
    <>
      <style>
        {`
        :root {
          --sidebar-width: 250px;
          --sidebar-collapsed: 80px;
        }

        body {
          background: linear-gradient(135deg, #f3e5f5, #e0f7fa);
          font-family: 'Poppins', sans-serif;
          color: #333;
          margin: 0;
          padding: 0;
          height: 100vh;
          overflow: hidden;
        }

        /* 🔹 Page Layout */
        .manage-users-page {
          display: flex;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        /* 🔹 Scrollable main content */
        .main-content {
          flex-grow: 1;
          height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 30px 40px;
          transition: margin-left 0.36s ease;
          scrollbar-width: thin;
          scrollbar-color: #b39ddb #f4f4f4;
        }

        /* 🔹 Custom Scrollbar */
        .main-content::-webkit-scrollbar {
          width: 10px;
        }

        .main-content::-webkit-scrollbar-thumb {
          background: #b39ddb;
          border-radius: 8px;
        }

        .main-content::-webkit-scrollbar-thumb:hover {
          background: #8e24aa;
        }

        /* Page Header */
        .page-header {
          margin-bottom: 1.5rem;
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #4a148c;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .page-subtitle {
          color: #666;
          margin-top: 4px;
        }

        /* 🔹 Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(70,60,90,0.06);
          padding: 20px;
          text-align: center;
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #6a1b9a;
        }

        .stat-label {
          color: #555;
          margin-top: 6px;
        }

        /* 🔹 Filters */
        .filters-section {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(70,60,90,0.05);
          padding: 20px;
          margin-bottom: 1.5rem;
        }

        .filters-header {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4a148c;
          margin-bottom: 1rem;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
          color: #444;
          margin-bottom: 4px;
        }

        .form-input {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        .btn-secondary {
          background: linear-gradient(90deg,#6a1b9a,#1e88e5);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: linear-gradient(90deg,#5e35b1,#1976d2);
        }

        /* 🔹 Messages */
        .message {
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 6px;
          padding: 10px;
          margin-bottom: 10px;
          font-weight: 500;
        }

        .message.success {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #a5d6a7;
        }

        .message.error {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ef9a9a;
        }

        /* 🔹 Table */
        .users-table-container {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 6px 18px rgba(70,60,90,0.04);
          overflow-x: auto;
          padding: 0;
          margin-bottom: 20px;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px;
          border-bottom: 1px solid #f3f3f3;
          text-align: left;
        }

        th {
          background: #6a1b9a;
          color: #fff;
        }

        tr:hover td {
          background: #faf1ff;
        }

        /* Buttons */
        .btn-sm {
          font-size: 13px;
          padding: 6px 10px;
          border-radius: 6px;
          transition: all 0.3s ease;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .btn-success {
          background: #4caf50;
          color: #fff;
        }

        .btn-success:hover {
          background: #43a047;
        }

        .btn-secondary {
          background: #9e9e9e;
          color: #fff;
        }

        .btn-secondary:hover {
          background: #757575;
        }

        /* Skeleton Loader */
        .skeleton {
          background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite linear;
          border-radius: 8px;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
            height: 100vh;
          }
        }
        `}
      </style>

      <div className="manage-users-page">
        {/* Fixed Sidebar */}
        <Sidebar onToggle={setSidebarOpen} />

        {/* Main Content */}
        <div
          className="main-content"
          style={{
            marginLeft: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed)",
          }}
        >
          {loading ? (
            <>
              <div className="skeleton" style={{ height: 30, width: 240, marginBottom: 20 }}></div>
              <div className="skeleton" style={{ height: 450, borderRadius: 12 }}></div>
            </>
          ) : (
            <>
              <div className="page-header">
                <h1 className="page-title">
                  <Users size={28} /> Manage Users
                </h1>
                <p className="page-subtitle">View and manage all system users</p>
              </div>

              {/* Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.students}</div>
                  <div className="stat-label">Students</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.teachers}</div>
                  <div className="stat-label">Teachers</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.admins + stats.principals}</div>
                  <div className="stat-label">Administrators</div>
                </div>
              </div>

              {message.text && (
                <div className={`message ${message.type}`}>
                  {message.type === "success" ? <CheckCircle /> : <XCircle />}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Filters */}
              <div className="filters-section">
                <div className="filters-header">
                  <Filter size={20} />
                  <h3>Filters</h3>
                </div>

                <div className="filters-grid">
                  <div className="filter-group">
                    <label htmlFor="search" className="filter-label">
                      <Search size={16} /> Search
                    </label>
                    <input
                      type="text"
                      id="search"
                      name="search"
                      className="form-input"
                      placeholder="Search by name or email"
                      value={filters.search}
                      onChange={handleFilterChange}
                    />
                  </div>

                  <div className="filter-group">
                    <label htmlFor="role" className="filter-label">Role</label>
                    <select
                      id="role"
                      name="role"
                      className="form-input"
                      value={filters.role}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Roles</option>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                      <option value="principal">Principal</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label htmlFor="department" className="filter-label">Department</label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      className="form-input"
                      placeholder="Filter by department"
                      value={filters.department}
                      onChange={handleFilterChange}
                    />
                  </div>

                  <div className="filter-group">
                    <button className="btn-secondary" onClick={clearFilters}>
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <h3 className="section-title">
                <ClipboardList size={20} /> User List
              </h3>
              <div className="users-table-container">
                {users.length > 0 ? (
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>ID</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>{user.role}</span>
                          </td>
                          <td>{user.department || "-"}</td>
                          <td>{user.enrollmentId || user.employeeId || "-"}</td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td>
                            {user.role === "teacher" && (
                              <button
                                className={`btn-sm ${
                                  user.canRegisterStudents ? "btn-success" : "btn-secondary"
                                }`}
                                onClick={() => handleTogglePermission(user._id)}
                              >
                                {user.canRegisterStudents ? (
                                  <>
                                    <CheckCircle size={14} /> Can Register
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={14} /> No Permission
                                  </>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ padding: "12px" }}>No users found matching your filters.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminManageUsers;
