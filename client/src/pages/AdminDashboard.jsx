import Layout from '../components/Layout';
import Card from '../components/Card';
import { Users, BookOpen, Building, FileText } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <Layout>
      <h1 className="section-title">Admin Dashboard</h1>

      <div className="dashboard-grid">
        <Card
          title="Total Users"
          value="1,245"
          description="Active users in system"
          icon={Users}
        />
        <Card
          title="Departments"
          value="12"
          description="Academic departments"
          icon={Building}
        />
        <Card
          title="Courses"
          value="85"
          description="Active courses"
          icon={BookOpen}
        />
        <Card
          title="Reports"
          value="23"
          description="Pending reports"
          icon={FileText}
        />
      </div>

      <h2 className="section-title">User Management</h2>
      <div className="data-table">
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
    </Layout>
  );
};

export default AdminDashboard;
