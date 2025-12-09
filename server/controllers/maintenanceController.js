import MaintenanceService from '../services/maintenanceService.js';

class MaintenanceController {
  async create(req, res) {
    try {
      const maintenance = await MaintenanceService.create(req.body);
      res.status(201).json(maintenance);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const maintenances = await MaintenanceService.getAll();
      res.status(200).json(maintenances);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const maintenance = await MaintenanceService.getById(req.params.id);
      res.status(200).json(maintenance);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const maintenance = await MaintenanceService.update(req.params.id, req.body);
      res.status(200).json(maintenance);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await MaintenanceService.delete(req.params.id);
      res.status(200).json({ message: 'Maintenance deleted' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

export default new MaintenanceController();
