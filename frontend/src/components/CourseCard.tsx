import React from 'react';
import { BookOpen, Users, Clock } from 'lucide-react';
import type { Course } from '../types/api';

interface CourseCardProps {
  course: Course;
}

const getLevelColor = (level: Course['level']) => {
  switch (level) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getLevelText = (level: Course['level']) => {
  switch (level) {
    case 'beginner':
      return 'Débutant';
    case 'intermediate':
      return 'Intermédiaire';
    case 'advanced':
      return 'Avancé';
    default:
      return level;
  }
};

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="card">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(course.level)}`}>
            {getLevelText(course.level)}
          </span>
        </div>
        
        {course.description && (
          <p className="text-gray-600 mb-4">{course.description}</p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>0 étudiants</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>~2h</span>
          </div>
        </div>
        
        <button className="btn-primary w-full mt-4">
          Commencer le cours
        </button>
      </div>
    </div>
  );
};

export default CourseCard; 