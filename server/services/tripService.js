import Trip from '../models/Trip.js';

class TripService {
  async create(tripData) {
    return await Trip.create(tripData);
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
    return await Trip.findByIdAndUpdate(id, tripData, { new: true });
  }

  async delete(id) {
    return await Trip.findByIdAndDelete(id);
  }

  async updateStatus(id, status) {
    return await Trip.findByIdAndUpdate(id, { status }, { new: true });
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
