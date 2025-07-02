import React from 'react';
import { Question, QuestionResult } from '../types/quiz';

interface QuestionItemProps {
  question: Question;
  selectedChoiceId?: number | null;
  onAnswerChange: (questionId: number, choiceId: number) => void;
  result?: QuestionResult;
  isReviewMode?: boolean;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ 
  question, 
  selectedChoiceId = null,
  onAnswerChange, 
  result,
  isReviewMode = false
}) => {
  const handleChoiceChange = (choiceId: number): void => {
    if (!isReviewMode && !result) {
      onAnswerChange(question.id, choiceId);
    }
  };

  const getQuestionStyle = (): string => {
    const baseStyle = 'border-2 rounded-lg transition-colors duration-200';
    
    if (!result) {
      return `${baseStyle} border-gray-200 dark:border-dark-600`;
    }
    
    return result.is_correct 
      ? `${baseStyle} border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/10`
      : `${baseStyle} border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/10`;
  };

  const getChoiceStyle = (choiceId: number): string => {
    const baseStyle = 'flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200';
    
    if (result) {
      // Mode résultat - montrer les bonnes/mauvaises réponses
      if (choiceId === result.correct_choice_id) {
        return `${baseStyle} bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-600 text-green-800 dark:text-green-200`;
      }
      if (choiceId === result.selected_choice_id && choiceId !== result.correct_choice_id) {
        return `${baseStyle} bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-600 text-red-800 dark:text-red-200`;
      }
      return `${baseStyle} bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 text-gray-600 dark:text-dark-secondary`;
    }
    
    // Mode normal - montrer la sélection actuelle
    if (selectedChoiceId === choiceId) {
      return `${baseStyle} bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-200`;
    }
    
    return `${baseStyle} hover:bg-gray-100 dark:hover:bg-dark-600 border border-gray-200 dark:border-dark-600 text-gray-700 dark:text-dark-primary`;
  };

  const getChoiceIcon = (choiceId: number): string => {
    if (result) {
      if (choiceId === result.correct_choice_id) {
        return '✓';
      }
      if (choiceId === result.selected_choice_id && choiceId !== result.correct_choice_id) {
        return '✗';
      }
    }
    return selectedChoiceId === choiceId ? '●' : '○';
  };

  const getChoiceIconColor = (choiceId: number): string => {
    if (result) {
      if (choiceId === result.correct_choice_id) {
        return 'text-green-600 dark:text-green-400';
      }
      if (choiceId === result.selected_choice_id && choiceId !== result.correct_choice_id) {
        return 'text-red-600 dark:text-red-400';
      }
    }
    return selectedChoiceId === choiceId 
      ? 'text-blue-600 dark:text-blue-400' 
      : 'text-gray-400 dark:text-dark-muted';
  };

  return (
    <div className={`p-6 mb-6 ${getQuestionStyle()}`}>
      {/* En-tête de la question */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-primary leading-6">
          {question.text}
        </h3>
        {result && (
          <div className={`ml-4 flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium ${
            result.is_correct 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
              : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}>
            {result.is_correct ? 'Correct' : 'Incorrect'}
          </div>
        )}
      </div>
      
      {/* Choix de réponses */}
      <div className="space-y-3">
        {question.choices.map((choice) => (
          <div
            key={choice.id}
            className={getChoiceStyle(choice.id)}
            onClick={() => handleChoiceChange(choice.id)}
          >
            <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border-2 ${
              result ? 'border-current' : 'border-current'
            }`}>
              <span className={`text-sm font-bold ${getChoiceIconColor(choice.id)}`}>
                {getChoiceIcon(choice.id)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-5">
                {choice.text}
              </p>
            </div>
            {result && (choice.id === result.correct_choice_id || choice.id === result.selected_choice_id) && (
              <div className="flex-shrink-0">
                {choice.id === result.correct_choice_id && (
                  <span className="text-green-600 dark:text-green-400 text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded">
                    Bonne réponse
                  </span>
                )}
                {choice.id === result.selected_choice_id && choice.id !== result.correct_choice_id && (
                  <span className="text-red-600 dark:text-red-400 text-xs font-medium px-2 py-1 bg-red-100 dark:bg-red-900/20 rounded">
                    Votre réponse
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Explication pour les réponses incorrectes */}
      {result && !result.is_correct && (
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-600 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Bonne réponse :</strong> {result.correct_choice_text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionItem; 