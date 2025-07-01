import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app
from db import get_db, Base
from models.user import User, RoleEnum

# Base de données de test en mémoire
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
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

def test_register_success(client):
    response = client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "testpassword123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["role"] == "student"
    assert "id" in data

def test_register_duplicate_email(client):
    # Première inscription
    client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "testpassword123"}
    )
    
    # Tentative de duplicate
    response = client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "anotherpassword"}
    )
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]

def test_login_success(client):
    # Inscription d'abord
    client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "testpassword123"}
    )
    
    # Login
    response = client.post(
        "/auth/login",
        data={"username": "test@example.com", "password": "testpassword123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client):
    response = client.post(
        "/auth/login",
        data={"username": "nonexistent@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

def test_login_wrong_password(client):
    # Inscription d'abord
    client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "testpassword123"}
    )
    
    # Login avec mauvais mot de passe
    response = client.post(
        "/auth/login",
        data={"username": "test@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

# Tests Admin

def test_create_first_admin_success(client):
    """Test de création du premier admin"""
    response = client.post(
        "/auth/create-first-admin",
        json={
            "username": "admin",
            "email": "admin@kevs-academy.com",
            "firstname": "Admin",
            "lastname": "Principal",
            "password": "admin123",
            "role": "admin"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "admin@kevs-academy.com"
    assert data["role"] == "admin"
    assert data["username"] == "admin"

def test_create_first_admin_non_admin_role(client):
    """Test de création du premier admin avec un rôle non-admin (doit échouer)"""
    response = client.post(
        "/auth/create-first-admin",
        json={
            "username": "admin",
            "email": "admin@kevs-academy.com",
            "password": "admin123",
            "role": "student"
        }
    )
    assert response.status_code == 400
    assert "This endpoint is only for creating admin users" in response.json()["detail"]

def test_create_second_admin_fails(client):
    """Test que la création d'un second admin échoue"""
    # Créer le premier admin
    client.post(
        "/auth/create-first-admin",
        json={
            "username": "admin",
            "email": "admin@kevs-academy.com",
            "password": "admin123",
            "role": "admin"
        }
    )
    
    # Tentative de créer un second admin
    response = client.post(
        "/auth/create-first-admin",
        json={
            "username": "admin2",
            "email": "admin2@kevs-academy.com",
            "password": "admin123",
            "role": "admin"
        }
    )
    assert response.status_code == 400
    assert "An admin user already exists" in response.json()["detail"]

def test_admin_login_and_access(client):
    """Test de connexion admin et accès aux endpoints admin"""
    # Créer l'admin
    client.post(
        "/auth/create-first-admin",
        json={
            "username": "admin",
            "email": "admin@kevs-academy.com",
            "password": "admin123",
            "role": "admin"
        }
    )
    
    # Se connecter
    login_response = client.post(
        "/auth/login",
        data={"username": "admin@kevs-academy.com", "password": "admin123"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    
    # Accéder aux endpoints admin
    response = client.get(
        "/auth/admin/users",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    users = response.json()
    assert len(users) == 1
    assert users[0]["role"] == "admin"

def test_non_admin_cannot_access_admin_endpoints(client):
    """Test qu'un non-admin ne peut pas accéder aux endpoints admin"""
    # Créer un utilisateur normal
    client.post(
        "/auth/register",
        json={"email": "user@example.com", "password": "userpass123"}
    )
    
    # Se connecter
    login_response = client.post(
        "/auth/login",
        data={"username": "user@example.com", "password": "userpass123"}
    )
    token = login_response.json()["access_token"]
    
    # Tentative d'accès aux endpoints admin
    response = client.get(
        "/auth/admin/users",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 403
    assert "Admin permissions required" in response.json()["detail"]

def test_admin_can_change_user_role(client):
    """Test qu'un admin peut changer le rôle d'un utilisateur"""
    # Créer l'admin
    client.post(
        "/auth/create-first-admin",
        json={
            "username": "admin",
            "email": "admin@kevs-academy.com",
            "password": "admin123",
            "role": "admin"
        }
    )
    
    # Créer un utilisateur normal
    user_response = client.post(
        "/auth/register",
        json={"email": "user@example.com", "password": "userpass123"}
    )
    user_id = user_response.json()["id"]
    
    # Se connecter comme admin
    login_response = client.post(
        "/auth/login",
        data={"username": "admin@kevs-academy.com", "password": "admin123"}
    )
    admin_token = login_response.json()["access_token"]
    
    # Changer le rôle de l'utilisateur en instructor
    response = client.put(
        f"/auth/admin/users/{user_id}/role?new_role=instructor",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["role"] == "instructor"

def test_admin_cannot_promote_to_second_admin(client):
    """Test qu'un admin ne peut pas promouvoir quelqu'un d'autre admin"""
    # Créer l'admin
    client.post(
        "/auth/create-first-admin",
        json={
            "username": "admin",
            "email": "admin@kevs-academy.com",
            "password": "admin123",
            "role": "admin"
        }
    )
    
    # Créer un utilisateur normal
    user_response = client.post(
        "/auth/register",
        json={"email": "user@example.com", "password": "userpass123"}
    )
    user_id = user_response.json()["id"]
    
    # Se connecter comme admin
    login_response = client.post(
        "/auth/login",
        data={"username": "admin@kevs-academy.com", "password": "admin123"}
    )
    admin_token = login_response.json()["access_token"]
    
    # Tentative de promotion en admin
    response = client.put(
        f"/auth/admin/users/{user_id}/role?new_role=admin",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 400
    assert "An admin user already exists" in response.json()["detail"]

def test_admin_can_delete_regular_user(client):
    """Test qu'un admin peut supprimer un utilisateur normal"""
    # Créer l'admin
    client.post(
        "/auth/create-first-admin",
        json={
            "username": "admin",
            "email": "admin@kevs-academy.com",
            "password": "admin123",
            "role": "admin"
        }
    )
    
    # Créer un utilisateur normal
    user_response = client.post(
        "/auth/register",
        json={"email": "user@example.com", "password": "userpass123"}
    )
    user_id = user_response.json()["id"]
    
    # Se connecter comme admin
    login_response = client.post(
        "/auth/login",
        data={"username": "admin@kevs-academy.com", "password": "admin123"}
    )
    admin_token = login_response.json()["access_token"]
    
    # Supprimer l'utilisateur
    response = client.delete(
        f"/auth/admin/users/{user_id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    assert "User deleted successfully" in response.json()["message"]

def test_admin_cannot_delete_himself(client):
    """Test qu'un admin ne peut pas se supprimer (dernier admin)"""
    # Créer l'admin
    admin_response = client.post(
        "/auth/create-first-admin",
        json={
            "username": "admin",
            "email": "admin@kevs-academy.com",
            "password": "admin123",
            "role": "admin"
        }
    )
    admin_id = admin_response.json()["id"]
    
    # Se connecter comme admin
    login_response = client.post(
        "/auth/login",
        data={"username": "admin@kevs-academy.com", "password": "admin123"}
    )
    admin_token = login_response.json()["access_token"]
    
    # Tentative de suppression de soi-même
    response = client.delete(
        f"/auth/admin/users/{admin_id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 400
    assert "Cannot delete the last admin user" in response.json()["detail"]

def test_register_admin_endpoint_requires_admin(client):
    """Test que l'endpoint register-admin nécessite des droits admin"""
    # Créer un utilisateur normal
    client.post(
        "/auth/register",
        json={"email": "user@example.com", "password": "userpass123"}
    )
    
    # Se connecter
    login_response = client.post(
        "/auth/login",
        data={"username": "user@example.com", "password": "userpass123"}
    )
    user_token = login_response.json()["access_token"]
    
    # Tentative d'utilisation de register-admin
    response = client.post(
        "/auth/register-admin",
        json={
            "username": "instructor",
            "email": "instructor@example.com",
            "password": "instructorpass123",
            "role": "instructor"
        },
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 403
    assert "Admin permissions required" in response.json()["detail"] 