# 🎓 Plateforme E-Learning Adaptatif

Une plateforme d'apprentissage en ligne moderne construite avec React, FastAPI et PostgreSQL.

## 📁 Structure du Projet

```
.
├── frontend/           # Application React (port 3000)
├── backend/           # API FastAPI (port 8000)
├── infra/             # Configuration infrastructure
├── docs/              # Documentation
├── docker-compose.yml # Configuration Docker principale
├── Makefile          # Commandes de développement
└── .github/workflows/ # CI/CD GitHub Actions
```

## 🚀 Démarrage Rapide

### Prérequis
- Docker et Docker Compose
- Make (optionnel)

### Lancement de l'application

```bash
# Avec Make
make up

# Ou directement avec Docker Compose
docker-compose up -d --build
```

### Arrêt de l'application

```bash
# Avec Make
make down

# Ou directement
docker-compose down
```

## 🌐 Accès aux Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentation API**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432

## 🛠️ Commandes Makefile

```bash
make up      # Démarre tous les services
make down    # Arrête tous les services
make build   # Build les images Docker
make clean   # Supprime tout (volumes, images)
make logs    # Affiche les logs en temps réel
```

## 📡 API Endpoints

### Health Check
```http
GET /health
```
Response: `{"status": "ok"}`

### Courses
```http
GET /api/courses
```

## 🏗️ Architecture

### Frontend (React)
- **Framework**: React 18
- **Build**: Multi-stage avec npm build + serve
- **Port**: 3000

### Backend (FastAPI)
- **Framework**: FastAPI + Python 3.11
- **Database**: PostgreSQL avec SQLAlchemy
- **Port**: 8000

### Base de Données
- **SGBD**: PostgreSQL 15
- **Port**: 5432
- **Nom**: elearning

## 🔄 CI/CD

Le workflow GitHub Actions (`.github/workflows/ci.yml`) effectue :

1. **Lint** du code (flake8 pour Python, ESLint pour React)
2. **Build** et test avec Docker Compose
3. **Push** des images sur Docker Hub

## 🐳 Docker

### Images produites
- `elearning-frontend:latest`
- `elearning-backend:latest`

### Configuration Docker Hub
Ajoutez ces secrets dans votre repository GitHub :
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

## 📚 Documentation

Consultez le dossier `docs/` pour plus de détails sur l'architecture et l'utilisation.

## 🧪 Développement

Pour le développement local avec rechargement automatique :

```bash
cd infra
docker-compose -f docker-compose.dev.yml up
```

