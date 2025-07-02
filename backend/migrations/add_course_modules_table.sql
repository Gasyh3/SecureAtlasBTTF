-- Migration: Ajouter la table course_modules
-- Date: 2025-07-01
-- Description: Création de la table pour gérer les modules de cours

-- Créer le type enum pour les types de modules
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'moduletype') THEN
        CREATE TYPE moduletype AS ENUM ('text', 'video');
    END IF;
END
$$;

-- Créer la table course_modules
CREATE TABLE IF NOT EXISTS course_modules (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type moduletype DEFAULT 'text' NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_course_modules_title ON course_modules(title);
CREATE INDEX IF NOT EXISTS idx_course_modules_type ON course_modules(type);
CREATE INDEX IF NOT EXISTS idx_course_modules_created_at ON course_modules(created_at DESC);

-- Ajouter un trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_course_modules_updated_at ON course_modules;
CREATE TRIGGER update_course_modules_updated_at
    BEFORE UPDATE ON course_modules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insérer quelques données d'exemple (optionnel, pour les tests)
INSERT INTO course_modules (title, content, type) VALUES 
    ('Introduction à la programmation', 'Ce module couvre les concepts de base de la programmation, incluant les variables, les fonctions et les structures de contrôle.', 'text'),
    ('Tutoriel vidéo: Variables en Python', 'https://www.youtube.com/watch?v=example - Vidéo explicative sur l''utilisation des variables en Python', 'video'),
    ('Structures de données', 'Apprenez les listes, dictionnaires et autres structures de données essentielles en programmation.', 'text')
ON CONFLICT DO NOTHING;

-- Vérifier que la table a été créée
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'course_modules') THEN
        RAISE NOTICE 'Table course_modules créée avec succès';
    ELSE
        RAISE EXCEPTION 'Erreur lors de la création de la table course_modules';
    END IF;
END
$$; 