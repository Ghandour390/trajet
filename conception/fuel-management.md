# Gestion du Carburant - Conception

## 📋 Vue d'ensemble

Le module de gestion du carburant permet de suivre et analyser la consommation de carburant de la flotte de véhicules.

## 🗄️ Modèle de Données

### Collection: Fuel

```javascript
{
  _id: ObjectId,
  trip: ObjectId,              // Référence au trajet
  vehicle: ObjectId,           // Référence au véhicule
  driver: ObjectId,            // Référence au chauffeur
  liters: Number,              // Quantité en litres (requis, min: 0)
  cost: Number,                // Coût total en MAD (requis, min: 0)
  pricePerLiter: Number,       // Prix par litre (calculé automatiquement)
  station: String,             // Nom de la station-service
  location: String,            // Ville/localisation
  odometer: Number,            // Kilométrage au moment du plein
  fuelType: String,            // Type: 'diesel', 'essence', 'gpl'
  receipt: String,             // URL du ticket (MinIO)
  date: Date,                  // Date de l'enregistrement
  notes: String,               // Remarques
  createdAt: Date,
  updatedAt: Date
}
```

### Relations

- **Fuel → Trip** (Many-to-One): Un enregistrement de carburant appartient à un trajet
- **Fuel → Vehicle** (Many-to-One): Un enregistrement est lié à un véhicule
- **Fuel → User** (Many-to-One): Un enregistrement est créé par un chauffeur

## 🔐 Permissions

### Admin
- ✅ Voir tous les enregistrements
- ✅ Créer/Modifier/Supprimer
- ✅ Voir statistiques globales
- ✅ Générer rapports
- ✅ Voir consommation par véhicule

### Chauffeur
- ✅ Créer enregistrement (pendant trajet)
- ✅ Voir ses propres enregistrements
- ❌ Modifier/Supprimer
- ❌ Voir statistiques globales

## 🛣️ Routes API

### Endpoints

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| POST | `/api/fuel` | Créer enregistrement | Chauffeur, Admin |
| GET | `/api/fuel` | Liste tous les enregistrements | Admin |
| GET | `/api/fuel/:id` | Détails d'un enregistrement | Auth |
| PUT | `/api/fuel/:id` | Modifier enregistrement | Admin |
| DELETE | `/api/fuel/:id` | Supprimer enregistrement | Admin |
| GET | `/api/fuel/trip/:tripId` | Enregistrements par trajet | Auth |
| GET | `/api/fuel/stats` | Statistiques globales | Admin |
| GET | `/api/fuel/consumption/:vehicleId` | Consommation par véhicule | Admin |

### Filtres disponibles

- `vehicle`: Filtrer par véhicule
- `driver`: Filtrer par chauffeur
- `trip`: Filtrer par trajet
- `startDate`: Date début
- `endDate`: Date fin

## 📊 Statistiques Calculées

### Statistiques Globales
```javascript
{
  totalLiters: Number,        // Total litres consommés
  totalCost: Number,          // Coût total
  avgPricePerLiter: Number,   // Prix moyen par litre
  count: Number               // Nombre d'enregistrements
}
```

### Consommation par Véhicule
```javascript
{
  _id: vehicleId,
  totalLiters: Number,
  totalCost: Number,
  avgPricePerLiter: Number,
  count: Number
}
```

## 🎯 Cas d'Utilisation

### UC1: Enregistrer Carburant (Chauffeur)
1. Chauffeur démarre/effectue un trajet
2. Fait le plein à une station
3. Ouvre détails du trajet
4. Clique "Ajouter carburant"
5. Remplit formulaire (litres, coût, station)
6. Système calcule automatiquement prix/litre
7. Enregistrement créé et lié au trajet

### UC2: Consulter Historique (Admin)
1. Admin accède à "Gestion Carburant"
2. Voit liste de tous les enregistrements
3. Peut filtrer par véhicule/chauffeur/date
4. Voit statistiques en temps réel
5. Peut exporter les données

### UC3: Analyser Consommation (Admin)
1. Admin sélectionne un véhicule
2. Système affiche consommation sur période
3. Compare avec autres véhicules
4. Identifie anomalies/surconsommation
5. Génère rapport détaillé

## 🔄 Logique Métier

### Calcul Automatique
- **Prix par litre** = `cost / liters`
- Calculé automatiquement avant sauvegarde (pre-save hook)

### Validation
- Litres et coût doivent être > 0
- Type de carburant doit être valide
- Trajet, véhicule et chauffeur requis
- Date par défaut = maintenant

## 📈 Évolutions Futures

### Phase 2
- Budget mensuel par véhicule
- Alertes surconsommation
- Graphiques tendances
- Export Excel/PDF

### Phase 3
- Upload photos tickets
- Géolocalisation stations
- Prédictions consommation
- Intégration prix carburant API

## 🔗 Intégrations

### Avec Trip
- Enregistrement lié à un trajet
- Affichage dans détails trajet
- Calcul consommation réelle vs estimée

### Avec Vehicle
- Historique carburant par véhicule
- Calcul consommation moyenne
- Suivi coûts d'exploitation

### Avec User (Chauffeur)
- Historique personnel
- Performance de conduite
- Statistiques individuelles

## 📝 Notes Techniques

### Performance
- Index sur: `trip`, `vehicle`, `driver`, `date`
- Pagination pour grandes listes
- Agrégation MongoDB pour statistiques

### Sécurité
- Validation côté serveur
- Authentification JWT requise
- Autorisation basée sur rôle
- Sanitization des inputs

### Stockage
- Documents MongoDB
- Photos tickets sur MinIO
- Backup quotidien recommandé
