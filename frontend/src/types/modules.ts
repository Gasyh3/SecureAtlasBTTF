export type ModuleType = 'text' | 'video';

export interface Module {
  id: number;
  title: string;
  content: string;
  type: ModuleType;
  created_at: string;
  updated_at?: string;
}

export interface ModuleList {
  id: number;
  title: string;
  type: ModuleType;
  created_at: string;
}

export interface ModuleCreate {
  title: string;
  content: string;
  type: ModuleType;
}

export interface ModuleUpdate {
  title?: string;
  content?: string;
  type?: ModuleType;
}

export interface ModulesResponse {
  modules: ModuleList[];
  total: number;
  skip: number;
  limit: number;
}

export interface ModuleStats {
  total_modules: number;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
} 