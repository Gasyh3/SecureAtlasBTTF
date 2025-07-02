import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  User, 
  Settings, 
  Activity,
  Award,
  TrendingUp,
  Clock 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { healthApi, coursesApi } from '../services/api';
import StatusIndicator from '../components/StatusIndicator';
import CourseCard from '../components/CourseCard';
import type { Course } from '../types/api';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [health, setHealth] = useState<{ status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch health and courses
        const [healthResponse, coursesResponse] = await Promise.allSettled([
          healthApi.check(),
          coursesApi.getAll()
        ]);

        if (healthResponse.status === 'fulfilled') {
          setHealth(healthResponse.value);
        }

        if (coursesResponse.status === 'fulfilled') {
          setCourses(coursesResponse.value.courses);
        }
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-900 dark:to-dark-800 transition-colors duration-200">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-primary mb-2">
            Bonjour {getDisplayName()} ! 👋
          </h1>
          <p className="text-gray-600 dark:text-dark-secondary">
            Bienvenue sur votre tableau de bord. Continuez votre apprentissage.
          </p>
        </div>

        {/* Stats Cards - Spécifiques aux étudiants */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg dark:shadow-gold-500/10 p-6 transition-colors duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-gold-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-dark-muted">Cours disponibles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-primary">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg dark:shadow-gold-500/10 p-6 transition-colors duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-gold-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-dark-muted">Progression</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-primary">0%</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg dark:shadow-gold-500/10 p-6 transition-colors duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="w-8 h-8 text-yellow-600 dark:text-gold-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-dark-muted">Certificats</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-primary">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg dark:shadow-gold-500/10 p-6 transition-colors duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-purple-600 dark:text-gold-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-dark-muted">Temps d'étude</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-primary">0h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg dark:shadow-gold-500/10 p-6 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-6 h-6 text-blue-600 dark:text-gold-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-primary">Profil</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-center">
                {user?.picture_profile ? (
                  <img
                    src={user.picture_profile}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-20 h-20 bg-blue-600 dark:bg-gold-600 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-colors duration-200 ${user?.picture_profile ? 'hidden' : ''}`}>
                  {getInitials()}
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 dark:text-dark-primary">{getDisplayName()}</h3>
                <p className="text-sm text-gray-500 dark:text-dark-muted">{user?.email}</p>
                <p className="text-sm text-blue-600 dark:text-gold-400">Étudiant</p>
                {user?.username && (
                  <p className="text-sm text-gray-500 dark:text-dark-muted">@{user.username}</p>
                )}
              </div>
              <button className="w-full flex items-center justify-center space-x-2 bg-gray-100 dark:bg-dark-600 hover:bg-gray-200 dark:hover:bg-dark-500 text-gray-700 dark:text-dark-secondary px-4 py-2 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                <span>Modifier le profil</span>
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg dark:shadow-gold-500/10 p-6 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-6 h-6 text-green-600 dark:text-gold-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-primary">Statut système</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-dark-secondary">API Backend:</span>
                <StatusIndicator 
                  isHealthy={health !== null} 
                  status={health?.status} 
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-dark-secondary">Authentification:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                  Connecté
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-dark-secondary">Dernière connexion:</span>
                <span className="text-sm text-gray-500 dark:text-dark-muted">
                  {new Date().toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions - Spécifiques aux étudiants */}
          <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg dark:shadow-gold-500/10 p-6 transition-colors duration-200">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-primary mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <Link
                to="/modules"
                className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors block"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-gold-400" />
                  <span className="text-gray-900 dark:text-dark-primary">Parcourir les modules</span>
                </div>
              </Link>
              <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-gold-400" />
                  <span className="text-gray-900 dark:text-dark-primary">Voir les progrès</span>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-purple-600 dark:text-gold-400" />
                  <span className="text-gray-900 dark:text-dark-primary">Mes certificats</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg dark:shadow-gold-500/10 p-6 transition-colors duration-200">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-gold-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-primary">Cours disponibles</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-gold-400"></div>
              <span className="ml-3 text-gray-600 dark:text-dark-secondary">Chargement des cours...</span>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 dark:text-dark-muted mx-auto mb-4" />
              <p className="text-gray-600 dark:text-dark-secondary">Aucun cours disponible pour le moment</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard; 