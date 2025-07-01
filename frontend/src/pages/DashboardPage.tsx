import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  User, 
  LogOut, 
  Settings, 
  Activity,
  Calendar,
  Award,
  TrendingUp 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { healthApi, coursesApi } from '../services/api';
import StatusIndicator from '../components/StatusIndicator';
import CourseCard from '../components/CourseCard';
import { translateRole } from '../utils/roleTranslations';
import type { Course } from '../types/api';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                E-Learning Platform
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
                <div className={`w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium ${user?.picture_profile ? 'hidden' : ''}`}>
                  {getInitials()}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">{getDisplayName()}</p>
                  <p className="text-xs text-gray-500">{user?.role && translateRole(user.role)}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour {getDisplayName()} ! 👋
          </h1>
          <p className="text-gray-600">
            Bienvenue sur votre tableau de bord. Continuez votre apprentissage.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Cours disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Progression</p>
                <p className="text-2xl font-bold text-gray-900">0%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Certificats</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Temps d'étude</p>
                <p className="text-2xl font-bold text-gray-900">0h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Profil</h2>
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
                <div className={`w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold ${user?.picture_profile ? 'hidden' : ''}`}>
                  {getInitials()}
                </div>
              </div>
                             <div className="text-center">
                 <h3 className="font-semibold text-gray-900">{getDisplayName()}</h3>
                 <p className="text-sm text-gray-500">{user?.email}</p>
                 <p className="text-sm text-blue-600">{user?.role && translateRole(user.role)}</p>
                 {user?.username && (
                   <p className="text-sm text-gray-500">@{user.username}</p>
                 )}
               </div>
              <button className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                <span>Modifier le profil</span>
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Statut système</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">API Backend:</span>
                <StatusIndicator 
                  isHealthy={health !== null} 
                  status={health?.status} 
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Authentification:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connecté
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Dernière connexion:</span>
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-900">Parcourir les cours</span>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-gray-900">Voir les progrès</span>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900">Mes certificats</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Cours disponibles</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Chargement des cours...</span>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun cours disponible pour le moment</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 