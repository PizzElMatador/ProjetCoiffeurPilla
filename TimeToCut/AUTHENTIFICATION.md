# Interface d'authentification - Guide d'intégration

## 📋 Vue d'ensemble

Vous avez maintenant une interface React complète pour l'authentification client avec :

- ✅ **Page d'accueil (Home)** - Landing page avec présentation
- ✅ **Page de connexion (Login)** - Formulaire de connexion client
- ✅ **Page d'inscription (SignUp)** - Formulaire d'inscription avec validation
- ✅ **Routing** - Navigation automatique avec React Router
- ✅ **API intégration** - Appels à l'API PHP configurés

## 🎨 Pages créées

### 1. Home (`/`)
- Landing page principale
- Boutons de navigation vers Login/SignUp
- Présentation des services
- Redirige vers prestations si l'utilisateur est connecté

### 2. Login (`/login`)
- Formulaire de connexion avec email/password
- Validation des champs
- Stockage du token et données utilisateur
- Redirection automatique vers `/prestations` après succès

### 3. SignUp (`/signup`)
- Formulaire complet avec : nom, prénom, email, téléphone, password
- Validation côté client
- Confirmation du mot de passe
- Redirection automatique après inscription

## 🔌 Configuration API

Les appels API sont configurés pour communiquer avec votre API PHP sur `http://localhost:8000`.

### Points de terminaison requis sur PHP

Vous devez créer ces endpoints dans votre API PHP :

#### 1. **POST /api/client/login**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Réponse esperée :**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "user@example.com",
    "telephone": "0612345678"
  }
}
```

#### 2. **POST /api/client/signup**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "user@example.com",
  "telephone": "0612345678",
  "password": "password123"
}
```
**Réponse esperée :**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "user@example.com",
    "telephone": "0612345678"
  }
}
```

#### 3. **GET /api/client/verify**
Headers:
```
Authorization: Bearer jwt_token_here
```
**Réponse esperée :**
```json
{
  "id": 1,
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "user@example.com",
  "telephone": "0612345678"
}
```

#### 4. **POST /api/client/logout**
Headers:
```
Authorization: Bearer jwt_token_here
```

## 📦 Stockage des données

Les données sont stockées localement :
- `clientToken` - Token JWT dans `localStorage`
- `clientData` - Données utilisateur en JSON

```javascript
// Récupérer les données
const token = localStorage.getItem('clientToken');
const user = JSON.parse(localStorage.getItem('clientData'));

// Effacer (logout)
localStorage.removeItem('clientToken');
localStorage.removeItem('clientData');
```

## 🎯 Prochaines étapes

1. **Créer les endpoints PHP** pour login/signup client
2. **Tester les formulaires** avec votre API PHP
3. **Créer les pages client** (Prestations, Salons, etc.)
4. **Ajouter la protection** des routes authentifiées
5. **Intégrer l'API prestations/salons** existante

## 💻 Commandes de démarrage

```bash
# Démarrer le serveur de développement React
npm run dev

# Démarrer l'API PHP (si pas déjà démarrée)
php -S localhost:8000 -t api
```

L'app sera accessible sur `http://localhost:5173`

## 🔐 Sécurité

- Les mots de passe ne sont jamais stockés en clair
- Les tokens JWT sont utilisés pour l'authentification
- CORS est configuré sur l'API PHP
- Validation côté client et serveur

## 📝 Notes

- Les emails utilisés doivent être uniques dans la base de données
- Les numéros de téléphone sont stockés en format texte
- Le mot de passe minimum est 6 caractères (à adapter selon vos besoins)
- Les tokens doivent expirer après un certain temps (à configurer en PHP)
