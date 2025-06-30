# Documentation - Plateforme E-Learning Adaptatif

## Architecture

Cette plateforme d'e-learning adaptatif est composée de trois services principaux :

### Frontend (React)
- Port: 3000
- Framework: React 18
- Build: npm run build + serve

### Backend (FastAPI)
- Port: 8000
- Framework: FastAPI avec Python 3.11
- Base de données: PostgreSQL

### Base de données (PostgreSQL)
- Port: 5432
- Version: 15-alpine
- Nom de la base: elearning

## API Endpoints

### Health Check
- **GET** `/health` - Vérification de la santé de l'API
- Response: `{"status": "ok"}`

### Courses
- **GET** `/api/courses` - Liste des cours disponibles

## Configuration Docker

### Variables d'environnement

**Frontend:**
- `REACT_APP_API_URL`: URL de l'API backend (default: http://localhost:8000)

**Backend:**
- `DATABASE_URL`: URL de connexion PostgreSQL
- `PYTHONPATH`: Path Python (default: /app)

**Database:**
- `POSTGRES_USER`: Utilisateur PostgreSQL
- `POSTGRES_PASSWORD`: Mot de passe PostgreSQL
- `POSTGRES_DB`: Nom de la base de données 