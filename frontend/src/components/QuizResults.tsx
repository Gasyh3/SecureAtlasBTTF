import React, { useState } from 'react';
import { QuizResult } from '../types/quiz';
import { formatTime, getScoreColor, getScoreMessage } from '../api/quiz';
import QuestionComponent from './QuestionComponent';

interface QuizResultsProps {
  result: QuizResult;
  onRetry?: () => void;
  onClose?: () => void;
  timeSpent?: number;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  result,
  onRetry,
  onClose,
  timeSpent = 0
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);

  const scoreColor = getScoreColor(result.score_percentage);
  const scoreMessage = getScoreMessage(result.score_percentage);

  const correctAnswers = result.details.filter(d => d.is_correct);
  const incorrectAnswers = result.details.filter(d => !d.is_correct);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* En-tête des résultats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz terminé !
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            {scoreMessage}
          </p>
        </div>

        {/* Score principal */}
        <div className="mb-6">
          <div className={`text-6xl font-bold mb-2 ${scoreColor}`}>
            {result.score_percentage}%
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {result.correct} sur {result.total} questions correctes
          </p>
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {result.correct}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              Bonnes réponses
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {result.total - result.correct}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">
              Mauvaises réponses
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatTime(timeSpent)}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Temps passé
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {showDetails ? 'Masquer les détails' : 'Voir les détails'}
          </button>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
            >
              Refaire le quiz
            </button>
          )}
          
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Fermer
            </button>
          )}
        </div>
      </div>

      {/* Détails des réponses */}
      {showDetails && (
        <div className="space-y-4">
          {/* Résumé des réponses */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Résumé des réponses
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bonnes réponses */}
              <div>
                <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                  ✅ Bonnes réponses ({correctAnswers.length})
                </h3>
                <div className="space-y-2">
                  {correctAnswers.map((answer, _) => (
                    <button
                      key={answer.question_id}
                      onClick={() => setSelectedQuestionIndex(result.details.findIndex(d => d.question_id === answer.question_id))}
                      className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <div className="font-medium text-green-800 dark:text-green-200 truncate">
                        Question {result.details.findIndex(d => d.question_id === answer.question_id) + 1}: {answer.question_text}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mauvaises réponses */}
              <div>
                <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                  ❌ Mauvaises réponses ({incorrectAnswers.length})
                </h3>
                <div className="space-y-2">
                  {incorrectAnswers.map((answer, _) => (
                    <button
                      key={answer.question_id}
                      onClick={() => setSelectedQuestionIndex(result.details.findIndex(d => d.question_id === answer.question_id))}
                      className="w-full text-left p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <div className="font-medium text-red-800 dark:text-red-200 truncate">
                        Question {result.details.findIndex(d => d.question_id === answer.question_id) + 1}: {answer.question_text}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Détail de la question sélectionnée */}
          {selectedQuestionIndex !== null && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Question {selectedQuestionIndex + 1} - Détail
                </h3>
                <button
                  onClick={() => setSelectedQuestionIndex(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <QuestionComponent
                question={{
                  id: result.details[selectedQuestionIndex].question_id,
                  text: result.details[selectedQuestionIndex].question_text,
                  choices: [
                    {
                      id: result.details[selectedQuestionIndex].selected_choice_id,
                      text: result.details[selectedQuestionIndex].selected_choice_text,
                      order: 0
                    },
                    {
                      id: result.details[selectedQuestionIndex].correct_choice_id,
                      text: result.details[selectedQuestionIndex].correct_choice_text,
                      order: 1
                    }
                  ]
                }}
                selectedChoiceId={result.details[selectedQuestionIndex].selected_choice_id}
                onAnswerSelect={() => {}}
                isReviewMode={true}
                questionResult={result.details[selectedQuestionIndex]}
              />
            </div>
          )}

          {/* Liste complète des questions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Toutes les questions
            </h3>
            
            <div className="space-y-3">
              {result.details.map((detail, index) => (
                <div
                  key={detail.question_id}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    detail.is_correct
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Question {index + 1}
                        </span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          detail.is_correct
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                        }`}>
                          {detail.is_correct ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        {detail.question_text}
                      </p>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <strong>Votre réponse:</strong> {detail.selected_choice_text}
                        </div>
                        {!detail.is_correct && (
                          <div>
                            <strong>Bonne réponse:</strong> {detail.correct_choice_text}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      {detail.is_correct ? (
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizResults; 