# 📚 Documentation Technique - TrajetCamen

## 🎯 Vue d'ensemble du Projet

**TrajetCamen** est une application full-stack de gestion de flotte de véhicules permettant de gérer les trajets, véhicules, chauffeurs, maintenance, pneus, remorques et carburant.

### Technologies Utilisées

**Frontend:**
- React 18.2 + Vite
- Redux Toolkit (state management)
- React Router v6 (routing)
- Tailwind CSS (styling)
- Axios (HTTP client)
- Lucide React (icons)
- Recharts (graphiques)

**Backend:**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (authentication)
- MinIO (stockage fichiers)
- Swagger (documentation API)
- Jest + Supertest (tests)

**Infrastructure:**
- Docker + Docker Compose
- MongoDB 7
- MinIO
- Nginx (production)

---

## 📁 Structure du Projet

```
trajetCamen/
├── client/                 # Frontend React
├── server/                 # Backend Express
├── conception/             # Diagrammes & conception
├── docker-compose.yml      # Orchestration Docker
└── README.md              # Documentation utilisateur
```

---

## 🖥️ BACKEND (Server)

### Architecture

Le backend suit une architecture **MVC (Model-View-Controller)** avec une couche service supplémentaire:

```
Request → Routes → Middleware → Controller → Service → Model → Database
```

### Structure des Dossiers

```
server/
├── config/              # Configuration (DB, MinIO, Swagger)
├── controllers/         # Logique de contrôle des requêtes
├── middleware/          # Middleware (auth, errors, roles)
├── models/             # Schémas Mongoose
├── routes/             # Définition des routes API
├── services/           # Logique métier
├── seeders/            # Données de test
├── tests/              # Tests unitaires & intégration
└── server.js           # Point d'entrée
```

---

### 📂 Détail des Fichiers Backend

#### **config/**

**db.js**
- Connexion à MongoDB
- Gestion des erreurs de connexion
- Configuration Mongoose

**minio.js**
- Configuration client MinIO
- Création des buckets
- Upload/Download fichiers

**swagger.js**
- Configuration Swagger UI
- Documentation API automatique
- Schémas OpenAPI

---

#### **models/**

**User.js**
```javascript
{
  firstname: String,
  lastname: String,
  email: String (unique),
  passwordHash: String,
  role: ['admin', 'chauffeur'],
  phone: String,
  licence: String
}
```
- Gestion utilisateurs (admin/chauffeur)
- Hash password avec bcrypt
- Validation email unique

**Vehicle.js**
```javascript
{
  plateNumber: String (unique),
  type: String,
  brand: String,
  year: Number,
  currentKm: Number,
  status: ['active', 'in_use', 'maintenance', 'inactive'],
  tires: [ObjectId],
  maintenanceDueDates: [Date]
}
```
- Gestion véhicules
- Relation avec pneus
- Suivi kilométrage

**Trailer.js**
```javascript
{
  plateNumber: String (unique),
  type: String,
  currentKm: Number,
  tires: [ObjectId],
  attachedTo: ObjectId (Vehicle)
}
```
- Gestion remorques
- Attachement aux véhicules

**Trip.js**
```javascript
{
  reference: String (unique),
  origin: String,
  destination: String,
  assignedTo: ObjectId (User),
  vehicleRef: ObjectId (Vehicle),
  trailerRef: ObjectId (Trailer),
  startKm: Number,
  endKm: Number,
  distimatedKm: Number,
  fuelVolume: Number,
  status: ['planned', 'in_progress', 'completed', 'cancelled'],
  startAt: Date,
  endAt: Date,
  notes: String
}
```
- Gestion trajets
- Assignation chauffeur/véhicule/remorque
- Vérification disponibilité

**Fuel.js**
```javascript
{
  trip: ObjectId,
  vehicle: ObjectId,
  driver: ObjectId,
  liters: Number,
  cost: Number,
  pricePerLiter: Number (auto-calculé),
  station: String,
  location: String,
  odometer: Number,
  fuelType: ['diesel', 'essence', 'gpl'],
  receipt: String,
  date: Date,
  notes: String
}
```
- Enregistrement carburant
- Calcul automatique prix/litre
- Statistiques consommation

**Maintenance.js**
```javascript
{
  vehicle: ObjectId,
  type: String,
  description: String,
  cost: Number,
  date: Date,
  nextMaintenanceKm: Number,
  status: ['scheduled', 'in_progress', 'completed']
}
```
- Gestion maintenance véhicules
- Planification entretiens

**Tire.js**
```javascript
{
  serial: String (unique),
  position: String,
  brand: String,
  model: String,
  purchaseDate: Date,
  installationKm: Number,
  currentKm: Number,
  nextCheckKm: Number,
  status: ['active', 'worn', 'damaged', 'replaced']
}
```
- Gestion pneus
- Suivi usure

**Document.js**
```javascript
{
  name: String,
  type: String,
  relatedTo: String,
  relatedId: ObjectId,
  fileUrl: String,
  uploadDate: Date,
  expiryDate: Date
}
```
- Gestion documents
- Stockage MinIO

---

#### **services/**

Chaque service contient la logique métier:

**Méthodes communes:**
- `create(data)` - Créer
- `findAll(filters)` - Liste avec filtres
- `findById(id)` - Détails
- `update(id, data)` - Modifier
- `delete(id)` - Supprimer

**Services spécifiques:**

**userService.js**
- `findAvailableChauffeurs(startAt, endAt)` - Chauffeurs disponibles

**vehicleService.js**
- `findAvailableVehicles(startAt, endAt)` - Véhicules disponibles

**trailerService.js**
- `findAvailableTrailers(startAt, endAt)` - Remorques disponibles

**fuelService.js**
- `getStats(filters)` - Statistiques carburant
- `getConsumptionByVehicle(vehicleId)` - Consommation par véhicule

**tripService.js**
- Vérification disponibilité ressources
- Calcul distances

---

#### **controllers/**

Gestion des requêtes HTTP:
- Validation des données
- Appel aux services
- Gestion des erreurs
- Formatage des réponses

**Exemple: fuelController.js**
```javascript
async createFuelRecord(req, res) {
  try {
    const record = await fuelService.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
```

---

#### **routes/**

Définition des endpoints avec:
- Authentification (JWT)
- Autorisation (rôles)
- Documentation Swagger

**Exemple: fuelRoutes.js**
```javascript
router.post('/', 
  authenticate, 
  authorize('chauffeur', 'admin'), 
  fuelController.createFuelRecord
);
```

**Routes principales:**
- `/api/auth` - Authentification
- `/api/users` - Utilisateurs
- `/api/vehicles` - Véhicules
- `/api/trailers` - Remorques
- `/api/trips` - Trajets
- `/api/fuel` - Carburant
- `/api/maintenance` - Maintenance
- `/api/tires` - Pneus
- `/api/documents` - Documents

---

#### **middleware/**

**auth.js**
- `authenticate` - Vérification JWT
- `authorize(roles)` - Vérification rôles

**errorHandler.js**
- Gestion centralisée des erreurs
- Formatage réponses d'erreur

**Role.js**
- Constantes rôles
- Validation rôles

---

### 🔐 Authentification & Autorisation

**Flow d'authentification:**
1. Login → JWT token généré
2. Token stocké côté client
3. Chaque requête inclut token dans header
4. Middleware vérifie token
5. Middleware vérifie rôle

**Rôles:**
- **Admin**: Accès complet
- **Chauffeur**: Accès limité (ses trajets, carburant)

---

## 🎨 FRONTEND (Client)

### Architecture

Architecture basée sur **React + Redux** avec routing:

```
Component → Action → Reducer → Store → Component
```

### Structure des Dossiers

```
client/src/
├── api/                # Appels API (Axios)
├── assets/             # Images, SVG
├── components/         # Composants réutilisables
│   ├── admin/         # Composants admin
│   ├── chauffeur/     # Composants chauffeur
│   ├── charts/        # Graphiques
│   └── common/        # Composants communs
├── data/              # Données mock
├── layouts/           # Layouts (Admin, Chauffeur, Auth)
├── pages/             # Pages principales
│   ├── admin/        # Pages admin
│   └── chauffeur/    # Pages chauffeur
├── store/             # Redux store
│   └── slices/       # Redux slices
├── tests/             # Tests Jest
├── utils/             # Utilitaires
├── App.jsx            # Composant principal
├── Routes.jsx         # Configuration routes
└── main.jsx          # Point d'entrée
```

---

### 📂 Détail des Fichiers Frontend

#### **api/**

Modules API avec Axios:

**axios.js**
- Configuration Axios
- Intercepteurs (token, errors)
- Base URL

**trips.js**
```javascript
export const getTrips = async (params) => {...}
export const createTrip = async (data) => {...}
export const getAvailableDrivers = async (startAt, endAt) => {...}
export const getAvailableVehicles = async (startAt, endAt) => {...}
export const getAvailableTrailers = async (startAt, endAt) => {...}
```

**fuel.js**
```javascript
export const getFuelRecords = async (params) => {...}
export const createFuelRecord = async (data) => {...}
export const getFuelStats = async (params) => {...}
```

**Autres:** auth.js, users.js, vehicles.js, maintenance.js

---

#### **store/slices/**

Redux Toolkit slices:

**authSlice.js**
- Login/Logout
- Gestion token
- User state

**tripsSlice.js**
```javascript
// Async thunks
export const getTrips = createAsyncThunk(...)
export const createTrip = createAsyncThunk(...)
export const updateTrip = createAsyncThunk(...)

// Selectors
export const selectTrips = (state) => state.trips.trips
export const selectTripsLoading = (state) => state.trips.loading
```

**fuelSlice.js**
- CRUD carburant
- Statistiques
- Filtres

**vehiclesSlice.js**
- CRUD véhicules
- Disponibilité

---

#### **components/**

**common/**
- `Button.jsx` - Bouton réutilisable
- `Card.jsx` - Carte
- `Input.jsx` - Champ input
- `Select.jsx` - Select dropdown
- `Table.jsx` - Tableau
- `Modal.jsx` - Modal

**admin/**
- Composants spécifiques admin

**chauffeur/**
- `TripCard.jsx` - Carte trajet
- Composants spécifiques chauffeur

**charts/**
- `FuelChart.jsx` - Graphique carburant
- Graphiques Recharts

---

#### **pages/**

**admin/**
- `Dashboard.jsx` - Tableau de bord
- `Trips.jsx` - Gestion trajets
- `Vehicles.jsx` - Gestion véhicules
- `Users.jsx` - Gestion utilisateurs
- `Maintenance.jsx` - Gestion maintenance

**chauffeur/**
- `MyTrips.jsx` - Liste trajets chauffeur
- `TripDetails.jsx` - Détails trajet
  - Mise à jour kilométrage
  - Ajout carburant
  - Changement statut

---

#### **layouts/**

**AdminLayout.jsx**
- Sidebar navigation
- Header
- Protected routes

**ChauffeurLayout.jsx**
- Navigation chauffeur
- Menu simplifié

**AuthLayout.jsx**
- Layout login/register
- Pas de navigation

---

#### **Routes.jsx**

Configuration React Router:

```javascript
<Routes>
  <Route path="/login" element={<Login />} />
  
  <Route path="/admin" element={<ProtectedRoute role="admin" />}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="trips" element={<Trips />} />
    ...
  </Route>
  
  <Route path="/chauffeur" element={<ProtectedRoute role="chauffeur" />}>
    <Route path="my-trips" element={<MyTrips />} />
    <Route path="trips/:id" element={<TripDetails />} />
    ...
  </Route>
</Routes>
```

---

## 🐳 Docker & Déploiement

### docker-compose.yml

**Services:**

1. **mongodb** (Port 27019)
   - Base de données
   - Volume persistant

2. **minio** (Ports 9000, 9001)
   - Stockage fichiers
   - Console web

3. **server** (Port 5000)
   - API Express
   - Dépend de MongoDB + MinIO

4. **client** (Port 5173)
   - React + Vite
   - Dépend du server

**Volumes:**
- `mongo_data` - Données MongoDB
- `minio_data` - Fichiers MinIO
- `server_node_modules` - Dépendances server
- `client_node_modules` - Dépendances client

**Network:**
- `trajet_network` - Bridge network

---

## 🔄 Flux de Données

### Création d'un Trajet (Admin)

1. Admin ouvre formulaire
2. Sélectionne date début/fin
3. Frontend appelle `/api/users/disponibles` + `/api/vehicles/disponibles` + `/api/trailers/disponibles`
4. Backend vérifie disponibilité (pas de chevauchement)
5. Affiche seulement ressources disponibles
6. Admin sélectionne et crée trajet
7. Backend valide et sauvegarde
8. Frontend met à jour liste

### Ajout Carburant (Chauffeur)

1. Chauffeur ouvre détails trajet
2. Clique "Ajouter carburant"
3. Remplit formulaire (litres, coût, station)
4. Frontend envoie à `/api/fuel`
5. Backend calcule prix/litre automatiquement
6. Sauvegarde avec références (trip, vehicle, driver)
7. Retourne confirmation

---

## 🧪 Tests

### Backend (Jest + Supertest)

**Tests unitaires:**
- Services
- Controllers
- Middleware

**Tests d'intégration:**
- Routes API
- Authentification
- CRUD operations

**Commandes:**
```bash
npm test              # Tous les tests
npm test -- --watch   # Mode watch
```

### Frontend (Jest + React Testing Library)

**Tests:**
- Composants
- Redux slices
- Intégration

**Commandes:**
```bash
npm test              # Tous les tests
npm test:watch        # Mode watch
npm test:coverage     # Couverture
```

---

## 📊 Base de Données

### Collections MongoDB

1. **users** - Utilisateurs (admin/chauffeur)
2. **vehicles** - Véhicules
3. **trailers** - Remorques
4. **trips** - Trajets
5. **fuel** - Carburant
6. **maintenance** - Maintenance
7. **tires** - Pneus
8. **documents** - Documents

### Relations

```
User (chauffeur) ←→ Trip ←→ Vehicle
                    ↓
                   Fuel
                    
Vehicle ←→ Tire
Vehicle ←→ Maintenance
Vehicle ←→ Trailer
```

---

## 🚀 Commandes Utiles

### Développement

```bash
# Démarrer tout
docker-compose up -d

# Voir logs
docker-compose logs -f

# Restart service
docker-compose restart server
docker-compose restart client

# Arrêter tout
docker-compose down

# Rebuild
docker-compose up -d --build
```

### Backend seul

```bash
cd server
npm install
npm run dev        # Mode développement
npm start          # Production
npm test           # Tests
npm run seed       # Données de test
```

### Frontend seul

```bash
cd client
npm install
npm run dev        # Mode développement
npm run build      # Build production
npm test           # Tests
```

---

## 🔒 Sécurité

### Backend
- JWT tokens (access + refresh)
- Password hashing (bcrypt)
- Input validation
- CORS configuré
- Rate limiting (à implémenter)

### Frontend
- Protected routes
- Token storage (localStorage)
- Auto-refresh token
- XSS protection

---

## 📈 Évolutions Futures

### Phase 2
- Notifications temps réel (WebSocket)
- Export Excel/PDF
- Upload photos tickets carburant
- Budget mensuel carburant
- Alertes maintenance

### Phase 3
- Application mobile (React Native)
- Géolocalisation GPS
- Prédictions IA (consommation, pannes)
- Intégration API prix carburant
- Dashboard analytics avancé

---

## 📝 Variables d'Environnement

### Server (.env)
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/trajet
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🆘 Troubleshooting

### Problèmes courants

**Port déjà utilisé:**
```bash
# Changer port dans docker-compose.yml
ports:
  - "5001:5000"  # Au lieu de 5000:5000
```

**MongoDB connection failed:**
```bash
# Vérifier que MongoDB est démarré
docker-compose ps
docker-compose logs mongodb
```

**Frontend ne charge pas:**
```bash
# Clear cache et rebuild
docker-compose down
docker-compose up -d --build client
```

---

## 📞 Support

Pour toute question ou problème:
1. Vérifier logs: `docker-compose logs -f`
2. Consulter Swagger: http://localhost:5000/api-docs
3. Vérifier Postman collection

---

**Version:** 1.0.0  
**Dernière mise à jour:** Décembre 2024  
**Auteur:** TrajetCamen Team
