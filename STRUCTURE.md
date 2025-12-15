# Structure du Projet TrajetCamen

## 📁 Architecture Globale

```
trajetCamen/
├── client/                          # Frontend React + Vite
├── server/                          # Backend Express + MongoDB
├── conception/                      # Diagrammes et schémas
├── docker-compose.yml               # Orchestration Docker
├── .github/workflows/               # CI/CD GitHub Actions
├── README.md                        # Documentation principale
├── STRUCTURE.md                     # Structure détaillée
├── DOCUMENTATION_TECHNIQUE.md       # Documentation technique
├── MODAL_TO_PAGES_CHANGES.md        # Changelog modifications
└── TrajetCamen_Postman_Collection.json # Collection Postman
```

## 🎨 Frontend (Client)

```
client/
├── src/
│   ├── api/                    # Services API
│   │   ├── axios.js            # Configuration Axios + intercepteurs
│   │   ├── auth.js             # API authentification
│   │   ├── users.js            # API utilisateurs
│   │   ├── trips.js            # API trajets
│   │   ├── vehicles.js         # API véhicules
│   │   ├── fuel.js             # API carburant
│   │   └── maintenance.js      # API maintenance
│   ├── assets/                 # Ressources statiques
│   │   └── react.svg           # Logo React
│   ├── components/             # Composants réutilisables
│   │   ├── common/             # Composants génériques
│   │   │   ├── Button.jsx          # Bouton réutilisable
│   │   │   ├── Card.jsx            # Carte conteneur
│   │   │   ├── Input.jsx           # Champ de saisie
│   │   │   ├── Select.jsx          # Sélecteur
│   │   │   ├── Modal.jsx           # Modale générique
│   │   │   ├── Table.jsx           # Tableau réutilisable
│   │   │   ├── Avatar.jsx          # Avatar utilisateur
│   │   │   ├── StatusBadge.jsx     # Badge de statut
│   │   │   ├── LoadingSpinner.jsx  # Indicateur de chargement
│   │   │   ├── EmptyState.jsx      # État vide
│   │   │   ├── ConfirmModal.jsx    # Modale de confirmation
│   │   │   ├── PageHeader.jsx      # En-tête de page
│   │   │   ├── SearchFilter.jsx    # Filtre de recherche
│   │   │   ├── ProfileImage.jsx    # Image de profil
│   │   │   └── index.js            # Exports groupés
│   │   ├── admin/              # Composants admin
│   │   │   ├── AdminHeader.jsx     # Header admin
│   │   │   ├── AdminSidebar.jsx    # Sidebar admin
│   │   │   ├── UserTable.jsx       # Tableau utilisateurs
│   │   │   ├── VehicleTable.jsx    # Tableau véhicules
│   │   │   └── TripTable.jsx       # Tableau trajets
│   │   ├── chauffeur/          # Composants chauffeur
│   │   │   ├── DriverHeader.jsx    # Header chauffeur
│   │   │   ├── DriverSidebar.jsx   # Sidebar chauffeur
│   │   │   └── TripCard.jsx        # Carte trajet
│   │   ├── charts/             # Composants graphiques
│   │   └── ProtectedRoute.jsx  # Route protégée
│   ├── contexts/               # Contextes React
│   │   └── ThemeContext.jsx    # Gestion dark mode
│   ├── layouts/                # Layouts de pages
│   │   ├── AdminLayout.jsx     # Layout admin
│   │   ├── AuthLayout.jsx      # Layout authentification
│   │   ├── ChauffeurLayout.jsx # Layout chauffeur
│   │   └── index.js            # Exports layouts
│   ├── pages/                  # Pages de l'application
│   │   ├── admin/              # Pages admin
│   │   │   ├── Dashboard.jsx       # Tableau de bord admin
│   │   │   ├── Users.jsx           # Gestion utilisateurs
│   │   │   ├── Vehicles.jsx        # Gestion véhicules
│   │   │   ├── Trips.jsx           # Gestion trajets
│   │   │   └── Maintenance.jsx     # Gestion maintenance
│   │   ├── chauffeur/          # Pages chauffeur
│   │   │   ├── Dashboard.jsx       # Tableau de bord chauffeur
│   │   │   ├── MyTrips.jsx         # Mes trajets
│   │   │   └── Profile.jsx         # Profil utilisateur
│   │   ├── Dashboard.jsx           # Dashboard général
│   │   ├── Home.jsx                # Page d'accueil
│   │   ├── Login.jsx               # Page connexion
│   │   └── Register.jsx            # Page inscription
│   ├── store/                  # État global Redux
│   │   ├── slices/             # Slices Redux
│   │   │   ├── authSlice.js        # Authentification
│   │   │   ├── tripsSlice.js       # Trajets
│   │   │   ├── vehiclesSlice.js    # Véhicules
│   │   │   ├── fuelSlice.js        # Carburant
│   │   └── maintenanceSlice.js # Maintenance
│   │   └── store.js            # Configuration store
│   ├── tests/                  # Tests frontend
│   │   ├── __mocks__/          # Mocks pour tests
│   │   ├── Button.test.jsx     # Tests composants
│   │   ├── Input.test.jsx
│   │   ├── Select.test.jsx
│   │   ├── MaintenanceForm.test.jsx
│   │   ├── TripForm.test.jsx
│   │   ├── VehicleForm.test.jsx
│   │   ├── fuelSlice.test.js   # Tests slices
│   │   ├── tripsSlice.test.js
│   │   └── setupTests.js       # Configuration tests
│   ├── utils/                  # Utilitaires
│   │   ├── notifications.js    # Système notifications
│   │   ├── imageUtils.js       # Gestion images
│   │   ├── fileHelpers.js      # Aide fichiers
│   │   └── index.js            # Exports utilitaires
│   ├── constants/              # Constantes
│   │   └── statusConfigs.js    # Configuration statuts
│   ├── App.css                 # Styles App
│   ├── App.jsx                 # Composant principal
│   ├── main.jsx                # Point d'entrée
│   ├── Routes.jsx              # Configuration routes
│   └── index.css               # Styles globaux
├── public/                     # Fichiers statiques
│   └── vite.svg                # Logo Vite
├── .dockerignore               # Exclusions Docker
├── .env                        # Variables environnement
├── .gitignore                  # Exclusions Git
├── babel.config.cjs            # Configuration Babel
├── Dockerfile                  # Image Docker
├── eslint.config.js            # Configuration ESLint
├── index.html                  # Template HTML
├── jest.config.js              # Configuration Jest
├── nginx.conf                  # Configuration Nginx
├── package.json                # Dépendances
├── README.md                   # Documentation client
├── tailwind.config.js          # Configuration Tailwind
└── vite.config.js              # Configuration Vite
```

**Technologies:**
- **React 18** - Bibliothèque UI
- **Vite** - Build tool et serveur dev
- **Redux Toolkit** - Gestion d'état global
- **React Router** - Navigation SPA
- **TailwindCSS** - Framework CSS utilitaire
- **Axios** - Client HTTP avec intercepteurs
- **Lucide React** - Bibliothèque d'icônes
- **React Hot Toast** - Système de notifications
- **Jest + Testing Library** - Tests unitaires
- **ESLint** - Linting et qualité code

**Scripts:**
- `npm run dev` - Serveur de développement (port 5173)
- `npm run build` - Build production optimisé
- `npm run preview` - Prévisualisation du build
- `npm run lint` - Vérification ESLint
- `npm test` - Exécution des tests Jest
- `npm run test:watch` - Tests en mode watch
- `npm run test:coverage` - Rapport de couverture

## ⚙️ Backend (Server)

```
server/
├── config/
│   ├── db.js                    # Configuration MongoDB
│   ├── minio.js                 # Configuration MinIO
│   └── swagger.js               # Configuration Swagger
├── controllers/
│   ├── authController.js        # Authentification
│   ├── userController.js        # Gestion utilisateurs
│   ├── tripController.js        # Gestion trajets
│   ├── vehicleController.js     # Gestion véhicules
│   ├── trailerController.js     # Gestion remorques
│   ├── maintenanceController.js # Gestion maintenance
│   ├── tireController.js        # Gestion pneus
│   ├── fuelController.js        # Gestion carburant
│   └── documentController.js    # Gestion documents
├── middleware/
│   ├── auth.js                  # Middleware authentification
│   └── errorHandler.js          # Gestion erreurs
├── models/
│   ├── User.js                  # Modèle utilisateur
│   ├── Vehicle.js               # Modèle véhicule
│   ├── Trailer.js               # Modèle remorque
│   ├── Trip.js                  # Modèle trajet
│   ├── Tire.js                  # Modèle pneu
│   ├── Maintenance.js           # Modèle maintenance
│   ├── Fuel.js                  # Modèle carburant
│   └── Document.js              # Modèle document
├── routes/
│   ├── authRoutes.js            # Routes auth
│   ├── userRoutes.js            # Routes users
│   ├── tripRoutes.js            # Routes trajets
│   ├── vihicleRoutes.js         # Routes véhicules
│   ├── trailerRoutes.js         # Routes remorques
│   ├── maintenanceRoutes.js     # Routes maintenance
│   ├── tireRoutes.js            # Routes pneus
│   ├── fuelRoutes.js            # Routes carburant
│   └── documentRoutes.js        # Routes documents
├── services/
│   ├── authService.js           # Logique auth
│   ├── userService.js           # Logique users
│   ├── tripService.js           # Logique trajets
│   ├── vehicleService.js        # Logique véhicules
│   ├── trailerService.js        # Logique remorques
│   ├── maintenanceService.js    # Logique maintenance
│   ├── tireService.js           # Logique pneus
│   ├── fuelService.js           # Logique carburant
│   └── documentService.js       # Logique documents
├── seeders/
│   └── seed.js                  # Données de test
├── tests/
│   ├── unit/                    # Tests unitaires
│   │   ├── authService.test.js
│   │   ├── authController.test.js
│   │   └── userService.test.js
│   ├── integration/             # Tests intégration
│   │   ├── auth.test.js
│   │   └── tire.test.js
│   └── setup.js                 # Configuration tests
├── .env                         # Variables environnement
├── server.js                    # Point d'entrée
├── Dockerfile                   # Image Docker
├── jest.config.js               # Configuration Jest
└── package.json                 # Dépendances
```

**Technologies:**
- Node.js + Express
- MongoDB + Mongoose
- MinIO (stockage fichiers)
- JWT (accessToken + refreshToken)
- bcryptjs (hash passwords)
- Multer (upload fichiers)
- Swagger (documentation API)
- Jest (tests)
- Supertest (tests intégration)

**Scripts:**
- `npm run dev` - Mode développement avec nodemon
- `npm start` - Mode production
- `npm test` - Exécution de tous les tests
- `npm run test:unit` - Tests unitaires uniquement
- `npm run test:integration` - Tests d'intégration
- `npm run test:watch` - Tests en mode watch
- `npm run test:coverage` - Rapport de couverture
- `npm run seed` - Initialisation base de données

## 🔐 Authentification

**Architecture JWT:**
- **Double Token System** - AccessToken + RefreshToken
- **Rotation automatique** - Renouvellement transparent
- **Stockage sécurisé** - localStorage avec gestion d'expiration

**Méthodes disponibles:**
- `register(userData)` - Inscription utilisateur
- `login(email, password)` - Connexion (retourne tokens)
- `refreshToken(refreshToken)` - Renouvellement accessToken
- `logout(refreshToken)` - Déconnexion sécurisée
- `changePassword(currentPassword, newPassword)` - Changement mot de passe

**Durées de vie:**
- **AccessToken**: 15 minutes
- **RefreshToken**: 7 jours

**Rôles utilisateurs:**
- **admin** - Accès complet à toutes les fonctionnalités
- **chauffeur** - Accès limité aux trajets et profil

## 🗄️ Modèles de Données

### Utilisateurs et Authentification
- **User** - Utilisateurs (admin, chauffeur)
  - Profil, authentification, rôles
  - Upload d'images de profil via MinIO

### Gestion de Flotte
- **Vehicle** - Véhicules de transport
  - Informations techniques, statut, kilométrage
- **Trailer** - Remorques attachées
  - Types, capacités, associations véhicules
- **Tire** - Gestion des pneus
  - Usure, positions, maintenances préventives

### Opérations
- **Trip** - Trajets et missions
  - Planification, suivi, complétion
- **Maintenance** - Maintenances véhicules
  - Préventive, corrective, historique
- **Fuel** - Gestion carburant
  - Consommation, coûts, statistiques
- **Document** - Documents attachés
  - Stockage MinIO, métadonnées

## 🐳 Docker

**Services:**
- **client** - Frontend React (port 5173)
- **server** - Backend Express (port 5000)
- **mongodb** - Base de données (port 27019)
- **minio** - Stockage objets (ports 9000, 9001)

**Commandes:**
```bash
# Démarrage complet
docker-compose up -d

# Logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f server

# Redémarrage d'un service
docker-compose restart server

# Arrêt complet
docker-compose down

# Arrêt avec suppression volumes
docker-compose down -v

# Reconstruction des images
docker-compose build --no-cache
```

**Volumes persistants:**
- `mongo_data` - Données MongoDB
- `minio_data` - Fichiers MinIO
- `server_node_modules` - Dépendances serveur
- `client_node_modules` - Dépendances client

## 🚀 CI/CD

**GitHub Actions (.github/workflows/ci.yml):**

**Jobs:**
1. **test-server** - Tests backend avec MongoDB
2. **build-client** - Lint + Build frontend

**Déclenchement:**
- Push sur `main` ou `develop`
- Pull requests

## 📝 Variables d'Environnement

**Server (.env):**
```bash
# Base de données
MONGO_URI=mongodb://localhost:27019/trajet

# Authentification JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here

# Serveur
PORT=5000
CLIENT_URL=http://localhost:5173

# MinIO (Stockage fichiers)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

**Client (.env):**
```bash
# API Backend
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Tests

### Backend (Server)
**Tests unitaires:**
- authService (7 tests)
- authController (6 tests) 
- userService, userController
- fuelService, fuelController
- maintenanceService, maintenanceController
- tireService, tireController
- trailerService, trailerController
- vehicleService, vehicleController
- documentService, documentController
- tripController
- auth.middleware

**Tests d'intégration:**
- auth.test.js - Authentification complète
- fuel.test.js - Gestion carburant
- maintenance.test.js - Opérations maintenance
- tire.test.js - Gestion pneus
- trip.test.js - Gestion trajets

### Frontend (Client)
**Tests composants:**
- Button, Input, Select - Composants de base
- MaintenanceForm, TripForm, VehicleForm - Formulaires

**Tests slices Redux:**
- fuelSlice, tripsSlice - Gestion d'état

**Commandes:**
```bash
# Backend
cd server
npm test                    # Tous les tests
npm run test:unit          # Tests unitaires
npm run test:integration   # Tests intégration
npm run test:coverage      # Rapport couverture

# Frontend  
cd client
npm test                   # Tests Jest
npm run test:coverage      # Couverture frontend
```

## 📦 Installation

### 🐳 Avec Docker (Recommandé)
```bash
# Cloner le projet
git clone https://github.com/Ghandour390/trajet.git
cd trajet

# Démarrer tous les services
docker-compose up -d

# Initialiser la base de données
docker-compose exec server npm run seed

# Vérifier les services
docker-compose ps
```

### 💻 Sans Docker
```bash
# Prérequis: Node.js 18+, MongoDB, MinIO

# Installation serveur
cd server
npm install
cp .env.example .env  # Configurer les variables
npm run seed          # Initialiser DB
npm run dev          # Démarrer serveur

# Installation client (nouveau terminal)
cd client
npm install
npm run dev          # Démarrer client
```

### 🌐 Accès aux services
- **Application**: http://localhost:5173
- **API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)
- **MongoDB**: localhost:27019

### 👥 Comptes de test
```
Admin: admin@trajetcamen.com / password123
Chauffeur 1: mohamed@trajetcamen.com / password123  
Chauffeur 2: fatima@trajetcamen.com / password123
```

## 🎆 Fonctionnalités

### 👥 Gestion Utilisateurs
- Inscription/Connexion sécurisée
- Gestion des rôles (Admin/Chauffeur)
- Profils utilisateurs avec photos
- Upload d'images via MinIO

### 🚚 Gestion de Flotte
- **Véhicules**: Suivi technique, kilométrage, statuts
- **Remorques**: Association véhicules, types, capacités
- **Pneus**: Gestion usure, positions, maintenances

### 🗺️ Gestion Trajets
- Planification et assignation
- Suivi temps réel
- Historique et rapports
- Calcul distances et consommation

### 🔧 Maintenance
- Planification préventive
- Suivi interventions
- Historique complet
- Alertes et notifications

### ⛽ Gestion Carburant
- Suivi consommation
- Analyse coûts
- Statistiques et tendances
- Optimisation routes

### 📄 Gestion Documents
- Stockage sécurisé MinIO
- Métadonnées et indexation
- Accès contrôlé

## 🏧 Architecture Technique

### 📊 Patterns Utilisés
- **MVC** - Modèle-Vue-Contrôleur
- **Repository Pattern** - Abstraction données
- **Service Layer** - Logique métier
- **Middleware Pattern** - Authentification, erreurs
- **Observer Pattern** - Redux pour l'état

### 🔒 Sécurité
- **JWT Double Token** - Sécurité authentification
- **bcrypt** - Hachage mots de passe
- **CORS** - Protection cross-origin
- **Validation** - Mongoose + frontend
- **Sanitization** - Protection injections

### 📦 Stockage
- **MongoDB** - Base de données principale
- **MinIO** - Stockage objets (images, documents)
- **Redis** - Cache (optionnel)
- **localStorage** - Persistance client

### 📊 Performance
- **Lazy Loading** - Chargement à la demande
- **Code Splitting** - Optimisation bundles
- **Caching** - Stratégies de cache
- **Compression** - Gzip, minification
- **CDN Ready** - Optimisé pour CDN
