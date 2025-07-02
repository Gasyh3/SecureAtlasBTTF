import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  Award, 
  Video, 
  FileText, 
  Shield, 
  Zap, 
  Globe,
  CheckCircle,
  Star
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-dark-primary transition-colors duration-200">
      <Header isAuthenticated={isAuthenticated} />
      

      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-900 dark:to-dark-800 py-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-dark-primary mb-6">
              Bienvenue sur <span className="text-blue-600 dark:text-gold-400">Kevs Academy</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-dark-secondary mb-8 max-w-3xl mx-auto">
              Une plateforme d'apprentissage en ligne moderne et intuitive, conçue pour 
              démocratiser l'accès à l'éducation de qualité. Apprenez à votre rythme, 
              où que vous soyez.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-blue-600 dark:bg-gold-600 rounded-lg hover:bg-blue-700 dark:hover:bg-gold-700 transition-colors"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 dark:text-gold-400 bg-white dark:bg-dark-800 border-2 border-blue-600 dark:border-gold-400 rounded-lg hover:bg-blue-50 dark:hover:bg-dark-700 transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-dark-primary transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-gold-900/20 rounded-full mb-4">
                <Users className="w-8 h-8 text-blue-600 dark:text-gold-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-dark-primary mb-2">100+</h3>
              <p className="text-gray-600 dark:text-dark-secondary">Étudiants inscrits</p>
            </div>
            <div className="p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-gold-900/20 rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-green-600 dark:text-gold-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-dark-primary mb-2">50+</h3>
              <p className="text-gray-600 dark:text-dark-secondary">Modules de cours</p>
            </div>
            <div className="p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-gold-900/20 rounded-full mb-4">
                <Award className="w-8 h-8 text-yellow-600 dark:text-gold-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-dark-primary mb-2">95%</h3>
              <p className="text-gray-600 dark:text-dark-secondary">Taux de satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-dark-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-primary mb-4">
              Fonctionnalités modernes
            </h2>
            <p className="text-lg text-gray-600 dark:text-dark-secondary max-w-2xl mx-auto">
              Une plateforme complète avec tous les outils nécessaires pour un apprentissage efficace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-dark-700 p-8 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-gold-500/10 transition-all duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-gold-900/20 rounded-lg mb-6">
                <Video className="w-6 h-6 text-blue-600 dark:text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-primary mb-4">Contenu multimédia</h3>
              <p className="text-gray-600 dark:text-dark-secondary">
                Modules vidéo et texte pour une expérience d'apprentissage riche et variée.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-dark-700 p-8 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-gold-500/10 transition-all duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-gold-900/20 rounded-lg mb-6">
                <Users className="w-6 h-6 text-green-600 dark:text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-primary mb-4">Gestion des rôles</h3>
              <p className="text-gray-600 dark:text-dark-secondary">
                Système complet avec étudiants, instructeurs et administrateurs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-dark-700 p-8 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-gold-500/10 transition-all duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-gold-900/20 rounded-lg mb-6">
                <Shield className="w-6 h-6 text-purple-600 dark:text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-primary mb-4">Sécurité avancée</h3>
              <p className="text-gray-600 dark:text-dark-secondary">
                Authentification JWT et protection des données personnelles.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-dark-700 p-8 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-gold-500/10 transition-all duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-gold-900/20 rounded-lg mb-6">
                <Zap className="w-6 h-6 text-yellow-600 dark:text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-primary mb-4">Interface moderne</h3>
              <p className="text-gray-600 dark:text-dark-secondary">
                Interface utilisateur intuitive et responsive avec Tailwind CSS.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-dark-700 p-8 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-gold-500/10 transition-all duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-gold-900/20 rounded-lg mb-6">
                <FileText className="w-6 h-6 text-red-600 dark:text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-primary mb-4">CRUD complet</h3>
              <p className="text-gray-600 dark:text-dark-secondary">
                Création, lecture, modification et suppression de modules en temps réel.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-dark-700 p-8 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-gold-500/10 transition-all duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-gold-900/20 rounded-lg mb-6">
                <Globe className="w-6 h-6 text-indigo-600 dark:text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-primary mb-4">API REST</h3>
              <p className="text-gray-600 dark:text-dark-secondary">
                API FastAPI moderne avec documentation automatique Swagger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-white dark:bg-dark-primary transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-primary mb-4">
              Technologies modernes
            </h2>
            <p className="text-lg text-gray-600 dark:text-dark-secondary max-w-2xl mx-auto">
              Stack technique professionnel pour une performance optimale
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-gold-900/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-gold-400">React</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-dark-primary">Frontend</h4>
              <p className="text-sm text-gray-600 dark:text-dark-secondary">React + TypeScript</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-gold-900/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600 dark:text-gold-400">API</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-dark-primary">Backend</h4>
              <p className="text-sm text-gray-600 dark:text-dark-secondary">FastAPI + Python</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-gold-900/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600 dark:text-gold-400">DB</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-dark-primary">Base de données</h4>
              <p className="text-sm text-gray-600 dark:text-dark-secondary">PostgreSQL</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-gold-900/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600 dark:text-gold-400">🐳</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-dark-primary">Déploiement</h4>
              <p className="text-sm text-gray-600 dark:text-dark-secondary">Docker</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-dark-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-primary mb-6">
                À propos de Kevs Academy
              </h2>
              <p className="text-lg text-gray-600 dark:text-dark-secondary mb-6">
                Kevs Academy est une plateforme d'e-learning développée avec les technologies 
                les plus modernes. Notre mission est de rendre l'éducation accessible à tous, 
                partout dans le monde.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 dark:text-gold-400 mr-3" />
                  <span className="text-gray-700 dark:text-dark-secondary">Interface utilisateur intuitive</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 dark:text-gold-400 mr-3" />
                  <span className="text-gray-700 dark:text-dark-secondary">Contenu de qualité professionnelle</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 dark:text-gold-400 mr-3" />
                  <span className="text-gray-700 dark:text-dark-secondary">Suivi de progression personnalisé</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 dark:text-gold-400 mr-3" />
                  <span className="text-gray-700 dark:text-dark-secondary">Support communautaire actif</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 to-purple-600 dark:from-gold-600 dark:to-gold-800 rounded-2xl p-8 text-white transition-colors duration-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Commencez dès maintenant</h3>
                    <p className="text-blue-100 dark:text-gold-100">Gratuit et sans engagement</p>
                  </div>
                </div>
                <p className="mb-6">
                  Rejoignez des milliers d'apprenants qui font confiance à Kevs Academy 
                  pour leur formation continue.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center bg-white text-blue-600 dark:text-gold-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  S'inscrire gratuitement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-dark-primary transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-primary mb-4">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-lg text-gray-600 dark:text-dark-secondary">
              Témoignages de notre communauté grandissante
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-dark-700 p-8 rounded-xl transition-colors duration-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 dark:text-gold-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-dark-secondary mb-6">
                "Interface très intuitive et contenu de qualité. J'ai pu apprendre 
                à mon rythme et acquérir de nouvelles compétences rapidement."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 dark:bg-gold-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  A
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-dark-primary">Alice Martin</h4>
                  <p className="text-sm text-gray-500 dark:text-dark-muted">Étudiante</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-dark-700 p-8 rounded-xl transition-colors duration-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 dark:text-gold-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-dark-secondary mb-6">
                "Excellent outil pour créer et partager du contenu pédagogique. 
                Mes étudiants adorent la flexibilité de la plateforme."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 dark:bg-gold-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  P
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-dark-primary">Pierre Dubois</h4>
                  <p className="text-sm text-gray-500 dark:text-dark-muted">Instructeur</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-dark-700 p-8 rounded-xl transition-colors duration-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 dark:text-gold-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-dark-secondary mb-6">
                "Gestion administrative simplifiée et analytics détaillés. 
                Parfait pour suivre les progrès de notre équipe."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-500 dark:bg-gold-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  S
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-dark-primary">Sophie Chen</h4>
                  <p className="text-sm text-gray-500 dark:text-dark-muted">Administratrice</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-blue-600 dark:bg-gradient-to-r dark:from-dark-900 dark:to-gold-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer votre parcours d'apprentissage ?
          </h2>
          <p className="text-xl text-blue-100 dark:text-gold-100 mb-8 max-w-2xl mx-auto">
            Rejoignez Kevs Academy dès aujourd'hui et découvrez une nouvelle façon d'apprendre
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 dark:text-gold-900 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              Créer un compte gratuit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-lg hover:bg-white hover:text-blue-600 dark:hover:text-gold-900 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage; 