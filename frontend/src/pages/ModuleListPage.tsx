import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { modulesApi } from '../services/modules';
import ModuleItem from '../components/ModuleItem';
import { useAuth } from '../context/AuthContext';
import type { ModuleList } from '../types/modules';

const ModuleListPage: React.FC = () => {
  const [modules, setModules] = useState<ModuleList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const canCreate = user?.role === 'instructor' || user?.role === 'admin';
  
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await modulesApi.fetchModules({ skip, limit });
      setModules(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors du chargement des modules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [currentPage]);

  const handleEdit = (id: number) => {
    navigate(`/modules/${id}/edit`);
  };

  const handleDelete = (id: number) => {
    setModuleToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!moduleToDelete) return;

    try {
      await modulesApi.deleteModule(moduleToDelete);
      setModules(modules.filter(m => m.id !== moduleToDelete));
      setNotification({ type: 'success', message: 'Module supprimé avec succès' });
    } catch (err: any) {
      setNotification({ 
        type: 'error', 
        message: err.response?.data?.detail || 'Erreur lors de la suppression' 
      });
    } finally {
      setShowDeleteModal(false);
      setModuleToDelete(null);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (modules.length === limit) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-primary flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-gold-400 mx-auto" />
          <p className="mt-2 text-gray-600 dark:text-dark-secondary">Chargement des modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary transition-colors duration-200">
      {/* Notification toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-colors duration-200 ${
            notification.type === 'success'
              ? 'bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-400 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-400 text-red-700 dark:text-red-300'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-dark-800 shadow dark:shadow-gold-500/10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-primary">Modules de cours</h1>
              <p className="mt-2 text-gray-600 dark:text-dark-secondary">
                Explorez et gérez les modules de formation
              </p>
            </div>
            {canCreate && (
              <button
                onClick={() => navigate('/modules/new')}
                className="inline-flex items-center gap-2 bg-blue-600 dark:bg-gold-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-gold-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Nouveau module
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-400 text-red-700 dark:text-red-300 rounded-lg transition-colors duration-200">
            {error}
            <button
              onClick={fetchModules}
              className="ml-4 underline hover:no-underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {modules.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-dark-muted mb-4">
              <div className="mx-auto h-24 w-24 bg-gray-200 dark:bg-dark-700 rounded-full flex items-center justify-center transition-colors duration-200">
                📚
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-primary mb-2">
              Aucun module disponible
            </h3>
            <p className="text-gray-600 dark:text-dark-secondary mb-6">
              Commencez par créer votre premier module de cours
            </p>
            {canCreate && (
              <button
                onClick={() => navigate('/modules/new')}
                className="inline-flex items-center gap-2 bg-blue-600 dark:bg-gold-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-gold-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Créer un module
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid des modules */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <ModuleItem
                  key={module.id}
                  module={module}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-dark-secondary">
                Page {currentPage}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 dark:text-dark-secondary bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={modules.length < limit}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 dark:text-dark-secondary bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-dark-900 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 transition-colors duration-200">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4 transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-primary mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 dark:text-dark-secondary mb-6">
              Êtes-vous sûr de vouloir supprimer ce module ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-secondary bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-700 border border-transparent rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleListPage; 