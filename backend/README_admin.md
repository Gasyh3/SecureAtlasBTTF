# Fonctionnalités Admin - Kevs Academy

Ce document décrit les fonctionnalités de gestion administrateur ajoutées à la plateforme e-learning.

## Vue d'ensemble

Le système supporte maintenant trois rôles d'utilisateur :
- **student** : Rôle par défaut, peut s'inscrire aux cours
- **instructor** : Peut créer et gérer des cours
- **admin** : Accès complet au système, un seul admin autorisé

## Contraintes importantes

### Un seul admin
- Il ne peut y avoir qu'un seul utilisateur avec le rôle `admin` dans le système
- Cette contrainte est appliquée à tous les niveaux (création, modification de rôle)
- Le dernier admin ne peut pas être supprimé ou rétrogradé

## Endpoints API Admin

### Création du premier admin
```http
POST /auth/create-first-admin
```
- **Accès** : Public (aucune authentification requise)
- **Usage** : Créer le tout premier admin du système
- **Restriction** : Fonctionne uniquement s'il n'y a aucun admin existant

**Exemple de requête :**
```json
{
  "username": "admin",
  "email": "admin@kevs-academy.com",
  "firstname": "Admin",
  "lastname": "Principal",
  "password": "admin123",
  "role": "admin"
}
```

### Création d'utilisateur avec rôle spécifique
```http
POST /auth/register-admin
```
- **Accès** : Admin uniquement
- **Usage** : Créer un utilisateur avec un rôle spécifique
- **Restriction** : Bloque la création d'un second admin

### Gestion des utilisateurs

#### Lister tous les utilisateurs
```http
GET /auth/admin/users
```
- **Accès** : Admin uniquement
- **Retour** : Liste complète de tous les utilisateurs avec leurs détails

#### Supprimer un utilisateur
```http
DELETE /auth/admin/users/{user_id}
```
- **Accès** : Admin uniquement
- **Restriction** : Ne peut pas supprimer le dernier admin

#### Modifier le rôle d'un utilisateur
```http
PUT /auth/admin/users/{user_id}/role?new_role={role}
```
- **Accès** : Admin uniquement
- **Rôles disponibles** : `student`, `instructor`, `admin`
- **Restrictions** :
  - Ne peut pas promouvoir au rôle admin s'il y en a déjà un
  - Ne peut pas rétrograder le dernier admin

## Dépendances FastAPI

### Nouvelles dépendances disponibles

```python
# Pour les endpoints nécessitant un admin
from routers.dependencies import get_current_admin

# Pour les endpoints nécessitant un instructor ou admin
from routers.dependencies import get_current_instructor_or_admin
```

**Exemples d'utilisation :**
```python
@router.get("/admin-only")
def admin_endpoint(current_admin: User = Depends(get_current_admin)):
    # Seuls les admins peuvent accéder
    pass

@router.get("/instructor-or-admin")
def privileged_endpoint(current_user: User = Depends(get_current_instructor_or_admin)):
    # Instructors et admins peuvent accéder
    pass
```

## Tests

### Script de test automatisé
Un script de test complet est disponible :
```bash
cd backend
./test_admin.sh
```

Ce script teste :
- ✅ Création du premier admin sans authentification
- ✅ Authentification admin
- ✅ Accès aux endpoints admin
- ✅ Gestion des rôles utilisateurs
- ✅ Protection contre la création de multiples admins
- ✅ Protection contre la suppression du dernier admin
- ✅ Contrôle d'accès basé sur les rôles

### Tests manuels avec curl

**1. Créer le premier admin :**
```bash
curl -X POST "http://localhost:8000/auth/create-first-admin" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@kevs-academy.com",
    "firstname": "Admin",
    "lastname": "Principal",
    "password": "admin123",
    "role": "admin"
  }'
```

**2. Se connecter comme admin :**
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@kevs-academy.com&password=admin123"
```

**3. Lister tous les utilisateurs :**
```bash
curl -X GET "http://localhost:8000/auth/admin/users" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Sécurité

### Mesures de protection
- **Authentification JWT** : Tous les endpoints admin nécessitent un token valide
- **Vérification de rôle** : Contrôle strict des permissions
- **Contrainte d'unicité** : Un seul admin autorisé
- **Protection du dernier admin** : Impossible de supprimer ou rétrograder

### Recommandations
- Utilisez un mot de passe fort pour l'admin
- Gardez les tokens d'admin sécurisés
- Logguez les actions administratives importantes
- Sauvegardez régulièrement la base de données

## Migration depuis un système existant

Si vous avez déjà des utilisateurs dans votre base :

1. **Identifier un admin** : Choisissez un utilisateur existant à promouvoir
2. **Mise à jour manuelle** : Modifiez directement en base :
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'votre-admin@email.com';
   ```
3. **Vérification** : Testez l'authentification avec les nouveaux endpoints

## Logs et surveillance

Les actions admin importantes génèrent des logs. Surveillez :
- Tentatives de création de multiples admins
- Modifications de rôles
- Suppressions d'utilisateurs
- Accès non autorisés aux endpoints admin 