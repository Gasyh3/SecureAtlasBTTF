import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getModuleById } from '../api/modules';
import { Module } from '../types/modules';
import { QuizResult } from '../types/quiz';
import QuizTaker from '../components/QuizTaker';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const QuizPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const loadModule = async () => {
      if (!moduleId) {
        setError('ID du module manquant');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const moduleData = await getModuleById(parseInt(moduleId));
        setModule(moduleData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du module');
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, [moduleId]);

  const handleQuizComplete = (result: QuizResult) => {
    setQuizCompleted(true);
    
    // Afficher une notification avec le score
    if (result.score_percentage >= 80) {
      toast.success(`Excellent ! Vous avez obtenu ${result.score_percentage}%`);
    } else if (result.score_percentage >= 60) {
      toast.success(`Bien joué ! Vous avez obtenu ${result.score_percentage}%`);
    } else {
      toast.info(`Quiz terminé ! Score: ${result.score_percentage}%`);
    }
  };

  const handleBackToModule = () => {
    if (moduleId) {
      navigate(`/modules/${moduleId}`);
    } else {
      navigate('/modules');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
            <span className="ml-4 text-gray-700 dark:text-gray-300">Chargement du module...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Erreur
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleBackToModule}
                className="px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
              >
                Retour aux modules
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Module non trouvé.</p>
            <button
              onClick={handleBackToModule}
              className="mt-4 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
            >
              Retour aux modules
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* En-tête de la page */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <button
              onClick={() => navigate('/modules')}
              className="hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
            >
              Modules
            </button>
            <span>›</span>
            <button
              onClick={handleBackToModule}
              className="hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
            >
              {module.title}
            </button>
            <span>›</span>
            <span className="text-gray-900 dark:text-white">Quiz</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Quiz: {module.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Testez vos connaissances sur ce module
              </p>
            </div>
            
            <button
              onClick={handleBackToModule}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ← Retour au module
            </button>
          </div>
        </div>

        {/* Instructions */}
        {!quizCompleted && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Instructions
                </h3>
                <div className="text-sm text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                  <p>• Lisez attentivement chaque question avant de répondre</p>
                  <p>• Vous pouvez naviguer entre les questions avec les boutons ou les numéros</p>
                  <p>• Votre progression est sauvegardée automatiquement</p>
                  <p>• Vous pouvez soumettre le quiz même si toutes les questions ne sont pas répondues</p>
                  <p>• Une fois soumis, vous verrez vos résultats détaillés</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Composant Quiz */}
        {moduleId && (
          <QuizTaker
            moduleId={parseInt(moduleId)}
            onComplete={handleQuizComplete}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default QuizPage; 