import Fuel from '../models/Fuel.js';

class FuelService {
  async create(fuelData) {
    return await Fuel.create(fuelData);
  }

  async findAll(filters = {}) {
    const query = {};
    if (filters.vehicle) query.vehicle = filters.vehicle;
    if (filters.driver) query.driver = filters.driver;
    if (filters.trip) query.trip = filters.trip;
    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = new Date(filters.startDate);
      if (filters.endDate) query.date.$lte = new Date(filters.endDate);
    }

    return await Fuel.find(query)
      .populate('trip', 'reference origin destination')
      .populate('vehicle', 'plateNumber brand')
      .populate('driver', 'firstname lastname')
      .sort({ date: -1 });
  }

  async findById(id) {
    return await Fuel.findById(id)
      .populate('trip', 'reference origin destination startKm endKm')
      .populate('vehicle', 'plateNumber brand type')
      .populate('driver', 'firstname lastname');
  }

  async findByTrip(tripId) {
    return await Fuel.find({ trip: tripId })
      .populate('vehicle', 'plateNumber')
      .populate('driver', 'firstname lastname')
      .sort({ date: -1 });
  }

  async update(id, fuelData) {
    return await Fuel.findByIdAndUpdate(id, fuelData, { 
      new: true,
      runValidators: true 
    });
  }

  async delete(id) {
    return await Fuel.findByIdAndDelete(id);
  }

  async getStats(filters = {}) {
    const query = {};
    if (filters.vehicle) query.vehicle = filters.vehicle;
    if (filters.driver) query.driver = filters.driver;
    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = new Date(filters.startDate);
      if (filters.endDate) query.date.$lte = new Date(filters.endDate);
    }

    const stats = await Fuel.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalLiters: { $sum: '$liters' },
          totalCost: { $sum: '$cost' },
          avgPricePerLiter: { $avg: '$pricePerLiter' },
          count: { $sum: 1 }
        }
      }
    ]);

    return stats[0] || { totalLiters: 0, totalCost: 0, avgPricePerLiter: 0, count: 0 };
  }

  async getConsumptionByVehicle(vehicleId, startDate, endDate) {
    const query = { vehicle: vehicleId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    return await Fuel.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$vehicle',
          totalLiters: { $sum: '$liters' },
          totalCost: { $sum: '$cost' },
          avgPricePerLiter: { $avg: '$pricePerLiter' },
          count: { $sum: 1 }
        }
      }
    ]);
  }
}

export default new FuelService();
