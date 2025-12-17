import Tire from '../models/Tire.js';
import TireAlert from '../models/TireAlert.js';
import Vehicle from '../models/Vehicle.js';

class TireService {
  async create(tireData) {
    return await Tire.create(tireData);
  }

  async findAll(filters = {}) {
    const query = {};
    if (filters.vehicleId) query.vehicleId = filters.vehicleId;
    if (filters.stockStatus) query.stockStatus = filters.stockStatus;
    return await Tire.find(query).populate('vehicleId', 'plateNumber');
  }

  async getTiresNeedingAttention() {
    const tires = await Tire.find({ stockStatus: 'mounted' });
    return tires.filter(tire => tire.needsAttention());
  }

  async addInspection(tireId, inspectionData) {
    const tire = await Tire.findById(tireId);
    if (!tire) throw new Error('Pneu non trouvé');
    await tire.addInspection(inspectionData);
    await this.checkAndCreateAlerts(tire);
    return tire;
  }

  async rotateTire(tireId, toPosition, km) {
    const tire = await Tire.findById(tireId);
    if (!tire) throw new Error('Pneu non trouvé');
    return await tire.rotate(toPosition, km);
  }

  async checkAndCreateAlerts(tire) {
    const alerts = [];
    
    if (tire.pressure && tire.pressure < 7) {
      alerts.push({
        tireId: tire._id,
        vehicleId: tire.vehicleId,
        alertType: 'low_pressure',
        severity: 'critical',
        message: `Pression basse: ${tire.pressure} bar`
      });
    }
    
    if (tire.depth && tire.depth < 3) {
      alerts.push({
        tireId: tire._id,
        vehicleId: tire.vehicleId,
        alertType: 'low_depth',
        severity: 'critical',
        message: `Profondeur critique: ${tire.depth} mm`
      });
    }
    
    if (tire.wearPercent > 80) {
      alerts.push({
        tireId: tire._id,
        vehicleId: tire.vehicleId,
        alertType: 'high_wear',
        severity: 'warning',
        message: `Usure élevée: ${tire.wearPercent}%`
      });
    }
    
    for (const alert of alerts) {
      const existing = await TireAlert.findOne({
        tireId: alert.tireId,
        alertType: alert.alertType,
        isResolved: false
      });
      if (!existing) await TireAlert.create(alert);
    }
  }

  async getAlerts(filters = {}) {
    const query = { isResolved: false };
    if (filters.vehicleId) query.vehicleId = filters.vehicleId;
    if (filters.severity) query.severity = filters.severity;
    return await TireAlert.find(query)
      .populate('tireId', 'serial position')
      .populate('vehicleId', 'plateNumber')
      .sort({ severity: -1, createdAt: -1 });
  }

  async resolveAlert(alertId, userId) {
    return await TireAlert.findByIdAndUpdate(alertId, {
      isResolved: true,
      resolvedAt: new Date(),
      resolvedBy: userId
    }, { new: true });
  }

  async findById(id) {
    return await Tire.findById(id);
  }

  async update(id, tireData) {
    return await Tire.findByIdAndUpdate(id, tireData, { new: true });
  }

  async delete(id) {
    return await Tire.findByIdAndDelete(id);
  }

  async linkToVehicle(tireId, vehicleId) {
    const tire = await Tire.findById(tireId);
    if (!tire) {
      throw new Error('Tire not found');
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (!vehicle.tires.includes(tire._id)) {
      vehicle.tires.push(tire._id);
      await vehicle.save();
    }

    return { tire, vehicle };
  }
}

export default new TireService();
