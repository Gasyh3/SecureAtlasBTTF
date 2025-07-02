import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  User, 
  Settings, 
  Activity,
  Plus,
  BarChart3,
  Users,
  FileText,
  Video,
  Edit,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { healthApi } from '../services/api';
import { modulesApi } from '../services/modules';
import StatusIndicator from '../components/StatusIndicator';
import type { ModuleList } from '../types/modules';

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState<ModuleList[]>([]);
  const [health, setHealth] = useState<{ status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [moduleStats, setModuleStats] = useState({ total: 0, video: 0, text: 0 });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch health and modules
        const [healthResponse, modulesResponse] = await Promise.allSettled([
          healthApi.check(),
          modulesApi.fetchModules({ skip: 0, limit: 100 }) // Get all modules for stats
        ]);

        if (healthResponse.status === 'fulfilled') {
          setHealth(healthResponse.value);
        }

        if (modulesResponse.status === 'fulfilled') {
          // Vérification de sécurité pour éviter l'erreur undefined.length
          const modulesData = modulesResponse.value;
          if (Array.isArray(modulesData)) {
            setModules(modulesData);
            
            // Calculate module statistics
            const total = modulesData.length;
            const video = modulesData.filter(m => m.type === 'video').length;
            const text = modulesData.filter(m => m.type === 'text').length;
            setModuleStats({ total, video, text });
          } else {
            setModules([]);
            setModuleStats({ total: 0, video: 0, text: 0 });
            console.warn('Modules data is not an array:', modulesData);
          }
        } else {
          setModules([]);
          setModuleStats({ total: 0, video: 0, text: 0 });
          console.error('Failed to fetch modules:', modulesResponse.reason);
        }
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
        setModules([]); // S'assurer que modules reste un array en cas d'erreur
        setModuleStats({ total: 0, video: 0, text: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDisplayName = () => {
    if (user?.firstname && user?.firstname.trim().length > 0 && user?.lastname && user?.lastname.trim().length > 0) {
      return `${user.firstname.trim()} ${user.lastname.trim()}`;
    }
    if (user?.firstname && user?.firstname.trim().length > 0) {
      return user.firstname.trim();
    }
    if (user?.username && user?.username.trim().length > 0) {
      return user.username.trim();
    }
    if (user?.email && user?.email.trim().length > 0) {
      const emailPart = user.email.trim().split('@')[0];
      return emailPart && emailPart.length > 0 ? emailPart : 'Utilisateur';
    }
    return 'Utilisateur';
  };

  const getInitials = () => {
    if (user?.firstname && user?.firstname.trim().length > 0 && user?.lastname && user?.lastname.trim().length > 0) {
      return `${user.firstname.trim()[0]}${user.lastname.trim()[0]}`.toUpperCase();
    }
    if (user?.firstname && user?.firstname.trim().length > 0) {
      return user.firstname.trim()[0].toUpperCase();
    }
    if (user?.username && user?.username.trim().length >= 2) {
      return user.username.trim().slice(0, 2).toUpperCase();
    }
    if (user?.username && user?.username.trim().length > 0) {
      return user.username.trim()[0].toUpperCase();
    }
    if (user?.email && user?.email.trim().length > 0) {
      return user.email.trim()[0].toUpperCase();
    }
    return 'U';
  };

  const recentModules = modules.slice(0, 5);

  // Protection supplémentaire pour s'assurer que recentModules est toujours un array
  const safeRecentModules = Array.isArray(recentModules) ? recentModules : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-900 dark:to-dark-800 transition-colors duration-200">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-primary mb-2">
            Bonjour {getDisplayName()} ! 👨‍🏫
          </h1>
          <p className="text-gray-600 dark:text-dark-secondary">
            Bienvenue sur votre espace instructeur. Gérez vos contenus et suivez vos statistiques.
          </p>
        </div>

        {/* Stats Cards - Spécifiques aux instructeurs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg dark:shadow-gold-500/10 p-6 transition-colors duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-gold-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-dark-muted">Modules créés</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-primary">{moduleStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg dark:shadow-gold-500/10 p-6 transition-colors duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Video className="w-8 h-8 text-red-600 dark:text-gold-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-dark-muted">Modules vidéo</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-primary">{moduleStats.video}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg dark:shadow-gold-500/10 p-6 transition-colors duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="w-8 h-8 text-green-600 dark:text-gold-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-dark-muted">Modules texte</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-primary">{moduleStats.text}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg dark:shadow-gold-500/10 p-6 transition-colors duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-purple-600 dark:text-gold-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-dark-muted">Étudiants actifs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-primary">0</p>
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
                <p className="text-sm text-blue-600 dark:text-gold-400">Instructeur</p>
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

          {/* Quick Actions - Spécifiques aux instructeurs */}
          <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg dark:shadow-gold-500/10 p-6 transition-colors duration-200">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-primary mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <Link
                to="/modules/new"
                className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors block"
              >
                <div className="flex items-center space-x-3">
                  <Plus className="w-5 h-5 text-blue-600 dark:text-gold-400" />
                  <span className="text-gray-900 dark:text-dark-primary">Créer un module</span>
                </div>
              </Link>
              <Link
                to="/modules"
                className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors block"
              >
                <div className="flex items-center space-x-3">
                  <Edit className="w-5 h-5 text-green-600 dark:text-gold-400" />
                  <span className="text-gray-900 dark:text-dark-primary">Gérer mes modules</span>
                </div>
              </Link>
              <button className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-purple-600 dark:text-gold-400" />
                  <span className="text-gray-900 dark:text-dark-primary">Voir les analytics</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <div className="bg-white dark:bg-dark-700 rounded-xl shadow-lg dark:shadow-gold-500/10 p-6 transition-colors duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-gold-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-primary">Mes modules récents</h2>
            </div>
            <Link
              to="/modules"
              className="text-sm text-blue-600 dark:text-gold-400 hover:text-blue-800 dark:hover:text-gold-300 font-medium"
            >
              Voir tous les modules
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-gold-400"></div>
              <span className="ml-3 text-gray-600 dark:text-dark-secondary">Chargement des modules...</span>
            </div>
          ) : safeRecentModules.length > 0 ? (
            <div className="space-y-4">
              {safeRecentModules.map((module) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-600 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-500 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {module.type === 'video' ? (
                        <Video className="w-6 h-6 text-red-500 dark:text-gold-400" />
                      ) : (
                        <FileText className="w-6 h-6 text-blue-500 dark:text-gold-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-dark-primary">{module.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-dark-muted">
                        {module.type === 'video' ? 'Module vidéo' : 'Module texte'} • 
                        Créé le {new Date(module.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/modules/${module.id}`}
                      className="p-2 text-gray-400 dark:text-dark-muted hover:text-blue-600 dark:hover:text-gold-400 rounded-lg transition-colors"
                      title="Voir"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/modules/${module.id}/edit`}
                      className="p-2 text-gray-400 dark:text-dark-muted hover:text-green-600 dark:hover:text-gold-400 rounded-lg transition-colors"
                      title="Éditer"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 dark:text-dark-muted mx-auto mb-4" />
              <p className="text-gray-600 dark:text-dark-secondary mb-4">Aucun module créé pour le moment</p>
              <Link
                to="/modules/new"
                className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-gold-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-gold-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Créer votre premier module</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard; 