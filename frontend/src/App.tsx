import { useState, useEffect } from 'react';
import { GraduationCap, Activity, BookOpen } from 'lucide-react';
import StatusIndicator from './components/StatusIndicator';
import CourseCard from './components/CourseCard';
import { healthApi, coursesApi } from './services/api';
import type { Course } from './types/api';

function App() {
  const [health, setHealth] = useState<{ status: string } | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch health status and courses in parallel
        const [healthResponse, coursesResponse] = await Promise.allSettled([
          healthApi.check(),
          coursesApi.getAll()
        ]);

        // Handle health response
        if (healthResponse.status === 'fulfilled') {
          setHealth(healthResponse.value);
        } else {
          console.error('Erreur santé API:', healthResponse.reason);
        }

        // Handle courses response
        if (coursesResponse.status === 'fulfilled') {
          setCourses(coursesResponse.value.courses);
        } else {
          console.error('Erreur récupération cours:', coursesResponse.reason);
          setError('Impossible de charger les cours');
        }
      } catch (err) {
        console.error('Erreur générale:', err);
        setError('Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900">
                E-Learning Platform
              </h1>
            </div>
            <nav className="flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">Accueil</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Cours</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Profil</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎓 Plateforme E-Learning Adaptatif
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre plateforme d'apprentissage moderne et personnalisée
          </p>
        </div>

        {/* Status Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Statut du système</h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">API Backend:</span>
            <StatusIndicator 
              isHealthy={health !== null} 
              status={health?.status} 
            />
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Cours disponibles</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600">Chargement des cours...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                className="btn-primary"
                onClick={() => window.location.reload()}
              >
                Réessayer
              </button>
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 E-Learning Platform. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 