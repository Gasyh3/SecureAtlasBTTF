import { Link } from 'react-router-dom';
import { BookOpen, User, LogIn, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  isAuthenticated?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-600 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 dark:bg-gold-600 rounded-lg transition-colors duration-200">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-dark-primary">Kevs Academy</h1>
              <p className="text-xs text-gray-500 dark:text-dark-muted">E-Learning Platform</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="#features"
              className="text-gray-600 dark:text-dark-secondary hover:text-gray-900 dark:hover:text-gold-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Fonctionnalités
            </Link>
            <Link
              to="#about"
              className="text-gray-600 dark:text-dark-secondary hover:text-gray-900 dark:hover:text-gold-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              À propos
            </Link>
            <Link
              to="#contact"
              className="text-gray-600 dark:text-dark-secondary hover:text-gray-900 dark:hover:text-gold-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact
            </Link>
          </nav>

          {/* Theme Toggle & Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-dark-secondary hover:text-gray-900 dark:hover:text-gold-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-gold-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-gold-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 text-gray-600 dark:text-dark-secondary hover:text-gray-900 dark:hover:text-gold-400 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connexion</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-gold-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-gold-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>S'inscrire</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 