import { GraduationCap, Home, Users, BookOpen, Calendar, FileText, Settings, UserPlus, PlusSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    const commonItems = [
      { name: 'Dashboard', icon: Home, path: `/${user?.role}/dashboard` },
    ];

    switch (user?.role) {
      case 'principal':
        return [
          ...commonItems,
          { name: 'Overview', icon: FileText, path: '#' },
          { name: 'Staff Management', icon: Users, path: '#' },
          { name: 'Reports', icon: FileText, path: '#' },
          { name: 'Settings', icon: Settings, path: '#' },
        ];
      case 'admin':
        return [
          ...commonItems,
          { name: 'Register User', icon: UserPlus, path: '/admin/register-user' },
          { name: 'Manage Users', icon: Users, path: '/admin/manage-users' },
          { name: 'Register Department', icon: PlusSquare, path: '/admin/register-department' }, // Added Department Registration
          { name: 'Departments', icon: BookOpen, path: '#' },
          { name: 'Reports', icon: FileText, path: '#' },
          { name: 'Settings', icon: Settings, path: '#' },
        ];
      case 'teacher':
        const teacherItems = [
          ...commonItems,
          { name: 'My Classes', icon: BookOpen, path: '#' },
          { name: 'Students', icon: Users, path: '#' },
          { name: 'Attendance', icon: Calendar, path: '#' },
          { name: 'Grades', icon: FileText, path: '#' },
        ];

        if (user?.canRegisterStudents) {
          teacherItems.splice(2, 0, { name: 'Register Student', icon: UserPlus, path: '/teacher/register-student' });
        }

        return teacherItems;
      case 'student':
        return [
          ...commonItems,
          { name: 'My Courses', icon: BookOpen, path: '#' },
          { name: 'Grades', icon: FileText, path: '#' },
          { name: 'Schedule', icon: Calendar, path: '#' },
          { name: 'Profile', icon: Users, path: '#' },
        ];
      default:
        return commonItems;
    }
  };

  const navItems = getNavigationItems();

  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-header">
        <GraduationCap className="sidebar-logo" size={40} />
        <h2 className="sidebar-title">SSR</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;