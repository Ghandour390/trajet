import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockTire = {
  find: jest.fn().mockReturnValue({
    populate: jest.fn().mockResolvedValue([])
  }),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

const mockVehicle = {
  findById: jest.fn()
};

jest.unstable_mockModule('../../models/Tire.js', () => ({
  default: mockTire
}));

jest.unstable_mockModule('../../models/Vehicle.js', () => ({
  default: mockVehicle
}));

const { default: tireController } = await import('../../controllers/tireController.js');

describe('TireController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 'user123', role: 'admin' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createTire - TRAJ-46', () => {
    it('should create a tire', async () => {
      const tireData = { serial: 'TIRE001', position: 'Front Left', nextCheckKm: 50000 };
      req.body = tireData;
      mockTire.create.mockResolvedValue({ _id: 'tire123', ...tireData });

      await tireController.createTire(req, res);

      expect(mockTire.create).toHaveBeenCalledWith(tireData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(tireData));
    });
  });

  describe('getAllTires', () => {
    it('should return all tires', async () => {
      const mockTires = [{ _id: 'tire1' }, { _id: 'tire2' }];
      mockTire.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTires)
      });

      await tireController.getAllTires(req, res);

      expect(mockTire.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockTires);
    });
  });

  describe('updateTire', () => {
    it('should update tire', async () => {
      req.params.id = 'tire123';
      req.body = { wearPercent: 50 };
      mockTire.findByIdAndUpdate.mockResolvedValue({ _id: 'tire123', wearPercent: 50 });

      await tireController.updateTire(req, res);

      expect(mockTire.findByIdAndUpdate).toHaveBeenCalledWith('tire123', req.body, { new: true });
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('linkTireToVehicle - TRAJ-48', () => {
    it('should link tire to vehicle', async () => {
      req.params.id = 'tire123';
      req.body = { vehicleId: 'vehicle456' };
      
      const mockTireObj = { _id: 'tire123', serial: 'TIRE001' };
      const mockVehicleObj = { 
        _id: 'vehicle456', 
        tires: [],
        save: jest.fn().mockResolvedValue(true)
      };

      mockTire.findById.mockResolvedValue(mockTireObj);
      mockVehicle.findById.mockResolvedValue(mockVehicleObj);

      await tireController.linkTireToVehicle(req, res);

      expect(mockTire.findById).toHaveBeenCalledWith('tire123');
      expect(mockVehicle.findById).toHaveBeenCalledWith('vehicle456');
      expect(mockVehicleObj.tires).toContain('tire123');
      expect(res.json).toHaveBeenCalled();
    });
  });
});
