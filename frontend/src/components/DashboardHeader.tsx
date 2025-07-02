import { GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { translateRole } from '../utils/roleTranslations';

const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getDisplayName = () => {
    if (user?.firstname && user?.lastname) {
      return `${user.firstname} ${user.lastname}`;
    }
    if (user?.firstname) {
      return user.firstname;
    }
    if (user?.username) {
      return user.username;
    }
    return user?.email.split('@')[0] || 'Utilisateur';
  };

  const getInitials = () => {
    if (user?.firstname && user?.lastname) {
      return `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();
    }
    if (user?.firstname) {
      return user.firstname[0].toUpperCase();
    }
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    return user?.email[0].toUpperCase() || 'U';
  };

  return (
    <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-600 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-8 h-8 text-blue-600 dark:text-gold-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-dark-primary">
              Kevs Academy
            </h1>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {user?.picture_profile ? (
                <img
                  src={user.picture_profile}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-8 h-8 bg-blue-600 dark:bg-gold-600 rounded-full flex items-center justify-center text-white text-sm font-medium transition-colors duration-200 ${user?.picture_profile ? 'hidden' : ''}`}>
                {getInitials()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700 dark:text-dark-primary">{getDisplayName()}</p>
                <p className="text-xs text-gray-500 dark:text-dark-muted">{user?.role && translateRole(user.role)}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 dark:text-dark-secondary hover:text-gray-900 dark:hover:text-gold-400 transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 