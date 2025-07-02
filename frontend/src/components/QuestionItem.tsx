import React, { useState } from 'react';
import { Question, QuestionResult } from '../types/quiz';

interface QuestionItemProps {
  question: Question;
  onAnswerChange: (questionId: number, choiceId: number) => void;
  result?: QuestionResult;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question, onAnswerChange, result }) => {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const handleChoiceChange = (choiceId: number): void => {
    setSelectedChoice(choiceId);
    onAnswerChange(question.id, choiceId);
  };

  const getQuestionStyle = (): string => {
    if (!result) return 'border-gray-200';
    return result.is_correct ? 'border-green-500' : 'border-red-500';
  };

  const getCorrectChoice = () => {
    if (!result) return null;
    return question.choices.find(choice => choice.id === result.correct_choice_id);
  };

  return (
    <div className={`p-4 mb-4 border-2 rounded-lg ${getQuestionStyle()}`}>
      <h3 className="text-lg font-semibold mb-4">{question.text}</h3>
      
      <div className="space-y-2">
        {question.choices.map((choice) => (
          <label key={choice.id} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={`question-${question.id}`}
              value={choice.id}
              checked={selectedChoice === choice.id}
              onChange={() => handleChoiceChange(choice.id)}
              disabled={!!result}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">{choice.text}</span>
          </label>
        ))}
      </div>

      {result && !result.is_correct && (
        <div className="mt-3 p-2 bg-red-50 rounded">
          <p className="text-red-700 text-sm">
            <strong>Bonne réponse :</strong>{' '}
            <em>{getCorrectChoice()?.text}</em>
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionItem; 