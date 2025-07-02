import api from '../services/api';
import { Module, ModuleCreate, ModuleUpdate, ModuleList, PaginationParams } from '../types/modules';

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
 * Service API pour la gestion des modules
 */
export const modulesApi = {
  /**
   * Récupérer la liste des modules avec pagination
   */
  fetchModules: async (params: PaginationParams = {}): Promise<ModuleList[]> => {
    const { skip = 0, limit = 10 } = params;
    const response = await api.get('/api/modules/', {
      params: { skip, limit }
    });
    return response.data;
  },

  /**
   * Récupérer un module par son ID
   */
  fetchModule: async (id: number): Promise<Module> => {
    const response = await api.get(`/api/modules/${id}`);
    return response.data;
  },

  /**
   * Créer un nouveau module
   */
  createModule: async (data: ModuleCreate): Promise<Module> => {
    const response = await api.post('/api/modules/', data);
    return response.data;
  },

  /**
   * Mettre à jour un module
   */
  updateModule: async (id: number, data: ModuleUpdate): Promise<Module> => {
    const response = await api.put(`/api/modules/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer un module
   */
  deleteModule: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/modules/${id}`);
    return response.data;
  }
};

// Fonctions individuelles pour compatibilité
export const fetchModules = modulesApi.fetchModules;
export const fetchModule = modulesApi.fetchModule;
export const getModuleById = modulesApi.fetchModule; // Alias pour QuizPage
export const createModule = modulesApi.createModule;
export const updateModule = modulesApi.updateModule;
export const deleteModule = modulesApi.deleteModule;

export default modulesApi; 