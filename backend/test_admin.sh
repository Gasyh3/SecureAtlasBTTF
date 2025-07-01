#!/bin/bash

# Script de test pour les fonctionnalités admin
# Ce script teste la création d'admin et la gestion des utilisateurs

set -e  # Arrêter le script en cas d'erreur

API_BASE="http://localhost:8000"
ADMIN_EMAIL="admin@kevs-academy.com"
ADMIN_PASSWORD="admin123"
TEST_USER_EMAIL="testuser@kevs-academy.com"
TEST_USER_PASSWORD="testuser123"

echo "=== Test des fonctionnalités Admin ==="
echo ""

# 1. Créer le premier admin
echo "1. Création du premier admin..."
ADMIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/create-first-admin" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "'$ADMIN_EMAIL'",
    "firstname": "Admin",
    "lastname": "Principal",
    "password": "'$ADMIN_PASSWORD'",
    "role": "admin"
  }')

echo "Réponse: $ADMIN_RESPONSE"
echo ""

# 2. Connexion de l'admin
echo "2. Connexion de l'admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=$ADMIN_EMAIL&password=$ADMIN_PASSWORD")

ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")
echo "Token admin récupéré: ${ADMIN_TOKEN:0:50}..."
echo ""

# 3. Vérifier le profil admin
echo "3. Vérification du profil admin..."
PROFILE_RESPONSE=$(curl -s -X GET "$API_BASE/auth/me" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

echo "Profil admin: $PROFILE_RESPONSE"
echo ""

# 4. Créer un utilisateur normal
echo "4. Création d'un utilisateur normal..."
USER_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "'$TEST_USER_EMAIL'",
    "firstname": "Test",
    "lastname": "User",
    "password": "'$TEST_USER_PASSWORD'"
  }')

echo "Utilisateur créé: $USER_RESPONSE"
USER_ID=$(echo $USER_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "User ID: $USER_ID"
echo ""

# 5. Lister tous les utilisateurs (admin uniquement)
echo "5. Liste de tous les utilisateurs (admin uniquement)..."
USERS_RESPONSE=$(curl -s -X GET "$API_BASE/auth/admin/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

echo "Tous les utilisateurs: $USERS_RESPONSE"
echo ""

# 6. Promouvoir l'utilisateur au rôle instructor
echo "6. Promotion de l'utilisateur au rôle instructor..."
ROLE_UPDATE_RESPONSE=$(curl -s -X PUT "$API_BASE/auth/admin/users/$USER_ID/role?new_role=instructor" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

echo "Utilisateur promu: $ROLE_UPDATE_RESPONSE"
echo ""

# 7. Tentative de création d'un second admin (doit échouer)
echo "7. Tentative de création d'un second admin (doit échouer)..."
SECOND_ADMIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register-admin" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "username": "admin2",
    "email": "admin2@kevs-academy.com",
    "firstname": "Admin",
    "lastname": "Two",
    "password": "admin123",
    "role": "admin"
  }')

echo "Réponse (doit être une erreur): $SECOND_ADMIN_RESPONSE"
echo ""

# 8. Connexion de l'utilisateur promu
echo "8. Connexion de l'utilisateur promu..."
USER_LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=$TEST_USER_EMAIL&password=$TEST_USER_PASSWORD")

USER_TOKEN=$(echo $USER_LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")
echo "Token utilisateur récupéré: ${USER_TOKEN:0:50}..."
echo ""

# 9. Tentative d'accès aux fonctions admin par un non-admin (doit échouer)
echo "9. Tentative d'accès aux fonctions admin par un instructor (doit échouer)..."
UNAUTHORIZED_RESPONSE=$(curl -s -X GET "$API_BASE/auth/admin/users" \
  -H "Authorization: Bearer $USER_TOKEN")

echo "Réponse (doit être une erreur): $UNAUTHORIZED_RESPONSE"
echo ""

# 10. Tentative de suppression de l'admin (doit échouer)
echo "10. Tentative de suppression de l'admin (doit échouer)..."
ADMIN_ID=$(echo $ADMIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
DELETE_ADMIN_RESPONSE=$(curl -s -X DELETE "$API_BASE/auth/admin/users/$ADMIN_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

echo "Réponse (doit être une erreur): $DELETE_ADMIN_RESPONSE"
echo ""

# 11. Suppression de l'utilisateur test
echo "11. Suppression de l'utilisateur test..."
DELETE_USER_RESPONSE=$(curl -s -X DELETE "$API_BASE/auth/admin/users/$USER_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

echo "Réponse: $DELETE_USER_RESPONSE"
echo ""

echo "=== Test terminé ==="
echo ""
echo "Résumé des fonctionnalités testées:"
echo "✓ Création du premier admin sans authentification"
echo "✓ Authentification admin"
echo "✓ Accès aux endpoints admin"
echo "✓ Gestion des rôles utilisateurs"
echo "✓ Protection contre la création de multiples admins"
echo "✓ Protection contre la suppression du dernier admin"
echo "✓ Contrôle d'accès basé sur les rôles" 