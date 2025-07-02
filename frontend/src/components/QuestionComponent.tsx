import React from 'react';
import { QuestionComponentProps } from '../types/quiz';

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  question,
  selectedChoiceId,
  onAnswerSelect,
  isReviewMode = false,
  questionResult
}) => {
  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {question.text}
        </h2>
      </div>

      {/* Choix de réponses */}
      <div className="space-y-3">
        {question.choices
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((choice) => {
            const isSelected = selectedChoiceId === choice.id;
            const isCorrect = questionResult?.correct_choice_id === choice.id;
            const isIncorrect = isReviewMode && isSelected && !isCorrect;
            
            let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ";
            
            if (isReviewMode) {
              // Mode révision - afficher les bonnes/mauvaises réponses
              if (isCorrect) {
                buttonClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200";
              } else if (isIncorrect) {
                buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200";
              } else if (isSelected) {
                buttonClass += "border-gray-400 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
              } else {
                buttonClass += "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300";
              }
            } else {
              // Mode quiz normal
              if (isSelected) {
                buttonClass += "border-gold-500 bg-gold-50 dark:bg-gold-900/20 text-gold-800 dark:text-gold-200";
              } else {
                buttonClass += "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gold-300 hover:bg-gold-50 dark:hover:bg-gold-900/10";
              }
            }

            return (
              <button
                key={choice.id}
                onClick={() => !isReviewMode && onAnswerSelect(question.id, choice.id)}
                disabled={isReviewMode}
                className={buttonClass}
              >
                <div className="flex items-center">
                  {/* Radio button */}
                  <div className="flex-shrink-0 mr-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? isReviewMode && isCorrect
                          ? 'border-green-500 bg-green-500'
                          : isReviewMode && isIncorrect
                          ? 'border-red-500 bg-red-500'
                          : 'border-gold-500 bg-gold-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  
                  {/* Texte du choix */}
                  <div className="flex-1">
                    <span className="font-medium">{choice.text}</span>
                  </div>

                  {/* Icônes de révision */}
                  {isReviewMode && (
                    <div className="flex-shrink-0 ml-3">
                      {isCorrect && (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-1 text-sm font-medium">Bonne réponse</span>
                        </div>
                      )}
                      {isIncorrect && (
                        <div className="flex items-center text-red-600 dark:text-red-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-1 text-sm font-medium">Votre réponse</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
      </div>

      {/* Explication en mode révision */}
      {isReviewMode && questionResult && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              {questionResult.is_correct ? (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {questionResult.is_correct ? (
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    ✅ Correct ! Vous avez sélectionné la bonne réponse.
                  </span>
                ) : (
                  <>
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      ❌ Incorrect.
                    </span>
                    <br />
                    <span>Votre réponse: "{questionResult.selected_choice_text}"</span>
                    <br />
                    <span>Bonne réponse: "{questionResult.correct_choice_text}"</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionComponent; 