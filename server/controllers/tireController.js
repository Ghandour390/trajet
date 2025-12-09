import tireService from '../services/tireService.js';

class TireController {
  async createTire(req, res) {
    try {
      const tire = await tireService.create(req.body);
      res.status(201).json(tire);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllTires(req, res) {
    try {
      const tires = await tireService.findAll();
      res.json(tires);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTireById(req, res) {
    try {
      const tire = await tireService.findById(req.params.id);
      if (!tire) {
        return res.status(404).json({ message: 'Tire not found' });
      }
      res.json(tire);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateTire(req, res) {
    try {
      const tire = await tireService.update(req.params.id, req.body);
      if (!tire) {
        return res.status(404).json({ message: 'Tire not found' });
      }
      res.json(tire);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteTire(req, res) {
    try {
      const tire = await tireService.delete(req.params.id);
      if (!tire) {
        return res.status(404).json({ message: 'Tire not found' });
      }
      res.json({ message: 'Tire deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async linkTireToVehicle(req, res) {
    try {
      const { vehicleId } = req.body;
      const result = await tireService.linkToVehicle(req.params.id, vehicleId);
      res.json({ message: 'Tire linked to vehicle', ...result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new TireController();
