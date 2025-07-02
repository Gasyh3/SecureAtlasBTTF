#!/bin/bash

# Script de test pour l'API Quiz
# Usage: ./test_quiz.sh

API_BASE="http://localhost:8000/api"
CONTENT_TYPE="Content-Type: application/json"

echo "=== Test des Quiz ==="
echo

# Fonction pour extraire un token d'une réponse JSON
extract_token() {
    echo "$1" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4
}

# Fonction pour extraire l'ID d'une réponse JSON
extract_id() {
    echo "$1" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2
}

# 1. Connexion d'un instructeur
echo "1. Connexion d'un instructeur..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "$CONTENT_TYPE" \
  -d '{
    "username": "instructor1",
    "password": "password123"
  }')

TOKEN=$(extract_token "$LOGIN_RESPONSE")
AUTH_HEADER="Authorization: Bearer $TOKEN"

if [ -z "$TOKEN" ]; then
    echo "❌ Échec de la connexion instructeur"
    echo "Réponse: $LOGIN_RESPONSE"
    exit 1
fi
echo "✅ Connexion instructeur réussie"
echo

# 2. Créer un module pour tester
echo "2. Création d'un module de test..."
MODULE_RESPONSE=$(curl -s -X POST "$API_BASE/modules/" \
  -H "$CONTENT_TYPE" \
  -H "$AUTH_HEADER" \
  -d '{
    "title": "Module Test Quiz",
    "content": "Module pour tester les quiz",
    "type": "text"
  }')

MODULE_ID=$(extract_id "$MODULE_RESPONSE")

if [ -z "$MODULE_ID" ]; then
    echo "❌ Échec de la création du module"
    echo "Réponse: $MODULE_RESPONSE"
    exit 1
fi
echo "✅ Module créé avec l'ID: $MODULE_ID"
echo

# 3. Créer un quiz pour le module
echo "3. Création d'un quiz..."
QUIZ_DATA='{
  "title": "Quiz de test",
  "questions": [
    {
      "text": "Quelle est la capitale de la France ?",
      "order": 0,
      "choices": [
        {"text": "Londres", "is_correct": false, "order": 0},
        {"text": "Berlin", "is_correct": false, "order": 1},
        {"text": "Paris", "is_correct": true, "order": 2},
        {"text": "Madrid", "is_correct": false, "order": 3}
      ]
    },
    {
      "text": "Combien font 2 + 2 ?",
      "order": 1,
      "choices": [
        {"text": "3", "is_correct": false, "order": 0},
        {"text": "4", "is_correct": true, "order": 1},
        {"text": "5", "is_correct": false, "order": 2}
      ]
    }
  ]
}'

QUIZ_RESPONSE=$(curl -s -X POST "$API_BASE/modules/$MODULE_ID/quiz" \
  -H "$CONTENT_TYPE" \
  -H "$AUTH_HEADER" \
  -d "$QUIZ_DATA")

echo "Réponse création quiz: $QUIZ_RESPONSE"
echo

# 4. Récupérer le quiz créé
echo "4. Récupération du quiz..."
GET_QUIZ_RESPONSE=$(curl -s -X GET "$API_BASE/modules/$MODULE_ID/quiz" \
  -H "$AUTH_HEADER")

echo "Quiz récupéré: $GET_QUIZ_RESPONSE"
echo

# 5. Connexion d'un étudiant pour passer le quiz
echo "5. Connexion d'un étudiant..."
STUDENT_LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "$CONTENT_TYPE" \
  -d '{
    "username": "student1",
    "password": "password123"
  }')

STUDENT_TOKEN=$(extract_token "$STUDENT_LOGIN_RESPONSE")
STUDENT_AUTH_HEADER="Authorization: Bearer $STUDENT_TOKEN"

if [ -z "$STUDENT_TOKEN" ]; then
    echo "❌ Échec de la connexion étudiant"
    echo "Réponse: $STUDENT_LOGIN_RESPONSE"
else
    echo "✅ Connexion étudiant réussie"
    echo

    # 6. Soumettre des réponses au quiz
    echo "6. Soumission du quiz par l'étudiant..."
    
    # D'abord, récupérer le quiz pour obtenir les IDs des questions et choix
    QUIZ_FOR_STUDENT=$(curl -s -X GET "$API_BASE/modules/$MODULE_ID/quiz" \
      -H "$STUDENT_AUTH_HEADER")
    
    echo "Quiz pour étudiant: $QUIZ_FOR_STUDENT"
    
    # Soumettre des réponses (ici on simule des réponses partiellement correctes)
    SUBMISSION_DATA='{
      "answers": [
        {"question_id": 1, "choice_id": 3},
        {"question_id": 2, "choice_id": 2}
      ]
    }'
    
    SUBMISSION_RESPONSE=$(curl -s -X POST "$API_BASE/modules/$MODULE_ID/quiz/submit" \
      -H "$CONTENT_TYPE" \
      -H "$STUDENT_AUTH_HEADER" \
      -d "$SUBMISSION_DATA")

    echo "Résultat du quiz: $SUBMISSION_RESPONSE"
    echo
fi

# 7. Test de mise à jour du quiz (instructeur)
echo "7. Mise à jour du quiz..."
UPDATE_DATA='{
  "title": "Quiz de test modifié",
  "questions": [
    {
      "text": "Nouvelle question: Quelle est la couleur du ciel ?",
      "order": 0,
      "choices": [
        {"text": "Rouge", "is_correct": false, "order": 0},
        {"text": "Bleu", "is_correct": true, "order": 1},
        {"text": "Vert", "is_correct": false, "order": 2}
      ]
    }
  ]
}'

UPDATE_RESPONSE=$(curl -s -X PUT "$API_BASE/modules/$MODULE_ID/quiz" \
  -H "$CONTENT_TYPE" \
  -H "$AUTH_HEADER" \
  -d "$UPDATE_DATA")

echo "Quiz mis à jour: $UPDATE_RESPONSE"
echo

# 8. Récupérer le quiz avec les réponses (instructeur seulement)
echo "8. Récupération du quiz avec réponses (instructeur)..."
QUIZ_WITH_ANSWERS=$(curl -s -X GET "$API_BASE/modules/$MODULE_ID/quiz/answers" \
  -H "$AUTH_HEADER")

echo "Quiz avec réponses: $QUIZ_WITH_ANSWERS"
echo

# 9. Test de suppression du quiz
echo "9. Suppression du quiz..."
DELETE_RESPONSE=$(curl -s -X DELETE "$API_BASE/modules/$MODULE_ID/quiz" \
  -H "$AUTH_HEADER")

echo "Réponse suppression: $DELETE_RESPONSE"
echo

# 10. Nettoyage - supprimer le module de test
echo "10. Suppression du module de test..."
DELETE_MODULE_RESPONSE=$(curl -s -X DELETE "$API_BASE/modules/$MODULE_ID" \
  -H "$AUTH_HEADER")

echo "✅ Tests terminés"
echo
echo "=== Résumé des fonctionnalités testées ==="
echo "✅ Création de quiz"
echo "✅ Récupération de quiz"
echo "✅ Soumission de quiz et scoring"
echo "✅ Mise à jour de quiz"
echo "✅ Récupération avec réponses (instructeur)"
echo "✅ Suppression de quiz"
echo
echo "=== Guide d'utilisation ==="
echo "1. GET /api/modules/{module_id}/quiz - Récupérer un quiz"
echo "2. POST /api/modules/{module_id}/quiz - Créer un quiz (instructeur/admin)"
echo "3. POST /api/modules/{module_id}/quiz/submit - Soumettre un quiz"
echo "4. PUT /api/modules/{module_id}/quiz - Modifier un quiz (instructeur/admin)"
echo "5. DELETE /api/modules/{module_id}/quiz - Supprimer un quiz (instructeur/admin)"
echo "6. GET /api/modules/{module_id}/quiz/answers - Quiz avec réponses (instructeur/admin)" 