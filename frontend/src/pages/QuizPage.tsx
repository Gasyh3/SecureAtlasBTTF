import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getModuleById } from '../api/modules';
import { fetchQuiz, submitQuiz, getScoreColor, getScoreMessage } from '../api/quiz';
import { Module } from '../types/modules';
import { Quiz, QuizResult, Answer, QuestionResult } from '../types/quiz';
import QuestionItem from '../components/QuestionItem';

const QuizPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  // États principaux
  const [module, setModule] = useState<Module | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // États du quiz
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!moduleId) {
        setError('ID du module manquant');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Charger le module et le quiz en parallèle
        const [moduleData, quizData] = await Promise.all([
          getModuleById(parseInt(moduleId)),
          fetchQuiz(parseInt(moduleId))
        ]);

        setModule(moduleData);
        setQuiz(quizData);
      } catch (err: any) {
        console.error('Erreur lors du chargement:', err);
        
        if (err.response?.status === 404) {
          if (err.response?.data?.detail?.includes('quiz')) {
            setError('Aucun quiz n\'est disponible pour ce module.');
          } else {
            setError('Module non trouvé.');
          }
        } else {
          setError(err.response?.data?.detail || 'Erreur lors du chargement des données');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [moduleId]);

  const handleAnswerChange = (questionId: number, choiceId: number) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.question_id === questionId);
      if (existing) {
        return prev.map(a => 
          a.question_id === questionId 
            ? { ...a, choice_id: choiceId }
            : a
        );
      } else {
        return [...prev, { question_id: questionId, choice_id: choiceId }];
      }
    });
  };

  const handleSubmit = async () => {
    if (!quiz || !moduleId) return;

    try {
      setSubmitting(true);
      const quizResult = await submitQuiz(parseInt(moduleId), answers);
      setResult(quizResult);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Erreur lors de la soumission:', err);
      setError(err.response?.data?.detail || 'Erreur lors de la soumission du quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers([]);
    setIsSubmitted(false);
    setResult(null);
    setError('');
  };

  const getAnswerForQuestion = (questionId: number): number | null => {
    return answers.find(a => a.question_id === questionId)?.choice_id || null;
  };

  const getResultForQuestion = (questionId: number): QuestionResult | undefined => {
    return result?.details.find(d => d.question_id === questionId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-primary flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-gold-400 mx-auto" />
          <p className="mt-2 text-gray-600 dark:text-dark-secondary">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-primary transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/modules')}
              className="inline-flex items-center text-blue-600 dark:text-gold-400 hover:text-blue-800 dark:hover:text-gold-300 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux modules
            </button>
          </div>

          {/* Erreur */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600 rounded-lg p-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
                  Une erreur s'est produite
                </h3>
                <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => moduleId && navigate(`/modules/${moduleId}`)}
                className="px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
              >
                Retour au module
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!module || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-primary flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <p className="text-gray-500 dark:text-dark-muted">Données non disponibles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-dark-muted mb-4">
            <button
              onClick={() => navigate('/modules')}
              className="hover:text-blue-600 dark:hover:text-gold-400 transition-colors"
            >
              Modules
            </button>
            <span>›</span>
            <button
              onClick={() => navigate(`/modules/${moduleId}`)}
              className="hover:text-blue-600 dark:hover:text-gold-400 transition-colors"
            >
              {module.title}
            </button>
            <span>›</span>
            <span className="text-gray-900 dark:text-dark-primary">Quiz</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-primary mb-2">
                {quiz.title}
              </h1>
              <p className="text-gray-600 dark:text-dark-secondary">
                {quiz.questions.length} question{quiz.questions.length > 1 ? 's' : ''}
              </p>
            </div>
            
            <button
              onClick={() => navigate(`/modules/${moduleId}`)}
              className="px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-dark-secondary rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
            >
              ← Retour au module
            </button>
          </div>
        </div>

        {/* Résultats */}
        {isSubmitted && result && (
          <div className="mb-8 p-6 bg-white dark:bg-dark-800 rounded-lg shadow-sm dark:shadow-gold-500/10 border border-gray-200 dark:border-dark-600">
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                result.score_percentage >= 70 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              }`}>
                {result.score_percentage >= 70 ? (
                  <CheckCircle className="h-8 w-8" />
                ) : (
                  <AlertCircle className="h-8 w-8" />
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-primary mb-2">
                Quiz terminé !
              </h2>
              
              <div className="space-y-2">
                <p className={`text-3xl font-bold ${getScoreColor(result.score_percentage)}`}>
                  {result.score_percentage}%
                </p>
                <p className="text-gray-600 dark:text-dark-secondary">
                  {result.correct} sur {result.total} bonnes réponses
                </p>
                <p className={`font-medium ${getScoreColor(result.score_percentage)}`}>
                  {getScoreMessage(result.score_percentage)}
                </p>
              </div>
              
              <button
                onClick={handleRetry}
                className="mt-4 px-6 py-2 bg-blue-600 dark:bg-gold-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-gold-700 transition-colors"
              >
                Recommencer le quiz
              </button>
            </div>
          </div>
        )}

        {/* Instructions (avant soumission) */}
        {!isSubmitted && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400 dark:text-blue-300 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Instructions
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Répondez à toutes les questions puis cliquez sur "Soumettre le quiz" pour voir vos résultats.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="bg-white dark:bg-dark-800 rounded-lg shadow-sm dark:shadow-gold-500/10 border border-gray-200 dark:border-dark-600">
              <div className="p-4 border-b border-gray-200 dark:border-dark-600">
                <h3 className="text-lg font-medium text-gray-900 dark:text-dark-primary">
                  Question {index + 1} sur {quiz.questions.length}
                </h3>
              </div>
              <div className="p-0">
                <QuestionItem
                  question={question}
                  selectedChoiceId={getAnswerForQuestion(question.id)}
                  onAnswerChange={handleAnswerChange}
                  result={getResultForQuestion(question.id)}
                  isReviewMode={isSubmitted}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        {!isSubmitted && (
          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-dark-secondary">
              {answers.length} sur {quiz.questions.length} questions répondues
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={submitting || answers.length === 0}
              className="px-6 py-3 bg-blue-600 dark:bg-gold-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-gold-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Soumission...
                </>
              ) : (
                'Soumettre le quiz'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage; 