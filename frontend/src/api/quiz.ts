import axios, { AxiosResponse } from 'axios';
import { Quiz, QuizSubmission, QuizResult, QuizCreate } from '../types/quiz';

// Configuration de base
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API principales pour le quiz simplifié
export const fetchQuiz = (moduleId: number): Promise<AxiosResponse<Quiz>> =>
  api.get(`/modules/${moduleId}/quiz`);

export const submitQuiz = (moduleId: number, answers: QuizSubmission['answers']): Promise<AxiosResponse<QuizResult>> =>
  api.post(`/modules/${moduleId}/quiz/submit`, { answers });

// Fonctions pour les composants complexes (stubs pour éviter les erreurs de build)
export const getQuizByModule = async (moduleId: number): Promise<Quiz> => {
  const response = await fetchQuiz(moduleId);
  return response.data;
};

export const createQuiz = async (moduleId: number, quizData: QuizCreate): Promise<Quiz> => {
  const response = await api.post(`/modules/${moduleId}/quiz`, quizData);
  return response.data;
};

export const updateQuiz = async (moduleId: number, quizData: QuizCreate): Promise<Quiz> => {
  const response = await api.put(`/modules/${moduleId}/quiz`, quizData);
  return response.data;
};

export const validateQuizData = (quizData: QuizCreate): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!quizData.title.trim()) {
    errors.push('Le titre du quiz est requis');
  }
  
  if (!quizData.questions.length) {
    errors.push('Le quiz doit avoir au moins une question');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Utilitaires
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getScoreColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getScoreMessage = (percentage: number): string => {
  if (percentage >= 90) return 'Excellent !';
  if (percentage >= 80) return 'Très bien !';
  if (percentage >= 70) return 'Bien !';
  if (percentage >= 60) return 'Passable';
  return 'À revoir';
}; 