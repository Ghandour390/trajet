import Maintenance from '../models/Maintenance.js';

class MaintenanceService {
  async create(data) {
    const maintenance = new Maintenance(data);
    return await maintenance.save();
  }

  async getAll() {
    return await Maintenance.find().populate('vehicleRef');
  }

  async getById(id) {
    const maintenance = await Maintenance.findById(id).populate('vehicleRef');
    if (!maintenance) {
      throw new Error('Maintenance not found');
    }
    return maintenance;
  }

  async update(id, data) {
    const maintenance = await Maintenance.findByIdAndUpdate(id, data, { new: true });
    if (!maintenance) {
      throw new Error('Maintenance not found');
    }
    return maintenance;
  }

  async delete(id) {
    const maintenance = await Maintenance.findByIdAndDelete(id);
    if (!maintenance) {
      throw new Error('Maintenance not found');
    }
    return maintenance;
  }
}

export default new MaintenanceService();
