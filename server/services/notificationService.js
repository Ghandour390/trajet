import Notification from '../models/Notification.js';
import Vehicle from '../models/Vehicle.js';
import Tire from '../models/Tire.js';
import Maintenance from '../models/Maintenance.js';
import User from '../models/User.js';

const TIRE_ALERT_THRESHOLD = 50;
const MAINTENANCE_ALERT_THRESHOLD = 50;

export const checkTireAlerts = async () => {
  const vehicles = await Vehicle.find({ status: { $ne: 'inactive' } }).populate('tires');
  const admins = await User.find({ role: 'admin' });
  const alerts = [];

  for (const vehicle of vehicles) {
    for (const tire of vehicle.tires) {
      const remainingKm = tire.nextCheckKm - vehicle.currentKm;
      
      if (remainingKm <= TIRE_ALERT_THRESHOLD && remainingKm > 0) {
        for (const admin of admins) {
          const existingAlert = await Notification.findOne({
            type: 'tire_alert',
            'relatedEntity.entityId': tire._id,
            isRead: false,
            userId: admin._id
          });

          if (!existingAlert) {
            const notification = await Notification.create({
              type: 'tire_alert',
              severity: remainingKm <= 20 ? 'critical' : 'warning',
              title: `Alerte pneu - ${vehicle.plateNumber}`,
              message: `Le pneu ${tire.serial} (position ${tire.position}) nécessite un contrôle dans ${remainingKm}km`,
              relatedEntity: {
                entityType: 'tire',
                entityId: tire._id
              },
              userId: admin._id
            });
            alerts.push(notification);
          }
        }
      }
    }
  }

  return alerts;
};

export const checkMaintenanceAlerts = async () => {
  const vehicles = await Vehicle.find({ status: { $ne: 'inactive' } });
  const admins = await User.find({ role: 'admin' });
  const alerts = [];

  for (const vehicle of vehicles) {
    const lastMaintenance = await Maintenance.findOne({ 
      vehicleRef: vehicle._id,
      type: 'vidange'
    }).sort({ km: -1 });

    if (lastMaintenance) {
      const kmSinceLastMaintenance = vehicle.currentKm - lastMaintenance.km;
      const remainingKm = 10000 - kmSinceLastMaintenance;

      if (remainingKm <= MAINTENANCE_ALERT_THRESHOLD && remainingKm > 0) {
        for (const admin of admins) {
          const existingAlert = await Notification.findOne({
            type: 'maintenance_alert',
            'relatedEntity.entityId': vehicle._id,
            isRead: false,
            userId: admin._id
          });

          if (!existingAlert) {
            const notification = await Notification.create({
              type: 'maintenance_alert',
              severity: remainingKm <= 20 ? 'critical' : 'warning',
              title: `Alerte vidange - ${vehicle.plateNumber}`,
              message: `Vidange nécessaire dans ${remainingKm}km`,
              relatedEntity: {
                entityType: 'vehicle',
                entityId: vehicle._id
              },
              userId: admin._id
            });
            alerts.push(notification);
          }
        }
      }
    }
  }

  return alerts;
};

export const validateTripAssignment = async (vehicleId, trailerId, distance) => {
  const errors = [];
  
  try {
    const vehicle = await Vehicle.findById(vehicleId).populate('tires');
    if (!vehicle) {
      return { valid: false, errors: ['Véhicule introuvable'] };
    }
  } catch (error) {
    return { valid: false, errors: ['Véhicule introuvable'] };
  }
  
  const vehicle = await Vehicle.findById(vehicleId).populate('tires');

  // Vérifier pneus véhicule
  for (const tire of vehicle.tires) {
    const remainingKm = tire.nextCheckKm - vehicle.currentKm;
    if (remainingKm < distance) {
      errors.push(`Pneu ${tire.serial} du véhicule: capacité insuffisante (${remainingKm}km restants < ${distance}km requis)`);
    }
  }

  // Vérifier vidange
  const lastMaintenance = await Maintenance.findOne({ 
    vehicleRef: vehicle._id,
    type: 'vidange'
  }).sort({ km: -1 });

  if (lastMaintenance) {
    const kmSinceLastMaintenance = vehicle.currentKm - lastMaintenance.km;
    const remainingKm = 10000 - kmSinceLastMaintenance;
    if (remainingKm < distance) {
      errors.push(`Vidange nécessaire: capacité insuffisante (${remainingKm}km restants < ${distance}km requis)`);
    }
  }

  // Vérifier remorque si présente
  if (trailerId) {
    const trailer = await Vehicle.findById(trailerId).populate('tires');
    if (trailer) {
      for (const tire of trailer.tires) {
        const remainingKm = tire.nextCheckKm - trailer.currentKm;
        if (remainingKm < distance) {
          errors.push(`Pneu ${tire.serial} de la remorque: capacité insuffisante (${remainingKm}km restants < ${distance}km requis)`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
};

export const getNotifications = async (userId, filters = {}) => {
  const query = { userId };
  
  if (filters.isRead !== undefined) {
    query.isRead = filters.isRead;
  }
  
  if (filters.type) {
    query.type = filters.type;
  }

  return await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(filters.limit || 50);
};

export const markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
};

export const markAllAsRead = async (userId) => {
  return await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );
};

export const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({ userId, isRead: false });
};
