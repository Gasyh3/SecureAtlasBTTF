-- Script d'initialisation de la base de données E-Learning

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des cours
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(50) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des leçons
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des inscriptions
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Données d'exemple
INSERT INTO courses (title, description, level) VALUES
('Introduction à Python', 'Apprenez les bases de la programmation Python', 'beginner'),
('Développement Web avec FastAPI', 'Créez des APIs modernes avec FastAPI', 'intermediate'),
('Machine Learning Avancé', 'Techniques avancées d\'apprentissage automatique', 'advanced')
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, content, order_index) VALUES
(1, 'Variables et Types de Données', 'Introduction aux variables Python', 1),
(1, 'Structures de Contrôle', 'If, while, for en Python', 2),
(2, 'Configuration FastAPI', 'Installation et configuration', 1),
(2, 'Création d''APIs', 'Endpoints et méthodes HTTP', 2)
ON CONFLICT DO NOTHING; 