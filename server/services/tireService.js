import Tire from '../models/Tire.js';
import Vehicle from '../models/Vehicle.js';

class TireService {
  async create(tireData) {
    return await Tire.create(tireData);
  }

  async findAll() {
    return await Tire.find();
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
