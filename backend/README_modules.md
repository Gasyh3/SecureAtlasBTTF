# Gestion des Modules de Cours - Kevs Academy

Ce document décrit l'implémentation complète de la gestion des modules de cours dans la plateforme d'e-learning.

## Vue d'ensemble

Le système de modules permet aux instructeurs et admins de créer, gérer et organiser du contenu pédagogique sous forme de modules. Chaque module peut être de type texte ou vidéo et contient un titre, du contenu et des métadonnées de création/modification.

## Architecture

### Modèle de données (`backend/models/module.py`)

```python
class ModuleType(str, enum.Enum):
    text = "text"
    video = "video"

class CourseModule(Base):
    __tablename__ = "course_modules"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    content = Column(Text, nullable=False)
    type = Column(Enum(ModuleType), default=ModuleType.text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
```

### Schemas Pydantic (`backend/schemas/module.py`)

- **ModuleCreate** : Pour la création (title, content, type)
- **ModuleUpdate** : Pour la mise à jour (champs optionnels)
- **ModuleRead** : Pour la lecture complète
- **ModuleList** : Pour les listes paginées (sans le contenu complet)

## API Endpoints

### Base URL : `/api/modules`

| Méthode | Endpoint | Description | Permissions |
|---------|----------|-------------|-------------|
| `GET` | `/` | Liste paginée des modules | Tous les utilisateurs connectés |
| `GET` | `/{module_id}` | Détail d'un module | Tous les utilisateurs connectés |
| `POST` | `/` | Créer un nouveau module | Instructor ou Admin |
| `PUT` | `/{module_id}` | Mettre à jour un module | Instructor ou Admin |
| `DELETE` | `/{module_id}` | Supprimer un module | Instructor ou Admin |
| `GET` | `/stats/count` | Nombre total de modules | Tous les utilisateurs connectés |

### Exemples d'utilisation

#### 1. Créer un module texte
```bash
curl -X POST "http://localhost:8000/api/modules/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Introduction à Python",
    "content": "Ce module couvre les bases de Python...",
    "type": "text"
  }'
```

#### 2. Créer un module vidéo
```bash
curl -X POST "http://localhost:8000/api/modules/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Tutoriel FastAPI",
    "content": "https://www.youtube.com/watch?v=example",
    "type": "video"
  }'
```

#### 3. Lister les modules avec pagination
```bash
curl -X GET "http://localhost:8000/api/modules/?skip=0&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 4. Mettre à jour un module
```bash
curl -X PUT "http://localhost:8000/api/modules/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Introduction à Python - Mise à jour",
    "content": "Contenu mis à jour..."
  }'
```

#### 5. Supprimer un module
```bash
curl -X DELETE "http://localhost:8000/api/modules/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Contrôle d'accès

### Permissions par rôle

- **Étudiant (student)** :
  - ✅ Lire les modules (liste et détail)
  - ✅ Consulter les statistiques
  - ❌ Créer, modifier ou supprimer

- **Instructeur (instructor)** :
  - ✅ Toutes les permissions étudiant
  - ✅ Créer des modules
  - ✅ Modifier des modules
  - ✅ Supprimer des modules

- **Administrateur (admin)** :
  - ✅ Toutes les permissions instructeur
  - ✅ Gestion complète du système

### Authentification

Tous les endpoints nécessitent une authentification via token JWT dans l'en-tête :
```
Authorization: Bearer <your_jwt_token>
```

## Types de modules

### Module Text
- **Type** : `"text"`
- **Usage** : Contenu textuel, markdown, HTML
- **Contenu** : Texte libre, documentation, exercices

### Module Video
- **Type** : `"video"`
- **Usage** : Liens vidéo, contenu multimédia
- **Contenu** : URLs, code d'intégration, descriptions

## Validation des données

### Champs requis pour la création
- `title` : 1-255 caractères
- `content` : Minimum 1 caractère
- `type` : "text" ou "video" (optionnel, défaut: "text")

### Champs optionnels pour la mise à jour
- Tous les champs peuvent être omis
- Seuls les champs fournis sont mis à jour

## Pagination

La liste des modules supporte la pagination :
- `skip` : Nombre d'éléments à ignorer (défaut: 0)
- `limit` : Nombre maximum d'éléments (défaut: 10, max: 100)

## Tests

### Tests unitaires
```bash
cd backend
python -m pytest tests/test_modules.py -v
```

### Tests d'intégration
```bash
cd backend
./test_modules.sh
```

Le script de test couvre :
- ✅ Création par instructor/admin
- ✅ Lecture par tous les utilisateurs
- ✅ Mise à jour par instructor/admin
- ✅ Suppression par instructor/admin
- ✅ Contrôle d'accès strict
- ✅ Pagination
- ✅ Validation des types

## Base de données

### Migration
Pour ajouter la table des modules à votre base de données existante :

```sql
-- Ajouter le type d'enum s'il n'existe pas
CREATE TYPE moduletype AS ENUM ('text', 'video');

-- Créer la table
CREATE TABLE course_modules (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type moduletype DEFAULT 'text' NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Index pour les performances
CREATE INDEX idx_course_modules_title ON course_modules(title);
```

### Nettoyage des données de test
```sql
-- Supprimer tous les modules de test
DELETE FROM course_modules WHERE title LIKE '%test%' OR title LIKE '%Test%';
```

## Monitoring et statistiques

### Métriques disponibles
- Nombre total de modules
- Distribution par type (text/video)
- Modules récents
- Modules les plus consultés (future feature)

### Endpoints de monitoring
```bash
# Nombre total de modules
curl -X GET "http://localhost:8000/api/modules/stats/count" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Développement futur

### Fonctionnalités prévues
- 🔄 Association modules ↔ cours
- 🔄 Ordre des modules dans un cours
- 🔄 Tracking de progression
- 🔄 Favoris et marque-pages
- 🔄 Commentaires et évaluations
- 🔄 Support des fichiers multimédias
- 🔄 Version history des modules

### Extensions possibles
- Support de nouveaux types (quiz, exercice, document)
- Édition collaborative
- Templates de modules
- Import/export de contenu
- Intégration avec des LMS externes

## Troubleshooting

### Erreurs communes

**403 Forbidden lors de la création**
- Vérifiez que l'utilisateur a le rôle instructor ou admin
- Vérifiez que le token JWT est valide

**422 Validation Error**
- Vérifiez que le type est "text" ou "video"
- Vérifiez que title et content ne sont pas vides

**404 Module not found**
- Vérifiez que l'ID du module existe
- Vérifiez que le module n'a pas été supprimé

## Support

Pour toute question ou problème :
1. Consultez les logs de l'application
2. Vérifiez la documentation API (FastAPI docs)
3. Lancez les tests unitaires pour valider l'installation 