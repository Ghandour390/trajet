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
      const tires = await tireService.findAll(req.query);
      res.json(tires);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTiresNeedingAttention(req, res) {
    try {
      const tires = await tireService.getTiresNeedingAttention();
      res.json(tires);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addInspection(req, res) {
    try {
      const tire = await tireService.addInspection(req.params.id, {
        ...req.body,
        inspector: req.user.id
      });
      res.json(tire);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async rotateTire(req, res) {
    try {
      const { toPosition, km } = req.body;
      const tire = await tireService.rotateTire(req.params.id, toPosition, km);
      res.json(tire);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAlerts(req, res) {
    try {
      const alerts = await tireService.getAlerts(req.query);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async resolveAlert(req, res) {
    try {
      const alert = await tireService.resolveAlert(req.params.id, req.user.id);
      res.json(alert);
    } catch (error) {
      res.status(400).json({ message: error.message });
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
