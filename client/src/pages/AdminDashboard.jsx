import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Users, BookOpen, Building, FileText } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";


const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

const navigate = useNavigate();

const handleLogout = () => {
  if (!window.confirm("Are you sure you want to logout?")) return;

  localStorage.removeItem("token");   // remove auth token
  localStorage.removeItem("user");    // optional (if stored)

  navigate("/login");                 // redirect
};



  // 🕐 Simulate loading state for 1 second
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>
        {`
        :root {
          --sidebar-width: 250px;
          --sidebar-collapsed: 80px;
        }

        body {
          margin: 0;
          height: 100vh;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #f3e5f5, #e0f7fa);
          color: #333;
          overflow: hidden;
        }

        /* Layout */
        .dashboard-container {
          display: flex;
          height: 100vh;
          width: 100%;
        }

        /* Scrollable main content */
        .main-content {
          flex-grow: 1;
          padding: 24px 36px;
          transition: margin-left 0.36s cubic-bezier(.2,.9,.2,1);
          overflow-y: auto;
          height: 100vh;
          scrollbar-width: thin;
          scrollbar-color: #b39ddb #f4f4f4;
        }

        .main-content::-webkit-scrollbar {
          width: 8px;
        }

        .main-content::-webkit-scrollbar-thumb {
          background: #b39ddb;
          border-radius: 8px;
        }

        .main-content::-webkit-scrollbar-thumb:hover {
          background: #9575cd;
        }

        /* Header */
        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #4a148c;
        }

        .section-title {
          font-weight: 700;
          color: #4a148c;
          margin-bottom: 1rem;
        }

        /* Skeleton Loading */
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

        /* Dashboard Cards */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
          margin-bottom: 24px;
        }

        .dashboard-card {
          background: linear-gradient(135deg, #ffffff, #f6f0fb);
          border-radius: 12px;
          padding: 18px;
          text-align: center;
          box-shadow: 0 6px 18px rgba(70,60,90,0.06);
          transition: all 0.3s ease;
        }

        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(70,60,90,0.12);
        }

        .card-icon {
          color: #6a1b9a;
          margin-bottom: 8px;
        }

        /* Data Table */
        .data-table {
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(70,60,90,0.04);
          margin-bottom: 20px;
        }

        .data-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          background: #6a1b9a;
          color: #fff;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }

        .data-table td {
          padding: 12px;
          border-bottom: 1px solid #f1edf7;
          color: #333;
        }

        .data-table tr:hover td {
          background: #faf1ff;
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 16px;
          }

          .page-title {
            font-size: 20px;
          }

          .dashboard-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
        }
        `}
      </style>

      <div className="dashboard-container">
        {/* Sticky Sidebar */}
        <Sidebar onToggle={setSidebarOpen} />

        {/* Scrollable Dashboard Content */}
        <div
          className="main-content"
          style={{
            marginLeft: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed)",
          }}
        >
          {loading ? (
            <>
              {/* Skeleton Header */}
              <div className="skeleton mb-4" style={{ height: "30px", width: "250px" }}></div>

              {/* Skeleton Cards */}
              <div className="dashboard-grid mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton" style={{ height: "130px" }}></div>
                ))}
              </div>

              {/* Skeleton Table */}
              <div className="skeleton" style={{ height: "300px", borderRadius: "10px" }}></div>
            </>
          ) : (
            <>
              {/* Dashboard Header */}
         <div className="dashboard-header">
  <h1 className="page-title">Admin Dashboard</h1>

  <button
    onClick={handleLogout}
    style={{
      padding: "8px 16px",
      background: "#d32f2f",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background 0.3s"
    }}
    onMouseEnter={(e) => (e.target.style.background = "#b71c1c")}
    onMouseLeave={(e) => (e.target.style.background = "#d32f2f")}
  >
    Logout
  </button>
</div>


              {/* Dashboard Cards */}
              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <Users className="card-icon" size={36} />
                  <h5>Total Users</h5>
                  <p style={{ color: "#666" }}>1,245 Active users</p>
                </div>

                <div className="dashboard-card">
                  <Building className="card-icon" size={36} />
                  <h5>Departments</h5>
                  <p style={{ color: "#666" }}>12 Academic departments</p>
                </div>

                <div className="dashboard-card">
                  <BookOpen className="card-icon" size={36} />
                  <h5>Courses</h5>
                  <p style={{ color: "#666" }}>85 Active courses</p>
                </div>

                <div className="dashboard-card">
                  <FileText className="card-icon" size={36} />
                  <h5>Reports</h5>
                  <p style={{ color: "#666" }}>23 Pending reports</p>
                </div>
              </div>

              {/* Data Table */}
              <h2 className="section-title">User Management Overview</h2>
              <div className="data-table table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>John Smith</td>
                      <td>john.smith@college.edu</td>
                      <td>Teacher</td>
                      <td>Computer Science</td>
                      <td>Active</td>
                    </tr>
                    <tr>
                      <td>Sarah Johnson</td>
                      <td>sarah.j@college.edu</td>
                      <td>Teacher</td>
                      <td>Mathematics</td>
                      <td>Active</td>
                    </tr>
                    <tr>
                      <td>Michael Brown</td>
                      <td>m.brown@college.edu</td>
                      <td>Student</td>
                      <td>Engineering</td>
                      <td>Active</td>
                    </tr>
                    <tr>
                      <td>Emily Davis</td>
                      <td>emily.d@college.edu</td>
                      <td>Teacher</td>
                      <td>Physics</td>
                      <td>Active</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
