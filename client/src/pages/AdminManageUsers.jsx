import { useState, useEffect } from 'react';
import { Users, Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import { getAllUsers, toggleTeacherPermission } from '../services/authService';
import Card from '../components/Card';

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
    role: '',
    department: '',
    search: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
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
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to fetch users' });
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
        setMessage({ type: 'success', text: response.message });
        fetchUsers();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update permission',
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      department: '',
      search: '',
    });
  };

  return (
    <div className="manage-users-page">
      <div className="page-header">
        <h1 className="page-title">
          <Users size={32} />
          Manage Users
        </h1>
        <p className="page-subtitle">View and manage all system users</p>
      </div>

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
          {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}


        <div className="filters-section">
          <div className="filters-header">
            <Filter size={20} />
            <h3>Filters</h3>
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="search" className="filter-label">
                <Search size={16} />
                Search
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
              <label htmlFor="role" className="filter-label">
                Role
              </label>
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
              <label htmlFor="department" className="filter-label">
                Department
              </label>
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
              <button className="btn btn-secondary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="users-table-container">
          {loading ? (
            <div className="loading-state">Loading users...</div>
          ) : users.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>ID</th>
                  <th>Created At</th>
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
                    <td>{user.department || '-'}</td>
                    <td>{user.enrollmentId || user.employeeId || '-'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {user.role === 'teacher' && (
                        <button
                          className={`btn btn-sm ${
                            user.canRegisterStudents ? 'btn-success' : 'btn-secondary'
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
            <div className="no-data">
              <p>No users found matching your filters</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default AdminManageUsers;
