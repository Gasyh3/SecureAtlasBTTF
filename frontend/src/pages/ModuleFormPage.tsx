import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, FileText, Play } from 'lucide-react';
import { modulesApi } from '../services/modules';
import { useAuth } from '../context/AuthContext';
import type { ModuleCreate, ModuleUpdate, ModuleType } from '../types/modules';

const ModuleFormPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<ModuleType>('text');
  const [loading, setLoading] = useState(false);
  const [loadingModule, setLoadingModule] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const isEditing = !!id;
  const canModify = user?.role === 'instructor' || user?.role === 'admin';

  // Rediriger si l'utilisateur n'a pas les permissions
  useEffect(() => {
    if (!canModify) {
      navigate('/modules');
    }
  }, [canModify, navigate]);

  // Charger le module à éditer
  useEffect(() => {
    if (isEditing && id) {
      loadModule(parseInt(id));
    }
  }, [isEditing, id]);

  const loadModule = async (moduleId: number) => {
    try {
      setLoadingModule(true);
      const module = await modulesApi.fetchModule(moduleId);
      setTitle(module.title);
      setContent(module.content);
      setType(module.type);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors du chargement du module');
      if (err.response?.status === 404) {
        navigate('/modules');
      }
    } finally {
      setLoadingModule(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Le titre et le contenu sont obligatoires');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditing && id) {
        const updateData: ModuleUpdate = {
          title: title.trim(),
          content: content.trim(),
          type
        };
        await modulesApi.updateModule(parseInt(id), updateData);
        setNotification({ type: 'success', message: 'Module mis à jour avec succès' });
      } else {
        const createData: ModuleCreate = {
          title: title.trim(),
          content: content.trim(),
          type
        };
        await modulesApi.createModule(createData);
        setNotification({ type: 'success', message: 'Module créé avec succès' });
      }

      // Rediriger après un court délai
      setTimeout(() => {
        navigate('/modules');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
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

  if (loadingModule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Chargement du module...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/modules')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Modifier le module' : 'Nouveau module'}
              </h1>
              <p className="mt-2 text-gray-600">
                {isEditing ? 'Modifiez les informations du module' : 'Créez un nouveau module de cours'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Titre */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Titre du module <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Entrez le titre du module"
              maxLength={255}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {title.length}/255 caractères
            </p>
          </div>

          {/* Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de module <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative">
                <input
                  type="radio"
                  name="type"
                  value="text"
                  checked={type === 'text'}
                  onChange={(e) => setType(e.target.value as ModuleType)}
                  className="sr-only"
                />
                <div className={`
                  p-4 border rounded-lg cursor-pointer transition-all
                  ${type === 'text' 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}>
                  <div className="flex items-center gap-3">
                    <FileText className={`h-6 w-6 ${type === 'text' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium text-gray-900">Contenu texte</div>
                      <div className="text-sm text-gray-500">Article, markdown, etc.</div>
                    </div>
                  </div>
                </div>
              </label>

              <label className="relative">
                <input
                  type="radio"
                  name="type"
                  value="video"
                  checked={type === 'video'}
                  onChange={(e) => setType(e.target.value as ModuleType)}
                  className="sr-only"
                />
                <div className={`
                  p-4 border rounded-lg cursor-pointer transition-all
                  ${type === 'video' 
                    ? 'border-red-500 bg-red-50 ring-2 ring-red-200' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}>
                  <div className="flex items-center gap-3">
                    <Play className={`h-6 w-6 ${type === 'video' ? 'text-red-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium text-gray-900">Contenu vidéo</div>
                      <div className="text-sm text-gray-500">URL ou embed vidéo</div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Contenu */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Contenu <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder={
                type === 'video' 
                  ? 'URL de la vidéo ou code d\'intégration...' 
                  : 'Contenu du module (Markdown supporté)...'
              }
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {type === 'video' 
                ? 'Vous pouvez inclure une URL YouTube, Vimeo ou un code d\'intégration'
                : 'Vous pouvez utiliser du Markdown pour formater votre contenu'
              }
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/modules')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isEditing ? 'Mettre à jour' : 'Créer le module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModuleFormPage; 