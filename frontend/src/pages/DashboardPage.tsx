import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import StudentDashboard from '../components/StudentDashboard';
import InstructorDashboard from '../components/InstructorDashboard';
import AdminDashboard from '../components/AdminDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'instructor':
        return <InstructorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />; // Default to student dashboard
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-900 dark:to-dark-800 transition-colors duration-200">
      <DashboardHeader />
      {renderDashboardByRole()}
    </div>
  );
};

export default DashboardPage; 