import fuelService from '../services/fuelService.js';

class FuelController {
  // @desc    Create fuel record
  // @route   POST /api/fuel
  async createFuelRecord(req, res) {
    try {
      const fuelRecord = await fuelService.create(req.body);
      res.status(201).json(fuelRecord);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // @desc    Get all fuel records
  // @route   GET /api/fuel
  async getAllFuelRecords(req, res) {
    try {
      const records = await fuelService.findAll(req.query);
      res.status(200).json(records);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // @desc    Get fuel record by ID
  // @route   GET /api/fuel/:id
  async getFuelRecordById(req, res) {
    try {
      const record = await fuelService.findById(req.params.id);
      if (!record) {
        return res.status(404).json({ message: 'Enregistrement non trouvé' });
      }
      res.status(200).json(record);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // @desc    Get fuel records by trip
  // @route   GET /api/fuel/trip/:tripId
  async getFuelByTrip(req, res) {
    try {
      const records = await fuelService.findByTrip(req.params.tripId);
      res.status(200).json(records);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // @desc    Update fuel record
  // @route   PUT /api/fuel/:id
  async updateFuelRecord(req, res) {
    try {
      const record = await fuelService.update(req.params.id, req.body);
      if (!record) {
        return res.status(404).json({ message: 'Enregistrement non trouvé' });
      }
      res.status(200).json(record);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // @desc    Delete fuel record
  // @route   DELETE /api/fuel/:id
  async deleteFuelRecord(req, res) {
    try {
      const record = await fuelService.delete(req.params.id);
      if (!record) {
        return res.status(404).json({ message: 'Enregistrement non trouvé' });
      }
      res.status(200).json({ message: 'Enregistrement supprimé' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // @desc    Get fuel statistics
  // @route   GET /api/fuel/stats
  async getFuelStats(req, res) {
    try {
      const stats = await fuelService.getStats(req.query);
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // @desc    Get consumption by vehicle
  // @route   GET /api/fuel/consumption/:vehicleId
  async getConsumptionByVehicle(req, res) {
    try {
      const { vehicleId } = req.params;
      const { startDate, endDate } = req.query;
      const consumption = await fuelService.getConsumptionByVehicle(vehicleId, startDate, endDate);
      res.status(200).json(consumption);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new FuelController();
