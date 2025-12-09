import vihicleModel from '../models/Vehicle.js';

class VehicleService {
  async create(vehicleData) {
    return await vihicleModel.create(vehicleData);
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

  
}

export default new VehicleService();