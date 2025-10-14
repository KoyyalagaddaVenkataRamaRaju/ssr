import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import  AdminRegisterDepartment   from './pages/AdminRegisterDepartment';

const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="btn-loading" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navbar/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/principal/dashboard"
            element={
              <ProtectedRoute allowedRoles={['principal']}>
                <PrincipalDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/register-user"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRegisterUser />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/manage-users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminManageUsers />
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
            path="/teacher/register-student"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherRegisterStudent />
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
