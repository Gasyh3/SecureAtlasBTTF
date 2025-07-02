import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app
from db import get_db, Base
from models.user import User, RoleEnum
from models.module import CourseModule, ModuleType

# Base de données de test en mémoire
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_modules.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    yield TestClient(app)
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def admin_token(client):
    """Créer un admin et retourner son token"""
    # Créer l'admin
    client.post(
        "/api/auth/create-first-admin",
        json={
            "username": "admin",
            "email": "admin@test.com",
            "password": "admin123",
            "role": "admin"
        }
    )
    
    # Se connecter
    response = client.post(
        "/api/auth/login",
        data={"username": "admin@test.com", "password": "admin123"}
    )
    return response.json()["access_token"]

@pytest.fixture
def instructor_token(client, admin_token):
    """Créer un instructor et retourner son token"""
    # Créer l'utilisateur
    response = client.post(
        "/api/auth/register",
        json={
            "email": "instructor@test.com",
            "password": "instructor123"
        }
    )
    user_id = response.json()["id"]
    
    # Promouvoir en instructor
    client.put(
        f"/api/auth/admin/users/{user_id}/role?new_role=instructor",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    
    # Se connecter
    response = client.post(
        "/api/auth/login",
        data={"username": "instructor@test.com", "password": "instructor123"}
    )
    return response.json()["access_token"]

@pytest.fixture
def student_token(client):
    """Créer un étudiant et retourner son token"""
    # Créer l'utilisateur
    client.post(
        "/api/auth/register",
        json={
            "email": "student@test.com",
            "password": "student123"
        }
    )
    
    # Se connecter
    response = client.post(
        "/api/auth/login",
        data={"username": "student@test.com", "password": "student123"}
    )
    return response.json()["access_token"]

def test_create_module_as_instructor(client, instructor_token):
    """Test de création d'un module par un instructor"""
    response = client.post(
        "/api/modules/",
        json={
            "title": "Introduction à Python",
            "content": "Contenu du module Python",
            "type": "text"
        },
        headers={"Authorization": f"Bearer {instructor_token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Introduction à Python"
    assert data["content"] == "Contenu du module Python"
    assert data["type"] == "text"
    assert "id" in data
    assert "created_at" in data

def test_create_module_as_admin(client, admin_token):
    """Test de création d'un module par un admin"""
    response = client.post(
        "/api/modules/",
        json={
            "title": "Module Admin",
            "content": "Contenu du module admin",
            "type": "video"
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["type"] == "video"

def test_create_module_as_student_fails(client, student_token):
    """Test qu'un étudiant ne peut pas créer un module"""
    response = client.post(
        "/api/modules/",
        json={
            "title": "Module non autorisé",
            "content": "Ce module ne devrait pas être créé",
            "type": "text"
        },
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 403
    assert "Instructor or admin permissions required" in response.json()["detail"]

def test_create_module_without_auth_fails(client):
    """Test qu'on ne peut pas créer un module sans authentification"""
    response = client.post(
        "/api/modules/",
        json={
            "title": "Module non autorisé",
            "content": "Ce module ne devrait pas être créé",
            "type": "text"
        }
    )
    assert response.status_code == 401

def test_get_modules_list(client, instructor_token, student_token):
    """Test de récupération de la liste des modules"""
    # Créer quelques modules
    for i in range(3):
        client.post(
            "/api/modules/",
            json={
                "title": f"Module {i+1}",
                "content": f"Contenu du module {i+1}",
                "type": "text" if i % 2 == 0 else "video"
            },
            headers={"Authorization": f"Bearer {instructor_token}"}
        )
    
    # Lister les modules (étudiant)
    response = client.get(
        "/api/modules/",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    
    # Vérifier la pagination
    response = client.get(
        "/api/modules/?skip=1&limit=1",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1

def test_get_module_detail(client, instructor_token, student_token):
    """Test de récupération d'un module spécifique"""
    # Créer un module
    create_response = client.post(
        "/api/modules/",
        json={
            "title": "Module de test",
            "content": "Contenu détaillé du module",
            "type": "text"
        },
        headers={"Authorization": f"Bearer {instructor_token}"}
    )
    module_id = create_response.json()["id"]
    
    # Récupérer le module
    response = client.get(
        f"/api/modules/{module_id}",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Module de test"
    assert data["content"] == "Contenu détaillé du module"

def test_get_nonexistent_module(client, student_token):
    """Test de récupération d'un module inexistant"""
    response = client.get(
        "/api/modules/9999",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 404
    assert "Module not found" in response.json()["detail"]

def test_update_module_as_instructor(client, instructor_token):
    """Test de mise à jour d'un module par un instructor"""
    # Créer un module
    create_response = client.post(
        "/api/modules/",
        json={
            "title": "Module à modifier",
            "content": "Contenu original",
            "type": "text"
        },
        headers={"Authorization": f"Bearer {instructor_token}"}
    )
    module_id = create_response.json()["id"]
    
    # Mettre à jour le module
    response = client.put(
        f"/api/modules/{module_id}",
        json={
            "title": "Module modifié",
            "content": "Contenu mis à jour"
        },
        headers={"Authorization": f"Bearer {instructor_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Module modifié"
    assert data["content"] == "Contenu mis à jour"
    assert data["type"] == "text"  # Type non modifié

def test_update_module_as_student_fails(client, instructor_token, student_token):
    """Test qu'un étudiant ne peut pas modifier un module"""
    # Créer un module
    create_response = client.post(
        "/api/modules/",
        json={
            "title": "Module protégé",
            "content": "Contenu protégé",
            "type": "text"
        },
        headers={"Authorization": f"Bearer {instructor_token}"}
    )
    module_id = create_response.json()["id"]
    
    # Tentative de modification par un étudiant
    response = client.put(
        f"/api/modules/{module_id}",
        json={
            "title": "Tentative de modification"
        },
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 403

def test_delete_module_as_instructor(client, instructor_token):
    """Test de suppression d'un module par un instructor"""
    # Créer un module
    create_response = client.post(
        "/api/modules/",
        json={
            "title": "Module à supprimer",
            "content": "Ce module sera supprimé",
            "type": "text"
        },
        headers={"Authorization": f"Bearer {instructor_token}"}
    )
    module_id = create_response.json()["id"]
    
    # Supprimer le module
    response = client.delete(
        f"/api/modules/{module_id}",
        headers={"Authorization": f"Bearer {instructor_token}"}
    )
    assert response.status_code == 200
    assert "Module deleted successfully" in response.json()["message"]
    
    # Vérifier que le module a été supprimé
    response = client.get(
        f"/api/modules/{module_id}",
        headers={"Authorization": f"Bearer {instructor_token}"}
    )
    assert response.status_code == 404

def test_delete_module_as_student_fails(client, instructor_token, student_token):
    """Test qu'un étudiant ne peut pas supprimer un module"""
    # Créer un module
    create_response = client.post(
        "/api/modules/",
        json={
            "title": "Module protégé",
            "content": "Ce module ne peut pas être supprimé par un étudiant",
            "type": "text"
        },
        headers={"Authorization": f"Bearer {instructor_token}"}
    )
    module_id = create_response.json()["id"]
    
    # Tentative de suppression par un étudiant
    response = client.delete(
        f"/api/modules/{module_id}",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 403

def test_get_modules_count(client, instructor_token, student_token):
    """Test de récupération du nombre total de modules"""
    # Créer quelques modules
    for i in range(5):
        client.post(
            "/api/modules/",
            json={
                "title": f"Module {i+1}",
                "content": f"Contenu {i+1}",
                "type": "text"
            },
            headers={"Authorization": f"Bearer {instructor_token}"}
        )
    
    # Récupérer le nombre de modules
    response = client.get(
        "/api/modules/stats/count",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_modules"] == 5

def test_module_type_validation(client, instructor_token):
    """Test de validation du type de module"""
    # Type valide
    response = client.post(
        "/api/modules/",
        json={
            "title": "Module vidéo",
            "content": "Contenu vidéo",
            "type": "video"
        },
        headers={"Authorization": f"Bearer {instructor_token}"}
    )
    assert response.status_code == 201
    
    # Type invalide (doit être géré par FastAPI/Pydantic)
    response = client.post(
        "/api/modules/",
        json={
            "title": "Module invalide",
            "content": "Contenu",
            "type": "invalid_type"
        },
        headers={"Authorization": f"Bearer {instructor_token}"}
    )
    assert response.status_code == 422  # Validation error 