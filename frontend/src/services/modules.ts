import api from './api';
import type { Module, ModuleList, ModuleCreate, ModuleUpdate, ModuleStats, PaginationParams } from '../types/modules';

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

export const modulesApi = {
  // Récupérer la liste des modules avec pagination
  fetchModules: async (params: PaginationParams = {}): Promise<ModuleList[]> => {
    const { skip = 0, limit = 10 } = params;
    const response = await api.get<ModuleList[]>(`/api/modules/`, {
      params: { skip, limit }
    });
    return response.data;
  },

  // Récupérer un module par son ID
  fetchModule: async (id: number): Promise<Module> => {
    const response = await api.get<Module>(`/api/modules/${id}`);
    return response.data;
  },

  // Créer un nouveau module
  createModule: async (data: ModuleCreate): Promise<Module> => {
    const response = await api.post<Module>('/api/modules/', data);
    return response.data;
  },

  // Mettre à jour un module
  updateModule: async (id: number, data: ModuleUpdate): Promise<Module> => {
    const response = await api.put<Module>(`/api/modules/${id}`, data);
    return response.data;
  },

  // Supprimer un module
  deleteModule: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/api/modules/${id}`);
    return response.data;
  },

  // Récupérer les statistiques des modules
  getModuleStats: async (): Promise<ModuleStats> => {
    const response = await api.get<ModuleStats>('/api/modules/stats/count');
    return response.data;
  }
};

export default modulesApi; 