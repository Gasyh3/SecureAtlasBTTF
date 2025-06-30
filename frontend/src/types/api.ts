export interface HealthResponse {
  status: string;
}

export interface Course {
  id: number;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
}

export interface CoursesResponse {
  courses: Course[];
}

export interface ApiError {
  message: string;
  status?: number;
} 