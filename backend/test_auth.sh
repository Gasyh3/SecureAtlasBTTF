#!/bin/bash

# Script de test pour l'authentification de l'API E-Learning
# Assurez-vous que l'API est démarrée sur http://localhost:8000

BASE_URL="http://localhost:8000"
EMAIL="test@example.com"
PASSWORD="testpassword123"

echo "🚀 Test de l'authentification E-Learning API"
echo "============================================="

# Test 1: Inscription
echo ""
echo "📝 1. Test d'inscription..."
REGISTER_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"${EMAIL}\", \"password\": \"${PASSWORD}\"}")

HTTP_STATUS=$(echo $REGISTER_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
RESPONSE_BODY=$(echo $REGISTER_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')

echo "Status: $HTTP_STATUS"
echo "Response: $RESPONSE_BODY"

if [ $HTTP_STATUS -eq 201 ]; then
    echo "✅ Inscription réussie!"
elif [ $HTTP_STATUS -eq 400 ]; then
    echo "⚠️  Utilisateur déjà existant (normal si déjà testé)"
else
    echo "❌ Erreur lors de l'inscription"
    exit 1
fi

# Test 2: Connexion
echo ""
echo "🔐 2. Test de connexion..."
LOGIN_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=${EMAIL}&password=${PASSWORD}")

HTTP_STATUS=$(echo $LOGIN_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
RESPONSE_BODY=$(echo $LOGIN_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')

echo "Status: $HTTP_STATUS"
echo "Response: $RESPONSE_BODY"

if [ $HTTP_STATUS -eq 200 ]; then
    echo "✅ Connexion réussie!"
    
    # Extraire le token
    TOKEN=$(echo $RESPONSE_BODY | sed 's/.*"access_token":"\([^"]*\)".*/\1/')
    echo "🔑 Token: ${TOKEN:0:50}..."
    
    # Test 3: Utilisation du token
    echo ""
    echo "🧪 3. Test d'utilisation du token..."
    API_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET "${BASE_URL}/api/courses" \
      -H "Authorization: Bearer $TOKEN")
    
    HTTP_STATUS=$(echo $API_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    RESPONSE_BODY=$(echo $API_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')
    
    echo "Status: $HTTP_STATUS"
    echo "Response: $RESPONSE_BODY"
    
    if [ $HTTP_STATUS -eq 200 ]; then
        echo "✅ Token valide, API accessible!"
    else
        echo "⚠️  Problème avec l'autorisation"
    fi
    
else
    echo "❌ Erreur lors de la connexion"
    exit 1
fi

# Test 4: Connexion avec mauvais mot de passe
echo ""
echo "🚫 4. Test de connexion avec mauvais mot de passe..."
BAD_LOGIN_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=${EMAIL}&password=wrongpassword")

HTTP_STATUS=$(echo $BAD_LOGIN_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [ $HTTP_STATUS -eq 401 ]; then
    echo "✅ Rejet correct des mauvais identifiants!"
else
    echo "⚠️  Problème de sécurité: mauvais identifiants acceptés"
fi

echo ""
echo "🎉 Tests terminés!"
echo ""
echo "💡 Commandes utiles:"
echo "Inscription: curl -X POST \"${BASE_URL}/auth/register\" -H \"Content-Type: application/json\" -d '{\"email\": \"user@test.com\", \"password\": \"password123\"}'"
echo "Connexion:   curl -X POST \"${BASE_URL}/auth/login\" -H \"Content-Type: application/x-www-form-urlencoded\" -d \"username=user@test.com&password=password123\"" 