# Backend E-Learning Platform

## Configuration

1. Copier le fichier `.env.example` vers `.env`:
```bash
cp .env.example .env
```

2. Modifier les variables d'environnement dans `.env` selon vos besoins.

## Base de données

### Initialiser Alembic
```bash
alembic init alembic
```

### Créer une migration
```bash
alembic revision --autogenerate -m "Create initial tables"
```

### Appliquer les migrations
```bash
alembic upgrade head
```

## Lancement

### Avec Docker Compose
```bash
docker-compose up --build
```

### En développement local
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

## Endpoints

- `GET /health` - Vérification de santé avec test de connexion DB
- `GET /api/courses` - Liste des cours
- `GET /api/courses/{id}` - Détail d'un cours 