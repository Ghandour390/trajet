# Structure du Projet TrajetCamen

## 📁 Architecture Globale

```
trajetCamen/
├── client/              # Frontend React + Vite
├── server/              # Backend Express + MongoDB
├── conception/          # Diagrammes et schémas
├── docker-compose.yml   # Orchestration Docker
└── .github/workflows/   # CI/CD GitHub Actions
```

## 🎨 Frontend (Client)

```
client/
├── src/
│   ├── assets/         # Images, icônes
│   ├── App.jsx         # Composant principal
│   ├── main.jsx        # Point d'entrée
│   └── *.css           # Styles
├── public/             # Fichiers statiques
├── Dockerfile          # Image Docker
├── package.json        # Dépendances
└── vite.config.js      # Configuration Vite
```

**Technologies:**
- React 19
- Vite (build tool)
- TailwindCSS
- ESLint

**Scripts:**
- `npm run dev` - Serveur de développement
- `npm run build` - Build production
- `npm run lint` - Vérification code

## ⚙️ Backend (Server)

```
server/
├── config/
│   └── db.js                    # Configuration MongoDB
├── controllers/
│   ├── authController.js        # Authentification
│   └── userController.js        # Gestion utilisateurs
├── middleware/
│   └── errorHandler.js          # Gestion erreurs
├── models/
│   ├── User.js                  # Modèle utilisateur
│   ├── Vehicle.js               # Modèle véhicule
│   ├── Trailer.js               # Modèle remorque
│   ├── Trip.js                  # Modèle trajet
│   ├── Tire.js                  # Modèle pneu
│   └── Maintenance.js           # Modèle maintenance
├── routes/
│   ├── authRoutes.js            # Routes auth
│   └── userRoutes.js            # Routes users
├── services/
│   ├── authService.js           # Logique auth
│   └── userService.js           # Logique users
├── tests/
│   ├── unit/                    # Tests unitaires
│   │   ├── authService.test.js
│   │   ├── authController.test.js
│   │   └── userService.test.js
│   ├── integration/             # Tests intégration
│   └── setup.js                 # Configuration tests
├── server.js                    # Point d'entrée
├── Dockerfile                   # Image Docker
├── jest.config.js               # Configuration Jest
└── package.json                 # Dépendances
```

**Technologies:**
- Node.js + Express
- MongoDB + Mongoose
- JWT (accessToken + refreshToken)
- bcryptjs (hash passwords)
- Jest (tests)

**Scripts:**
- `npm run dev` - Mode développement
- `npm start` - Mode production
- `npm test` - Lancer tests

## 🔐 Authentification

**Méthodes disponibles:**
- `register(userData)` - Inscription
- `login(email, password)` - Connexion (retourne accessToken + refreshToken)
- `refreshToken(refreshToken)` - Renouveler accessToken

**Tokens:**
- accessToken: 15 minutes
- refreshToken: 7 jours

## 🗄️ Modèles de Données

- **User** - Utilisateurs
- **Vehicle** - Véhicules
- **Trailer** - Remorques
- **Trip** - Trajets
- **Tire** - Pneus
- **Maintenance** - Maintenances

## 🐳 Docker

**Services:**
- `client` - Frontend (port 5173)
- `server` - Backend (port 5000)
- `mongodb` - Base de données (port 27017)

**Commandes:**
```bash
docker-compose up -d        # Démarrer
docker-compose logs -f      # Voir logs
docker-compose down         # Arrêter
```

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
```
MONGO_URI=mongodb://localhost:27017/trajetcamen
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
PORT=5000
```

## 🧪 Tests

**Coverage:**
- authService (7 tests)
- authController (6 tests)
- userService

**Lancer les tests:**
```bash
cd server
npm test
```

## 📦 Installation

**Avec Docker:**
```bash
docker-compose up -d
```

**Sans Docker:**
```bash
# Server
cd server && npm install && npm run dev

# Client
cd client && npm install && npm run dev
```
