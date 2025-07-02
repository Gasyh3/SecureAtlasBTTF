import api from '../services/api';

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
   * @param {Object} params - Paramètres de pagination
   * @param {number} params.skip - Nombre d'éléments à ignorer
   * @param {number} params.limit - Nombre maximum d'éléments à retourner
   * @returns {Promise<Array>} Liste des modules
   */
  fetchModules: async (params = {}) => {
    const { skip = 0, limit = 10 } = params;
    const response = await api.get('/api/modules/', {
      params: { skip, limit }
    });
    return response.data;
  },

  /**
   * Récupérer un module par son ID
   * @param {number} id - ID du module
   * @returns {Promise<Object>} Module complet
   */
  fetchModule: async (id) => {
    const response = await api.get(`/api/modules/${id}`);
    return response.data;
  },

  /**
   * Créer un nouveau module
   * @param {Object} data - Données du module
   * @param {string} data.title - Titre du module
   * @param {string} data.content - Contenu du module
   * @param {string} data.type - Type du module ('text' ou 'video')
   * @returns {Promise<Object>} Module créé
   */
  createModule: async (data) => {
    const response = await api.post('/api/modules/', data);
    return response.data;
  },

  /**
   * Mettre à jour un module
   * @param {number} id - ID du module
   * @param {Object} data - Données à mettre à jour
   * @returns {Promise<Object>} Module mis à jour
   */
  updateModule: async (id, data) => {
    const response = await api.put(`/api/modules/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer un module
   * @param {number} id - ID du module
   * @returns {Promise<Object>} Message de confirmation
   */
  deleteModule: async (id) => {
    const response = await api.delete(`/api/modules/${id}`);
    return response.data;
  },

  /**
   * Récupérer les statistiques des modules
   * @returns {Promise<Object>} Statistiques
   */
  getModuleStats: async () => {
    const response = await api.get('/api/modules/stats/count');
    return response.data;
  }
};

// Fonctions individuelles pour une utilisation alternative
export const fetchModules = modulesApi.fetchModules;
export const fetchModule = modulesApi.fetchModule;
export const createModule = modulesApi.createModule;
export const updateModule = modulesApi.updateModule;
export const deleteModule = modulesApi.deleteModule;

export default modulesApi; 