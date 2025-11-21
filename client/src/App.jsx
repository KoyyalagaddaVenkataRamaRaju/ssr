
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState ,useEffect} from 'react';
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrincipalDashboard from './pages/PrincipalDashboard';
import AdminRegisterUser from './pages/AdminRegisterUser';
import AdminManageUsers from './pages/AdminManageUsers';
import TeacherRegisterStudent from './pages/TeacherRegisterStudent';
import Navbar from './components/Navbar';
import AdminRegisterDepartment from './pages/AdminRegisterDepartment';
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import AdminHeroCarousel from "./pages/AdminHeroCarousel";
import Placements from "./components/Placements";
import DepartmentPage from './pages/AdminRegisterBatchPage';
import AttendanceSidebar from './components/AttendanceSidebar';
import AdminRegisterBatchPage from './pages/AdminRegisterBatchPage';
import FeeManagement from './pages/AdminFeeManagement';
import StudentFeeDashboard from './pages/StudentFeeDashboard';
import AboutUs from './pages/AboutUs';
import VisionMission from './components/VisionMission';
import ChairmanMessage from './components/ChairmanMessage';
import Department from './pages/DepartmentPage';
import AdminRecruiters from './pages/AdminRecruiters';
import AttendanceReport from './pages/AttendanceReport';
import TakeAttendance from './pages/TakeAttendance';
import { getCurrentUserId } from './services/authService';
import TeacherBranchStudents from './pages/SectionStudents';
import TeacherClasses from './pages/TeacherClasses';
import TeacherProfile from './pages/TeacherProfile';


const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="btn-loading"
          style={{ width: "40px", height: "40px" }}
        ></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  const [teacherId, setTeacherId] = useState("");

useEffect(() => {
  const id = getCurrentUserId();
  setTeacherId(id);
  console.log("Fetched Teacher ID:", id);
}, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/placements" element={<Placements/>}/>
          <Route path='/about' element={<AboutUs/>}/>
          <Route path='/about/vision-mission' element={<VisionMission/>}/>
          <Route path='/about/chairman-message' element={<ChairmanMessage/>}/>
          <Route path="/departments/:id" element={<Department />} />


          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
           <Route
            path="/teacher/profile"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherProfile/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/students"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherBranchStudents />
              </ProtectedRoute>
            }
          />
 <Route
            path="/teacher/classes"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherClasses />
              </ProtectedRoute>
            }
          />
            <Route
            path="/teacher/attendance/"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TakeAttendance teacherId={teacherId}/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/principal/dashboard"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <PrincipalDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/register-user"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminRegisterUser />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/manage-users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminManageUsers />
              </ProtectedRoute>
            }
          />

           <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin","teacher"]}>
                <AttendanceReport/>
              </ProtectedRoute>
            }
          />



          <Route
            path="/admin/register-department"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRegisterDepartment />
              </ProtectedRoute>
            }
          />
          <Route
          path='/admin/fees'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <FeeManagement/>
            </ProtectedRoute>
          }
          />
          <Route
          path='/student/payfees'
          element={
            <ProtectedRoute >
              <StudentFeeDashboard/>
            </ProtectedRoute>
          }
          />

          <Route
            path="/admin/batches"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRegisterBatchPage />
              </ProtectedRoute>
            }
          /> 


          <Route
            path="/teacher/register-student"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherRegisterStudent />
              </ProtectedRoute>
            }
          />



           <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AttendanceSidebar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/hero-carousel"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminHeroCarousel/>
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/recruiters'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRecruiters/>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
