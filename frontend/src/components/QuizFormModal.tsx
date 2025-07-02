import React, { useState, useEffect } from 'react';
import { QuizCreate, ChoiceCreate, QuestionCreate } from '../types/quiz';
import { createQuiz, updateQuiz, validateQuizData } from '../api/quiz';
import { toast } from 'react-toastify';
interface QuizFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: number;
  existingQuiz?: any; // Quiz existant pour édition
  onSave?: (quiz: any) => void;
}

const QuizFormModal: React.FC<QuizFormModalProps> = ({
  isOpen,
  onClose,
  moduleId,
  existingQuiz,
  onSave
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<QuizCreate>({
    title: '',
    questions: [{
      text: '',
      order: 0,
      choices: [
        { text: '', is_correct: false, order: 0 },
        { text: '', is_correct: false, order: 1 }
      ]
    }]
  });

  useEffect(() => {
    if (existingQuiz) {
      setFormData({
        title: existingQuiz.title,
        questions: existingQuiz.questions.map((q: any) => ({
          text: q.text,
          order: q.order || 0,
          choices: q.choices.map((c: any) => ({
            text: c.text,
            is_correct: c.is_correct || false,
            order: c.order || 0
          }))
        }))
      });
    } else {
      // Reset form for new quiz
      setFormData({
        title: '',
        questions: [{
          text: '',
          order: 0,
          choices: [
            { text: '', is_correct: false, order: 0 },
            { text: '', is_correct: false, order: 1 }
          ]
        }]
      });
    }
  }, [existingQuiz, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const validation = validateQuizData(formData);
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    setLoading(true);
    
    try {
      let savedQuiz;
      if (existingQuiz) {
        savedQuiz = await updateQuiz(moduleId, formData);
        toast.success('Quiz mis à jour avec succès !');
      } else {
        savedQuiz = await createQuiz(moduleId, formData);
        toast.success('Quiz créé avec succès !');
      }
      
      if (onSave) {
        onSave(savedQuiz);
      }
      
      onClose();
    } catch (error: any) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          order: prev.questions.length,
          choices: [
            { text: '', is_correct: false, order: 0 },
            { text: '', is_correct: false, order: 1 }
          ]
        }
      ]
    }));
  };

  const removeQuestion = (questionIndex: number) => {
    if (formData.questions.length <= 1) {
      toast.error('Un quiz doit avoir au moins une question');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex)
    }));
  };

  const updateQuestion = (questionIndex: number, field: keyof QuestionCreate, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex
          ? { ...question, [field]: value }
          : question
      )
    }));
  };

  const addChoice = (questionIndex: number) => {
    const question = formData.questions[questionIndex];
    if (question.choices.length >= 6) {
      toast.error('Maximum 6 choix par question');
      return;
    }

    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              choices: [
                ...question.choices,
                { text: '', is_correct: false, order: question.choices.length }
              ]
            }
          : question
      )
    }));
  };

  const removeChoice = (questionIndex: number, choiceIndex: number) => {
    const question = formData.questions[questionIndex];
    if (question.choices.length <= 2) {
      toast.error('Une question doit avoir au moins 2 choix');
      return;
    }

    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              choices: question.choices.filter((_, cIndex) => cIndex !== choiceIndex)
            }
          : question
      )
    }));
  };

  const updateChoice = (questionIndex: number, choiceIndex: number, field: keyof ChoiceCreate, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              choices: question.choices.map((choice, cIndex) =>
                cIndex === choiceIndex
                  ? { ...choice, [field]: value }
                  : choice
              )
            }
          : question
      )
    }));
  };

  const toggleCorrectChoice = (questionIndex: number, choiceIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              choices: question.choices.map((choice, cIndex) => ({
                ...choice,
                is_correct: cIndex === choiceIndex ? !choice.is_correct : choice.is_correct
              }))
            }
          : question
      )
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {existingQuiz ? 'Modifier le quiz' : 'Créer un quiz'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Titre du quiz */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre du quiz
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 dark:bg-gray-700 dark:text-white"
              placeholder="Entrez le titre du quiz"
              required
            />
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Questions ({formData.questions.length})
              </h3>
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors text-sm"
              >
                + Ajouter une question
              </button>
            </div>

            {formData.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Question {questionIndex + 1}
                  </h4>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Supprimer
                    </button>
                  )}
                </div>

                {/* Texte de la question */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Texte de la question
                  </label>
                  <textarea
                    value={question.text}
                    onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 dark:bg-gray-600 dark:text-white"
                    rows={3}
                    placeholder="Entrez le texte de la question"
                    required
                  />
                </div>

                {/* Choix de réponses */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Choix de réponses
                    </label>
                    <button
                      type="button"
                      onClick={() => addChoice(questionIndex)}
                      className="text-sm text-gold-500 hover:text-gold-600"
                    >
                      + Ajouter un choix
                    </button>
                  </div>

                  {question.choices.map((choice, choiceIndex) => (
                    <div key={choiceIndex} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={choice.is_correct}
                        onChange={() => toggleCorrectChoice(questionIndex, choiceIndex)}
                        className="text-gold-500 focus:ring-gold-500"
                      />
                      <input
                        type="text"
                        value={choice.text}
                        onChange={(e) => updateChoice(questionIndex, choiceIndex, 'text', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 dark:bg-gray-600 dark:text-white"
                        placeholder={`Choix ${choiceIndex + 1}`}
                        required
                      />
                      {question.choices.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeChoice(questionIndex, choiceIndex)}
                          className="text-red-500 hover:text-red-700 text-sm px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Cochez la case pour marquer la bonne réponse
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-gold-500 rounded-lg hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Enregistrement...' : existingQuiz ? 'Mettre à jour' : 'Créer le quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizFormModal; 