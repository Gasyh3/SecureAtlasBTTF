import { Link } from 'react-router-dom';
import { BookOpen, Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-dark-950 text-white dark:text-dark-primary transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 dark:bg-gold-600 rounded-lg transition-colors duration-200">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Kevs Academy</h2>
                <p className="text-sm text-gray-400 dark:text-dark-muted">E-Learning Platform</p>
              </div>
            </div>
            <p className="text-gray-300 dark:text-dark-secondary mb-6 max-w-md">
              Une plateforme d'apprentissage en ligne moderne et intuitive, 
              conçue pour démocratiser l'accès à l'éducation de qualité.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/kevinrakotoniaina"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-dark-muted hover:text-white dark:hover:text-gold-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/kevinrakotoniaina"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-dark-muted hover:text-white dark:hover:text-gold-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:kevrakt@gmail.com"
                className="text-gray-400 dark:text-dark-muted hover:text-white dark:hover:text-gold-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white dark:text-gold-400">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-300 dark:text-dark-secondary hover:text-white dark:hover:text-gold-400 transition-colors">
                  Connexion
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 dark:text-dark-secondary hover:text-white dark:hover:text-gold-400 transition-colors">
                  Inscription
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-300 dark:text-dark-secondary hover:text-white dark:hover:text-gold-400 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-300 dark:text-dark-secondary hover:text-white dark:hover:text-gold-400 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  À propos
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white dark:text-gold-400">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:kevrakt@gmail.com" className="text-gray-300 dark:text-dark-secondary hover:text-white dark:hover:text-gold-400 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-dark-secondary hover:text-white dark:hover:text-gold-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-dark-secondary hover:text-white dark:hover:text-gold-400 transition-colors">
                  Aide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 dark:text-dark-secondary hover:text-white dark:hover:text-gold-400 transition-colors">
                  CGU
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 dark:border-dark-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 dark:text-dark-muted text-sm">
            © {new Date().getFullYear()} Kevs Academy. Tous droits réservés.
          </p>
          <p className="text-gray-400 dark:text-dark-muted text-sm flex items-center mt-4 md:mt-0">
            Fait avec <Heart className="w-4 h-4 text-red-500 dark:text-gold-500 mx-1" /> par Kévin Rakotoniaina
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 