import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockVehicleService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

jest.unstable_mockModule('../../services/vehicleService.js', () => ({
  default: mockVehicleService
}));

const { default: vihicleController } = await import('../../controllers/vihicleController.js');

describe('VihicleController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createVehicle', () => {
    it('should create vehicle successfully', async () => {
      req.body = { plateNumber: 'A-123-B', type: 'Camion', brand: 'Mercedes' };
      mockVehicleService.create.mockResolvedValue({ _id: '1', plateNumber: 'A-123-B' });

      await vihicleController.createVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockVehicleService.create.mockRejectedValue(new Error('Error'));

      await vihicleController.createVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getAllVehicles', () => {
    it('should get all vehicles', async () => {
      mockVehicleService.findAll.mockResolvedValue([{ _id: '1' }]);

      await vihicleController.getAllVehicles(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getVehicleById', () => {
    it('should get vehicle by id', async () => {
      req.params.id = '123';
      mockVehicleService.findById.mockResolvedValue({ _id: '123' });

      await vihicleController.getVehicleById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if not found', async () => {
      req.params.id = '123';
      mockVehicleService.findById.mockResolvedValue(null);

      await vihicleController.getVehicleById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateVehicle', () => {
    it('should update vehicle', async () => {
      req.params.id = '123';
      req.body = { brand: 'Volvo' };
      mockVehicleService.update.mockResolvedValue({ _id: '123' });

      await vihicleController.updateVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteVehicle', () => {
    it('should delete vehicle', async () => {
      req.params.id = '123';
      mockVehicleService.delete.mockResolvedValue({ _id: '123' });

      await vihicleController.deleteVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
