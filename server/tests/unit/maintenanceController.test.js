import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockMaintenanceService = {
  create: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

jest.unstable_mockModule('../../services/maintenanceService.js', () => ({
  default: mockMaintenanceService
}));

const { default: MaintenanceController } = await import('../../controllers/maintenanceController.js');

describe('MaintenanceController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create maintenance and return 201', async () => {
      const maintenance = { _id: '123', type: 'Oil change' };
      req.body = { type: 'Oil change' };
      mockMaintenanceService.create.mockResolvedValue(maintenance);

      await MaintenanceController.create(req, res);

      expect(mockMaintenanceService.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(maintenance);
    });

    it('should return 400 on error', async () => {
      mockMaintenanceService.create.mockRejectedValue(new Error('Validation error'));

      await MaintenanceController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Validation error' });
    });
  });

  describe('getAll', () => {
    it('should return all maintenances', async () => {
      const maintenances = [{ type: 'Oil change' }];
      mockMaintenanceService.getAll.mockResolvedValue(maintenances);

      await MaintenanceController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(maintenances);
    });
  });

  describe('getById', () => {
    it('should return maintenance by id', async () => {
      const maintenance = { _id: '123', type: 'Oil change' };
      req.params.id = '123';
      mockMaintenanceService.getById.mockResolvedValue(maintenance);

      await MaintenanceController.getById(req, res);

      expect(mockMaintenanceService.getById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(maintenance);
    });

    it('should return 404 if not found', async () => {
      req.params.id = '123';
      mockMaintenanceService.getById.mockRejectedValue(new Error('Maintenance not found'));

      await MaintenanceController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Maintenance not found' });
    });
  });

  describe('update', () => {
    it('should update maintenance', async () => {
      const updated = { _id: '123', type: 'Tire change' };
      req.params.id = '123';
      req.body = { type: 'Tire change' };
      mockMaintenanceService.update.mockResolvedValue(updated);

      await MaintenanceController.update(req, res);

      expect(mockMaintenanceService.update).toHaveBeenCalledWith('123', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });
  });

  describe('delete', () => {
    it('should delete maintenance', async () => {
      req.params.id = '123';
      mockMaintenanceService.delete.mockResolvedValue({});

      await MaintenanceController.delete(req, res);

      expect(mockMaintenanceService.delete).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Maintenance deleted' });
    });
  });
});
