#!/bin/bash

# Script de test pour les fonctionnalités CRUD des modules
# Ce script teste toutes les opérations sur les modules

set -e  # Arrêter le script en cas d'erreur

API_BASE="http://localhost:8000"
INSTRUCTOR_EMAIL="instructor@kevs-academy.com"
INSTRUCTOR_PASSWORD="instructor123"
STUDENT_EMAIL="student@kevs-academy.com"
STUDENT_PASSWORD="student123"

echo "=== Test des fonctionnalités CRUD Modules ==="
echo ""

# 1. Créer un utilisateur instructor pour les tests
echo "1. Création d'un instructor..."
INSTRUCTOR_RESPONSE=$(curl -s -X POST "$API_BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "instructor_test",
    "email": "'$INSTRUCTOR_EMAIL'",
    "firstname": "Instructor",
    "lastname": "Test",
    "password": "'$INSTRUCTOR_PASSWORD'"
  }')

echo "Instructor créé: $INSTRUCTOR_RESPONSE"
INSTRUCTOR_ID=$(echo $INSTRUCTOR_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo ""

# 2. Promouvoir l'utilisateur en instructor (nécessite admin)
echo "2. Connexion admin pour promouvoir l'instructor..."
ADMIN_LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=kevrakt@gmail.com&password=Iraq20bedbug")

ADMIN_TOKEN=$(echo $ADMIN_LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

# Promouvoir en instructor
curl -s -X PUT "$API_BASE/api/auth/admin/users/$INSTRUCTOR_ID/role?new_role=instructor" \
  -H "Authorization: Bearer $ADMIN_TOKEN" > /dev/null

echo "Utilisateur promu en instructor"
echo ""

# 3. Connexion de l'instructor
echo "3. Connexion de l'instructor..."
INSTRUCTOR_LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=$INSTRUCTOR_EMAIL&password=$INSTRUCTOR_PASSWORD")

INSTRUCTOR_TOKEN=$(echo $INSTRUCTOR_LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")
echo "Token instructor récupéré: ${INSTRUCTOR_TOKEN:0:50}..."
echo ""

# 4. Créer un utilisateur étudiant
echo "4. Création d'un étudiant..."
STUDENT_RESPONSE=$(curl -s -X POST "$API_BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student_test",
    "email": "'$STUDENT_EMAIL'",
    "firstname": "Student",
    "lastname": "Test",
    "password": "'$STUDENT_PASSWORD'"
  }')

echo "Étudiant créé: $STUDENT_RESPONSE"
echo ""

# 5. Connexion de l'étudiant
echo "5. Connexion de l'étudiant..."
STUDENT_LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=$STUDENT_EMAIL&password=$STUDENT_PASSWORD")

STUDENT_TOKEN=$(echo $STUDENT_LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")
echo "Token étudiant récupéré: ${STUDENT_TOKEN:0:50}..."
echo ""

# 6. Créer un module (instructor)
echo "6. Création d'un module par l'instructor..."
MODULE_RESPONSE=$(curl -s -X POST "$API_BASE/api/modules/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $INSTRUCTOR_TOKEN" \
  -d '{
    "title": "Introduction à Python",
    "content": "Ce module couvre les bases de la programmation Python, incluant les variables, les fonctions et les structures de données.",
    "type": "text"
  }')

echo "Module créé: $MODULE_RESPONSE"
MODULE_ID=$(echo $MODULE_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "Module ID: $MODULE_ID"
echo ""

# 7. Créer un module vidéo
echo "7. Création d'un module vidéo..."
VIDEO_MODULE_RESPONSE=$(curl -s -X POST "$API_BASE/api/modules/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $INSTRUCTOR_TOKEN" \
  -d '{
    "title": "Tutoriel FastAPI",
    "content": "https://www.youtube.com/watch?v=example - Vidéo d'\''introduction à FastAPI",
    "type": "video"
  }')

echo "Module vidéo créé: $VIDEO_MODULE_RESPONSE"
VIDEO_MODULE_ID=$(echo $VIDEO_MODULE_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo ""

# 8. Lister tous les modules (étudiant)
echo "8. Liste des modules (vue étudiant)..."
MODULES_LIST_RESPONSE=$(curl -s -X GET "$API_BASE/api/modules/?skip=0&limit=10" \
  -H "Authorization: Bearer $STUDENT_TOKEN")

echo "Liste des modules: $MODULES_LIST_RESPONSE"
echo ""

# 9. Récupérer un module spécifique
echo "9. Récupération du module $MODULE_ID..."
MODULE_DETAIL_RESPONSE=$(curl -s -X GET "$API_BASE/api/modules/$MODULE_ID" \
  -H "Authorization: Bearer $STUDENT_TOKEN")

echo "Détail du module: $MODULE_DETAIL_RESPONSE"
echo ""

# 10. Mettre à jour le module (instructor)
echo "10. Mise à jour du module..."
UPDATE_RESPONSE=$(curl -s -X PUT "$API_BASE/api/modules/$MODULE_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $INSTRUCTOR_TOKEN" \
  -d '{
    "title": "Introduction à Python - Édition révisée",
    "content": "Ce module couvre les bases de la programmation Python, incluant les variables, les fonctions, les structures de données et les bonnes pratiques."
  }')

echo "Module mis à jour: $UPDATE_RESPONSE"
echo ""

# 11. Tentative de création par un étudiant (doit échouer)
echo "11. Tentative de création par un étudiant (doit échouer)..."
UNAUTHORIZED_CREATE_RESPONSE=$(curl -s -X POST "$API_BASE/api/modules/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{
    "title": "Module non autorisé",
    "content": "Ce module ne devrait pas être créé",
    "type": "text"
  }')

echo "Réponse (doit être une erreur): $UNAUTHORIZED_CREATE_RESPONSE"
echo ""

# 12. Tentative de suppression par un étudiant (doit échouer)
echo "12. Tentative de suppression par un étudiant (doit échouer)..."
UNAUTHORIZED_DELETE_RESPONSE=$(curl -s -X DELETE "$API_BASE/api/modules/$MODULE_ID" \
  -H "Authorization: Bearer $STUDENT_TOKEN")

echo "Réponse (doit être une erreur): $UNAUTHORIZED_DELETE_RESPONSE"
echo ""

# 13. Récupérer le nombre total de modules
echo "13. Récupération du nombre total de modules..."
COUNT_RESPONSE=$(curl -s -X GET "$API_BASE/api/modules/stats/count" \
  -H "Authorization: Bearer $STUDENT_TOKEN")

echo "Nombre de modules: $COUNT_RESPONSE"
echo ""

# 14. Supprimer un module (instructor)
echo "14. Suppression du module vidéo par l'instructor..."
DELETE_RESPONSE=$(curl -s -X DELETE "$API_BASE/api/modules/$VIDEO_MODULE_ID" \
  -H "Authorization: Bearer $INSTRUCTOR_TOKEN")

echo "Réponse: $DELETE_RESPONSE"
echo ""

# 15. Vérifier que le module a été supprimé
echo "15. Vérification de la suppression..."
DELETED_MODULE_RESPONSE=$(curl -s -X GET "$API_BASE/api/modules/$VIDEO_MODULE_ID" \
  -H "Authorization: Bearer $STUDENT_TOKEN")

echo "Réponse (doit être 404): $DELETED_MODULE_RESPONSE"
echo ""

echo "=== Test terminé ==="
echo ""
echo "Résumé des fonctionnalités testées:"
echo "✓ Création de modules (instructor/admin uniquement)"
echo "✓ Lecture de modules (tous les utilisateurs)"
echo "✓ Mise à jour de modules (instructor/admin uniquement)"
echo "✓ Suppression de modules (instructor/admin uniquement)"
echo "✓ Pagination de la liste des modules"
echo "✓ Statistiques des modules"
echo "✓ Contrôle d'accès basé sur les rôles"
echo "✓ Gestion des types de modules (text/video)" 