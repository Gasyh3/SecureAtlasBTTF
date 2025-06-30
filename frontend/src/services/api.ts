import axios from 'axios';
import type { HealthResponse, CoursesResponse } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const healthApi = {
  check: async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>('/health');
    return response.data;
  },
};

export const coursesApi = {
  getAll: async (): Promise<CoursesResponse> => {
    const response = await api.get<CoursesResponse>('/api/courses');
    return response.data;
  },
};

export default api; 