import vihicleModel from '../models/Vehicle.js';
import Tire from '../models/Tire.js';
import Trip from '../models/Trip.js';

class VehicleService {
  async create(vehicleData) {
    const existing = await vihicleModel.findOne({ plateNumber: vehicleData.plateNumber });
    if (existing) {
      throw new Error(`Le véhicule avec la plaque ${vehicleData.plateNumber} existe déjà`);
    }
    
    const newVehicle = await vihicleModel.create(vehicleData);
    
    // Créer automatiquement des pneus par défaut
    const tireCount = vehicleData.type === 'Camion' ? 6 : 4;
    const tires = [];
    
    for (let i = 0; i < tireCount; i++) {
      const tire = await Tire.create({
        serial: `${newVehicle.plateNumber}-T${i + 1}`,
        position: `Position ${i + 1}`,
        nextCheckKm: (vehicleData.currentKm || 0) + 10000
      });
      tires.push(tire._id);
    }
    
    newVehicle.tires = tires;
    await newVehicle.save();
    
    return newVehicle;
  }
  async findAll() {
    return await vihicleModel.find();
  }
  async findById(id) {
    return await vihicleModel.findById(id);
  }
  async update(id, vehicleData) {
    return await vihicleModel.findByIdAndUpdate(id, vehicleData, { new: true });
  }
  async delete(id) {
    return await vihicleModel.findByIdAndDelete(id);
  }

  async findAvailableVehicles(startAt, endAt) {
    const start = new Date(startAt);
    const end = endAt ? new Date(endAt) : new Date(startAt);

    const busyVehiclesIds = await Trip.find({
      $or: [
        { startAt: { $lte: end }, endAt: { $gte: start } },
        { startAt: { $gte: start, $lte: end } }
      ],
      status: { $in: ['planned', 'in_progress'] }
    }).distinct('vehicleRef');

    return await vihicleModel.find({
      status: { $in: ['active', 'in_use'] },
      _id: { $nin: busyVehiclesIds }
    });
  }
}

export default new VehicleService();