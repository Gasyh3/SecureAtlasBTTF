import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Loader2, Play, FileText, Calendar } from 'lucide-react';
import { modulesApi } from '../services/modules';
import { useAuth } from '../context/AuthContext';
import type { Module } from '../types/modules';

const ModuleDetailPage: React.FC = () => {
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const canModify = user?.role === 'instructor' || user?.role === 'admin';

  useEffect(() => {
    if (id) {
      loadModule(parseInt(id));
    } else {
      navigate('/modules');
    }
  }, [id, navigate]);

  const loadModule = async (moduleId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await modulesApi.fetchModule(moduleId);
      setModule(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors du chargement du module');
      if (err.response?.status === 404) {
        setError('Module non trouvé');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (module) {
      navigate(`/modules/${module.id}/edit`);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!module) return;

    try {
      await modulesApi.deleteModule(module.id);
      setNotification({ type: 'success', message: 'Module supprimé avec succès' });
      setTimeout(() => {
        navigate('/modules');
      }, 1500);
    } catch (err: any) {
      setNotification({ 
        type: 'error', 
        message: err.response?.data?.detail || 'Erreur lors de la suppression' 
      });
    } finally {
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderVideoContent = (content: string) => {
    // Essayer de détecter et intégrer les URLs YouTube
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = content.match(youtubeRegex);
    
    if (match) {
      const videoId = match[1];
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Module Video"
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    // Essayer de détecter les URLs Vimeo
    const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/;
    const vimeoMatch = content.match(vimeoRegex);
    
    if (vimeoMatch) {
      const videoId = vimeoMatch[1];
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={`https://player.vimeo.com/video/${videoId}`}
            title="Module Video"
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    // Si c'est du HTML d'intégration, l'afficher directement
    if (content.includes('<iframe') || content.includes('<embed')) {
      return (
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    }

    // Sinon, traiter comme une URL simple
    return (
      <div className="bg-gray-100 rounded-lg p-6">
        <div className="text-center">
          <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Contenu vidéo :</p>
          <a
            href={content}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <Play className="h-4 w-4" />
            Ouvrir la vidéo
          </a>
        </div>
      </div>
    );
  };

  const renderTextContent = (content: string) => {
    // Simple rendu Markdown basique (vous pouvez intégrer une vraie lib Markdown)
    const formatMarkdown = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    };

    return (
      <div className="prose prose-lg max-w-none">
        <div
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: `<p>${formatMarkdown(content)}</p>` }}
        />
      </div>
    );
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Chargement du module...</p>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              ❌
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || 'Module non trouvé'}
          </h3>
          <button
            onClick={() => navigate('/modules')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Retour aux modules
          </button>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/modules')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-3">
                {module.type === 'video' ? (
                  <Play className="h-8 w-8 text-red-500" />
                ) : (
                  <FileText className="h-8 w-8 text-blue-500" />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{module.title}</h1>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      module.type === 'video'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {module.type === 'video' ? 'Vidéo' : 'Texte'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Créé le {formatDate(module.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {canModify && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Éditer
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {module.type === 'video' ? renderVideoContent(module.content) : renderTextContent(module.content)}
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer le module "{module.title}" ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
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

export default ModuleDetailPage; 