import Layout from '../components/Layout';
import Card from '../components/Card';
import { BookOpen, Calendar, FileText, Award } from 'lucide-react';

const StudentDashboard = () => {
  return (
    <Layout>
      <h1 className="section-title">Student Dashboard</h1>

      <div className="dashboard-grid">
        <Card
          title="Enrolled Courses"
          value="6"
          description="Active courses this semester"
          icon={BookOpen}
        />
        <Card
          title="Attendance"
          value="92%"
          description="Overall attendance rate"
          icon={Calendar}
        />
        <Card
          title="Assignments"
          value="4"
          description="Pending submissions"
          icon={FileText}
        />
        <Card
          title="GPA"
          value="3.8"
          description="Current semester GPA"
          icon={Award}
        />
      </div>

      <h2 className="section-title">My Courses</h2>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Instructor</th>
              <th>Credits</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CS101</td>
              <td>Introduction to Programming</td>
              <td>Dr. John Smith</td>
              <td>3</td>
              <td>A</td>
            </tr>
            <tr>
              <td>MATH201</td>
              <td>Calculus II</td>
              <td>Dr. Sarah Johnson</td>
              <td>4</td>
              <td>A-</td>
            </tr>
            <tr>
              <td>ENG101</td>
              <td>English Composition</td>
              <td>Prof. Michael Brown</td>
              <td>3</td>
              <td>B+</td>
            </tr>
            <tr>
              <td>PHY101</td>
              <td>Physics I</td>
              <td>Dr. Emily Davis</td>
              <td>4</td>
              <td>A</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
