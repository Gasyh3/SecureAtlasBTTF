import api from '../services/api';
import { Quiz, QuizSubmission, QuizResult, QuizCreate } from '../types/quiz';

// Configuration de l'intercepteur pour ajouter le token d'auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Service API pour la gestion des quiz
 */
export const quizApi = {
  /**
   * Récupérer le quiz d'un module
   */
  fetchQuiz: async (moduleId: number): Promise<Quiz> => {
    const response = await api.get(`/api/modules/${moduleId}/quiz`);
    return response.data;
  },

  /**
   * Soumettre les réponses d'un quiz
   */
  submitQuiz: async (moduleId: number, answers: QuizSubmission['answers']): Promise<QuizResult> => {
    const response = await api.post(`/api/modules/${moduleId}/quiz/submit`, { answers });
    return response.data;
  },

  /**
   * Créer un quiz pour un module
   */
  createQuiz: async (moduleId: number, quizData: QuizCreate): Promise<Quiz> => {
    const response = await api.post(`/api/modules/${moduleId}/quiz`, quizData);
    return response.data;
  },

  /**
   * Mettre à jour un quiz
   */
  updateQuiz: async (moduleId: number, quizData: QuizCreate): Promise<Quiz> => {
    const response = await api.put(`/api/modules/${moduleId}/quiz`, quizData);
    return response.data;
  },

  /**
   * Supprimer un quiz
   */
  deleteQuiz: async (moduleId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/modules/${moduleId}/quiz`);
    return response.data;
  }
};

// Fonctions individuelles pour compatibilité
export const fetchQuiz = quizApi.fetchQuiz;
export const submitQuiz = quizApi.submitQuiz;
export const getQuizByModule = quizApi.fetchQuiz; // Alias
export const createQuiz = quizApi.createQuiz;
export const updateQuiz = quizApi.updateQuiz;
export const deleteQuiz = quizApi.deleteQuiz;

// Utilitaires
export const validateQuizData = (quizData: QuizCreate): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!quizData.title.trim()) {
    errors.push('Le titre du quiz est requis');
  }
  
  if (!quizData.questions.length) {
    errors.push('Le quiz doit avoir au moins une question');
  }

  quizData.questions.forEach((question, index) => {
    if (!question.text.trim()) {
      errors.push(`La question ${index + 1} doit avoir un texte`);
    }

    if (question.choices.length < 2) {
      errors.push(`La question ${index + 1} doit avoir au moins 2 choix`);
    }

    const correctChoices = question.choices.filter(choice => choice.is_correct);
    if (correctChoices.length !== 1) {
      errors.push(`La question ${index + 1} doit avoir exactement une bonne réponse`);
    }
  });
  
  return { isValid: errors.length === 0, errors };
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getScoreColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-green-600 dark:text-green-400';
  if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

export const getScoreMessage = (percentage: number): string => {
  if (percentage >= 90) return 'Excellent !';
  if (percentage >= 80) return 'Très bien !';
  if (percentage >= 70) return 'Bien !';
  if (percentage >= 60) return 'Passable';
  return 'À revoir';
};

export default quizApi; 