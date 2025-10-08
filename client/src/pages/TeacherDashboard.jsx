import Layout from '../components/Layout';
import Card from '../components/Card';
import { BookOpen, Users, Calendar, FileText } from 'lucide-react';

const TeacherDashboard = () => {
  return (
    <Layout>
      <h1 className="section-title">Teacher Dashboard</h1>

      <div className="dashboard-grid">
        <Card
          title="My Classes"
          value="5"
          description="Active classes this semester"
          icon={BookOpen}
        />
        <Card
          title="Total Students"
          value="150"
          description="Students across all classes"
          icon={Users}
        />
        <Card
          title="Pending Grades"
          value="12"
          description="Assignments to grade"
          icon={FileText}
        />
        <Card
          title="Today's Classes"
          value="3"
          description="Scheduled for today"
          icon={Calendar}
        />
      </div>

      <h2 className="section-title">My Classes</h2>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Students</th>
              <th>Schedule</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CS101</td>
              <td>Introduction to Programming</td>
              <td>45</td>
              <td>Mon, Wed, Fri 10:00 AM</td>
              <td>Room 201</td>
            </tr>
            <tr>
              <td>CS201</td>
              <td>Data Structures</td>
              <td>38</td>
              <td>Tue, Thu 2:00 PM</td>
              <td>Room 305</td>
            </tr>
            <tr>
              <td>CS301</td>
              <td>Database Systems</td>
              <td>32</td>
              <td>Mon, Wed 3:00 PM</td>
              <td>Lab 102</td>
            </tr>
            <tr>
              <td>CS401</td>
              <td>Software Engineering</td>
              <td>25</td>
              <td>Tue, Thu 10:00 AM</td>
              <td>Room 401</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
