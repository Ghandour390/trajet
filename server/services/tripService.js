import Trip from '../models/Trip.js';
import Notification from '../models/Notification.js';

class TripService {
  // Nettoie les données en convertissant les chaînes vides en null
  cleanTripData(tripData) {
    const cleaned = { ...tripData };
    
    // Convertir les chaînes vides en null pour les ObjectId
    if (cleaned.vehicleRef === '' || cleaned.vehicleRef === undefined) {
      cleaned.vehicleRef = null;
    }
    if (cleaned.trailerRef === '' || cleaned.trailerRef === undefined) {
      cleaned.trailerRef = null;
    }
    if (cleaned.assignedTo === '' || cleaned.assignedTo === undefined) {
      cleaned.assignedTo = null;
    }
    
    return cleaned;
  }

  async create(tripData) {
    const cleanedData = this.cleanTripData(tripData);
    
    // Générer une référence unique si elle n'est pas fournie
    if (!cleanedData.reference) {
      const count = await Trip.countDocuments();
      cleanedData.reference = `TRIP${String(count + 1).padStart(3, '0')}`;
    }
    
    const newTrip = await Trip.create(cleanedData);
    
    // Si un chauffeur est assigné dès la création
    if (cleanedData.assignedTo) {
      await this.createAssignmentNotification(newTrip, cleanedData.assignedTo);
    }
    
    return newTrip;
  }

  async findAll(filter = {}) {
    return await Trip.find(filter)
      .populate('assignedTo', 'firstname lastname')
      .populate('vehicleRef', 'plateNumber')
      .populate('trailerRef', 'plateNumber');
  }

  async findById(id) {
    return await Trip.findById(id)
      .populate('assignedTo', 'firstname lastname')
      .populate('vehicleRef', 'plateNumber')
      .populate('trailerRef', 'plateNumber');
  }

  async update(id, tripData) {
    const cleanedData = this.cleanTripData(tripData);
    const oldTrip = await Trip.findById(id);
    const updatedTrip = await Trip.findByIdAndUpdate(id, cleanedData, { new: true });
    
    // Si un chauffeur est assigné pour la première fois
    if (cleanedData.assignedTo && (!oldTrip.assignedTo || oldTrip.assignedTo.toString() !== cleanedData.assignedTo)) {
      await this.createAssignmentNotification(updatedTrip, cleanedData.assignedTo);
    }
    
    return updatedTrip;
  }

  // Créer une notification d'assignation
  async createAssignmentNotification(trip, chauffeurId) {
    try {
      await Notification.create({
        userId: chauffeurId,
        type: 'trip_assignment',
        title: 'Nouveau trajet assigné',
        message: `Vous avez été assigné au trajet ${trip.reference} de ${trip.origin} vers ${trip.destination}`,
        severity: 'info',
        isRead: false
      });
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
    }
  }

  async delete(id) {
    return await Trip.findByIdAndDelete(id);
  }

  async updateStatus(id, status, userId = null) {
    const trip = await Trip.findByIdAndUpdate(id, { status }, { new: true })
      .populate('assignedTo', 'firstname lastname')
      .populate('vehicleRef')
      .populate('trailerRef');
    
    // Si trajet complété, ajouter distance aux pneus
    if (status === 'completed' && trip.endKm && trip.startKm) {
      const distance = trip.endKm - trip.startKm;
      await this.addDistanceToTires(trip, distance);
    }
    
    // Si c'est un chauffeur qui change le statut, notifier l'admin
    if (userId && trip.assignedTo && trip.assignedTo._id.toString() === userId) {
      await this.createStatusChangeNotification(trip, status);
    }
    
    return trip;
  }

  async addDistanceToTires(trip, distance) {
    try {
      const Tire = (await import('../models/Tire.js')).default;
      const updates = [];

      // Pneus du véhicule
      if (trip.vehicleRef) {
        updates.push(
          Tire.updateMany(
            { vehicleId: trip.vehicleRef._id, stockStatus: 'mounted' },
            { $inc: { nextCheckKm: -distance, wearPercent: distance * 0.001 } }
          )
        );
      }

      // Pneus de la remorque
      if (trip.trailerRef) {
        updates.push(
          Tire.updateMany(
            { trailerId: trip.trailerRef._id, stockStatus: 'mounted' },
            { $inc: { nextCheckKm: -distance, wearPercent: distance * 0.001 } }
          )
        );
      }

      await Promise.all(updates);
    } catch (error) {
      console.error('Erreur ajout distance pneus:', error);
    }
  }

  // Créer notification pour admin lors changement statut
  async createStatusChangeNotification(trip, newStatus) {
    try {
      // Trouver tous les admins
      const User = (await import('../models/User.js')).default;
      const admins = await User.find({ role: 'admin' });
      
      const statusMessages = {
        'in_progress': 'a démarré',
        'completed': 'a terminé', 
        'cancelled': 'a annulé'
      };
      
      const message = `Le chauffeur ${trip.assignedTo.firstname} ${trip.assignedTo.lastname} ${statusMessages[newStatus] || 'a modifié'} le trajet ${trip.reference}`;
      
      // Créer notification pour chaque admin
      for (const admin of admins) {
        await Notification.create({
          userId: admin._id,
          type: 'trip_status_change',
          title: 'Statut trajet modifié',
          message: message,
          severity: 'info',
          isRead: false,
          relatedEntity: {
            entityType: 'trip',
            entityId: trip._id
          }
        });
      }
    } catch (error) {
      console.error('Erreur notification changement statut:', error);
    }
  }

  async updateMileage(id, startKm, endKm) {
    return await Trip.findByIdAndUpdate(id, { startKm, endKm }, { new: true });
  }

  async updateFuel(id, fuelVolume) {
    return await Trip.findByIdAndUpdate(id, { fuelVolume }, { new: true });
  }

  async updateRemarks(id, remarks) {
    return await Trip.findByIdAndUpdate(id, { remarks }, { new: true });
  }
  // Find trips by driver ID
  async findByDriverId(chauffeurId) {
    return await Trip.find({ assignedTo: chauffeurId })
      .populate('assignedTo', 'firstname lastname')
      .populate('vehicleRef', 'plateNumber')
      .populate('trailerRef', 'plateNumber');
  }
}

export default new TripService();
