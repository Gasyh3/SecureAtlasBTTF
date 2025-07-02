import { Link } from 'react-router-dom';
import { Play, FileText, Edit, Trash2, ArrowRight } from 'lucide-react';
import type { ModuleList } from '../types/modules';
import { useAuth } from '../context/AuthContext';

interface ModuleItemProps {
  module: ModuleList;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ModuleItem: React.FC<ModuleItemProps> = ({ module, onEdit, onDelete }) => {
  const { user } = useAuth();
  const canModify = user?.role === 'instructor' || user?.role === 'admin';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-dark-700 rounded-lg shadow-md dark:shadow-gold-500/10 border border-gray-200 dark:border-dark-600 p-6 hover:shadow-lg dark:hover:shadow-gold-500/20 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Titre et type */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0">
              {module.type === 'video' ? (
                <Play className="h-6 w-6 text-red-500 dark:text-gold-400" />
              ) : (
                <FileText className="h-6 w-6 text-blue-500 dark:text-gold-400" />
              )}
            </div>
            <Link
              to={`/modules/${module.id}`}
              className="text-lg font-semibold text-gray-900 dark:text-dark-primary hover:text-blue-600 dark:hover:text-gold-400 transition-colors line-clamp-2"
            >
              {module.title}
            </Link>
          </div>

          {/* Badge type */}
          <div className="mb-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                module.type === 'video'
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                  : 'bg-blue-100 dark:bg-gold-900/20 text-blue-800 dark:text-gold-300'
              }`}
            >
              {module.type === 'video' ? 'Vidéo' : 'Texte'}
            </span>
          </div>

          {/* Date de création */}
          <p className="text-sm text-gray-500 dark:text-dark-muted">
            Créé le {formatDate(module.created_at)}
          </p>
        </div>

        {/* Actions */}
        {canModify && (
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => onEdit(module.id)}
              className="p-2 text-gray-400 dark:text-dark-muted hover:text-blue-600 dark:hover:text-gold-400 hover:bg-blue-50 dark:hover:bg-gold-900/20 rounded-lg transition-colors"
              title="Éditer"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(module.id)}
              className="p-2 text-gray-400 dark:text-dark-muted hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Supprimer"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Lien de lecture */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-600">
        <Link
          to={`/modules/${module.id}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-gold-400 hover:text-blue-800 dark:hover:text-gold-300 transition-colors"
        >
          Lire le module
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default ModuleItem; 