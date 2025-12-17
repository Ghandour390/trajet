import vihicleModel from '../models/Vehicle.js';
import Tire from '../models/Tire.js';
import Trip from '../models/Trip.js';

class VehicleService {
  async create(vehicleData) {
    const existing = await vihicleModel.findOne({ plateNumber: vehicleData.plateNumber });
    if (existing) {
      throw new Error(`Le véhicule avec la plaque ${vehicleData.plateNumber} existe déjà`);
    }
    
    const { tires: tiresData, ...vehicleInfo } = vehicleData;
    const newVehicle = await vihicleModel.create(vehicleInfo);
    
    const tireIds = [];
    
    if (tiresData && tiresData.length > 0) {
      for (const tireData of tiresData) {
        const tire = await Tire.create({
          serial: tireData.serial || `${newVehicle.plateNumber}-T${tireIds.length + 1}`,
          position: tireData.position || `Position ${tireIds.length + 1}`,
          brand: tireData.brand,
          pressure: tireData.pressure,
          depth: tireData.depth,
          vehicleId: newVehicle._id,
          stockStatus: 'mounted',
          nextCheckKm: (vehicleInfo.currentKm || 0) + 10000,
          wearPercent: 0
        });
        tireIds.push(tire._id);
      }
    }
    
    newVehicle.tires = tireIds;
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

  async findByIdWithTires(id) {
    const vehicle = await vihicleModel.findById(id);
    if (!vehicle) return null;

    const tires = await Tire.find({ vehicleId: id, stockStatus: 'mounted' });
    return { ...vehicle.toObject(), tires };
  }
}

export default new VehicleService();