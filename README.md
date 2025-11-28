# GDU WacDo API

API REST pour la gestion des produits, menus, utilisateurs et commandes d'un système type restaurant (workflow préparation / accueil). Elle inclut une documentation Swagger personnalisée et des mécanismes de sécurité (JWT, rate limiting, Helmet, rôles).

## Sommaire
1. Fonctionnalités
2. Stack & Dépendances
3. Architecture du projet
4. Démarrage rapide
5. Variables d'environnement
6. Sécurité & Middleware
7. Documentation API (Swagger)
8. Endpoints principaux & Rôles
9. Modèles et constantes
10. Statique & Uploads
11. Déploiement (Vercel / Production)
12. Licence

---
## 1. Fonctionnalités
- Gestion des utilisateurs (inscription par admin, login public, suppression)
- Authentification via JWT + autorisation par rôles (`admin`, `preparateur`, `accueil`)
- Gestion des produits (CRUD) par rôle `admin`
- Gestion des menus (CRUD + association de produits) par rôle `admin`
- Gestion des commandes avec statut & filtrage par statut (accueil / préparateur / admin)
- Rate limiting global (100 requêtes / 15 min par IP)
- CORS activé pour toutes les routes
- Sécurisation Helmet + CSP adaptée à Swagger
- Documentation Swagger servie via `/api-docs` et `/api-docs.json`
- Validation des entrées avec `express-validator`
- Uploads statiques servis via `/uploads`

## 2. Stack & Dépendances
| Catégorie | Librairies |
|-----------|------------|
| Serveur | express |
| Sécurité | helmet, jsonwebtoken, bcryptjs, express-rate-limit, cors |
| Validation | express-validator |
| Base de données | mongoose (MongoDB) |
| Docs API | swagger-jsdoc, swagger-ui-express |
| Uploads | multer |
| Outils dev | nodemon, dotenv |

## 3. Architecture du projet
```
app.js                # Point d'entrée de l'application
swagger.js            # Setup & rendu Swagger personnalisé
config/               # Configuration (DB, constantes)
  db.js               # Connexion MongoDB
  constants.js        # Listes (rôles, statuts, catégories)
controllers/          # Logique métier des ressources
middleware/           # Auth, validators
models/               # Schémas Mongoose (Product, Menu, Order, User)
routes/               # Définition des endpoints & protection
uploads/              # Fichiers statiques (dev) / /tmp (prod Vercel)
```

## 4. Démarrage rapide
### Installation
```bash
npm install
```
### Fichier `.env` (voir section 5)
Créez un fichier `.env` à la racine.
### Lancer en développement
```bash
PORT=8000 npm run dev
```
Application disponible sur: `http://localhost:8000`

## 5. Variables d'environnement
| Variable | Description | Exemple |
|----------|-------------|---------|
| `PORT` | Port d'écoute local | `8000` |
| `DB_CONNECTION_STRING` | Chaîne MongoDB | `mongodb+srv://user:pass@host/db` |
| `NODE_ENV` | Environnement (`development` / `production` / `test`) | `development` |
| `JWT_SECRET` | Secret de signature JWT (si non hardcodé) | `supersecret` |

> Assurez-vous que `DB_CONNECTION_STRING` est valide avant lancement.

## 6. Sécurité & Middleware
- `helmet` : CSP restreinte + autorisations pour CDN Swagger (`unpkg`, `cdnjs`)
- `cors` : Ouvert à toutes les origines (adapter si besoin)
- `express-rate-limit` : 100 requêtes / 15 min / IP
- Authentification: Middleware `auth` vérifie JWT
- Autorisation: Middleware `authorize(...roles)` restreint selon rôle
- Validation: `express-validator` + handlers dans `middleware/validators.js`

## 7. Documentation API (Swagger)
- JSON: `GET /api-docs.json`
- UI: `GET /api-docs` (HTML custom sans dépendance locale, adapté à Vercel/CDN)
- Schémas générés à partir des annotations JSDoc dans `routes/*.js`
- Sécurité: `bearerAuth` (JWT) – saisir le token (sans préfixe `Bearer`)

## 8. Endpoints principaux & Rôles
### Auth & Utilisateurs (`/api/users`)
| Méthode | Route | Rôle requis | Description |
|---------|-------|-------------|-------------|
| POST | `/api/users/login` | Public | Connexion (obtention JWT) |
| GET | `/api/users/` | `admin` | Liste des utilisateurs |
| POST | `/api/users/register` | `admin` | Création utilisateur (rôles) |
| DELETE | `/api/users/:id` | `admin` | Suppression utilisateur |

### Produits (`/api/products`) – protégées (`admin`)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/products/` | Liste produits |
| GET | `/api/products/category/:category` | Filtrer par catégorie |
| GET | `/api/products/:id` | Détail produit |
| POST | `/api/products/` | Création produit |
| PUT | `/api/products/:id` | Mise à jour produit |
| DELETE | `/api/products/:id` | Suppression produit |

### Menus (`/api/menus`) – protégées (`admin`)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/menus/` | Liste menus |
| GET | `/api/menus/:id` | Détail menu |
| POST | `/api/menus/` | Création menu |
| PUT | `/api/menus/:id` | Mise à jour menu |
| PATCH | `/api/menus/:id/products` | Associer / modifier produits du menu |
| DELETE | `/api/menus/:id` | Suppression menu |

### Commandes (`/api/orders`) – toutes protégées (JWT)
| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/api/orders/` | `admin` | Liste complète |
| GET | `/api/orders/status/:status` | `preparateur`, `accueil` | Filtrer par statut |
| GET | `/api/orders/:orderNumber` | `accueil` | Détail par numéro |
| POST | `/api/orders/` | `accueil` | Création commande |
| PATCH | `/api/orders/:id/status` | `preparateur`, `accueil` | Changer statut |
| DELETE | `/api/orders/:id` | `admin` | Supprimer commande |

## 9. Modèles & Constantes
Depuis `config/constants.js` :
- Catégories produits: `burger`, `salade`, `boisson`, `dessert`, `option`
- Statuts commande: `en_attente`, `en_preparation`, `preparee`, `livree`
- Rôles: `admin`, `preparateur`, `accueil`
- Modèles manipulables: `Product`, `Menu`

## 10. Statique & Uploads
- En dev: fichiers servis depuis le dossier `uploads/` via `/uploads`
- En prod (Vercel): sert depuis `/tmp`
- Adapter la logique si besoin d'un stockage persistant (S3, etc.)

## 11. Déploiement (Vercel / Production)
Points d'attention:
- `app.set('trust proxy', 1)` activé en production pour gérer rate limit & IP réelle
- Assurez un secret JWT robuste (variable d'environnement à introduire si manquant)
- Les fichiers uploadés ne sont pas persistants sur Vercel (`/tmp` éphémère)
- Swagger UI chargé via CDN (aucun build nécessaire)

## 12. Licence
Projet sous licence ISC (cf. `package.json`).

---
## Commandes utiles
```bash
npm run dev        # Lancer le serveur avec nodemon
```

## Exemple de requête (login)
```http
POST /api/users/login
Content-Type: application/json
{
  "email": "admin@example.com",
  "password": "motdepasse"
}
```
Réponse (succès):
```json
{
  "token": "<JWT>"
}
```
Utilisation ensuite:
```
Authorization: Bearer <JWT>
```
