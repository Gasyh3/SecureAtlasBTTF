import React, { useState, useEffect } from 'react';
import { QuizComponentProps, Quiz, Answer, QuizState } from '../types/quiz';
import { getQuizByModule, submitQuiz, formatTime } from '../api/quiz';
import QuestionComponent from './QuestionComponent';
import QuizResults from './QuizResults';
const QuizTaker: React.FC<QuizComponentProps> = ({ moduleId, onComplete }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: [],
    isSubmitted: false,
    result: null,
    timeSpent: 0
  });
  const [startTime, setStartTime] = useState<number>(0);

  // Timer pour calculer le temps passé
  useEffect(() => {
    if (!quizState.isSubmitted && quiz) {
      const interval = setInterval(() => {
        setQuizState(prev => ({
          ...prev,
          timeSpent: Math.floor((Date.now() - startTime) / 1000)
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [quizState.isSubmitted, quiz, startTime]);

  // Charger le quiz au montage du composant
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const quizData = await getQuizByModule(moduleId);
        setQuiz(quizData);
        setStartTime(Date.now());
        
        // Initialiser les réponses vides
        const initialAnswers: Answer[] = quizData.questions.map((q: any) => ({
          question_id: q.id,
          choice_id: 0
        }));
        setQuizState(prev => ({ ...prev, answers: initialAnswers }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du quiz');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [moduleId]);

  const handleAnswerSelect = (questionId: number, choiceId: number) => {
    setQuizState(prev => ({
      ...prev,
      answers: prev.answers.map(answer =>
        answer.question_id === questionId
          ? { ...answer, choice_id: choiceId }
          : answer
      )
    }));
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    
    if (quizState.currentQuestionIndex < quiz.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  const handlePreviousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    try {
      setLoading(true);
      
      // Filtrer les réponses vides (choice_id = 0)
      const validAnswers = quizState.answers.filter(answer => answer.choice_id !== 0);
      
      const response = await submitQuiz(moduleId, validAnswers);
      const result = response.data;
      
      setQuizState(prev => ({
        ...prev,
        isSubmitted: true,
        result
      }));

      if (onComplete) {
        onComplete(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la soumission du quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: quiz?.questions.map(q => ({ question_id: q.id, choice_id: 0 })) || [],
      isSubmitted: false,
      result: null,
      timeSpent: 0
    });
    setStartTime(Date.now());
  };

  const getCurrentAnswer = (questionId: number): number | null => {
    const answer = quizState.answers.find(a => a.question_id === questionId);
    return answer && answer.choice_id !== 0 ? answer.choice_id : null;
  };

  const getAnsweredQuestionsCount = (): number => {
    return quizState.answers.filter(answer => answer.choice_id !== 0).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
        <span className="ml-4 text-gray-700 dark:text-gray-300">Chargement du quiz...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Aucun quiz trouvé pour ce module.</p>
      </div>
    );
  }

  // Affichage des résultats
  if (quizState.isSubmitted && quizState.result) {
    return (
      <QuizResults
        result={quizState.result}
        onRetry={handleRetryQuiz}
        timeSpent={quizState.timeSpent}
      />
    );
  }

  const currentQuestion = quiz.questions[quizState.currentQuestionIndex];
  const currentAnswer = getCurrentAnswer(currentQuestion.id);
  const answeredCount = getAnsweredQuestionsCount();
  const progress = (quizState.currentQuestionIndex + 1) / quiz.questions.length * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* En-tête du quiz */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {quiz.title}
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Temps: {formatTime(quizState.timeSpent)}
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Question {quizState.currentQuestionIndex + 1} sur {quiz.questions.length}</span>
            <span>{answeredCount}/{quiz.questions.length} répondues</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gold-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Navigation par points */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quiz.questions.map((_, index) => {
            const isAnswered = quizState.answers[index]?.choice_id !== 0;
            const isCurrent = index === quizState.currentQuestionIndex;
            
            return (
              <button
                key={index}
                onClick={() => setQuizState(prev => ({ ...prev, currentQuestionIndex: index }))}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-gold-500 text-white'
                    : isAnswered
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question actuelle */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <QuestionComponent
          question={currentQuestion}
          selectedChoiceId={currentAnswer}
          onAnswerSelect={handleAnswerSelect}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousQuestion}
          disabled={quizState.currentQuestionIndex === 0}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
        >
          ← Précédent
        </button>

        <div className="flex gap-4">
          {quizState.currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={answeredCount === 0}
              className="px-6 py-2 bg-gold-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-600 transition-colors font-medium"
            >
              Terminer le quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
            >
              Suivant →
            </button>
          )}
        </div>
      </div>

      {/* Avertissement si des questions ne sont pas répondues */}
      {answeredCount < quiz.questions.length && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
            💡 Vous pouvez soumettre le quiz même si toutes les questions ne sont pas répondues.
            Les questions sans réponse seront comptées comme incorrectes.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizTaker; 