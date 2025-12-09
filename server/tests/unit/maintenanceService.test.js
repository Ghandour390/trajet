import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockMaintenance = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  save: jest.fn()
};

const MaintenanceConstructor = function(data) {
  this.data = data;
  this.save = mockMaintenance.save;
};
MaintenanceConstructor.find = mockMaintenance.find;
MaintenanceConstructor.findById = mockMaintenance.findById;
MaintenanceConstructor.findByIdAndUpdate = mockMaintenance.findByIdAndUpdate;
MaintenanceConstructor.findByIdAndDelete = mockMaintenance.findByIdAndDelete;

jest.unstable_mockModule('../../models/Maintenance.js', () => ({
  default: MaintenanceConstructor
}));

const { default: MaintenanceService } = await import('../../services/maintenanceService.js');

describe('MaintenanceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a maintenance', async () => {
      const data = { vehicleRef: '123', type: 'Oil change', date: new Date(), km: 10000 };
      mockMaintenance.save.mockResolvedValue(data);

      const result = await MaintenanceService.create(data);

      expect(mockMaintenance.save).toHaveBeenCalled();
      expect(result).toEqual(data);
    });
  });

  describe('getAll', () => {
    it('should return all maintenances', async () => {
      const maintenances = [{ type: 'Oil change' }];
      mockMaintenance.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(maintenances)
      });

      const result = await MaintenanceService.getAll();

      expect(mockMaintenance.find).toHaveBeenCalled();
      expect(result).toEqual(maintenances);
    });
  });

  describe('getById', () => {
    it('should return maintenance by id', async () => {
      const maintenance = { _id: '123', type: 'Oil change' };
      mockMaintenance.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(maintenance)
      });

      const result = await MaintenanceService.getById('123');

      expect(mockMaintenance.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(maintenance);
    });

    it('should throw error if not found', async () => {
      mockMaintenance.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(MaintenanceService.getById('123')).rejects.toThrow('Maintenance not found');
    });
  });

  describe('update', () => {
    it('should update maintenance', async () => {
      const updated = { _id: '123', type: 'Tire change' };
      mockMaintenance.findByIdAndUpdate.mockResolvedValue(updated);

      const result = await MaintenanceService.update('123', { type: 'Tire change' });

      expect(mockMaintenance.findByIdAndUpdate).toHaveBeenCalledWith('123', { type: 'Tire change' }, { new: true });
      expect(result).toEqual(updated);
    });

    it('should throw error if not found', async () => {
      mockMaintenance.findByIdAndUpdate.mockResolvedValue(null);

      await expect(MaintenanceService.update('123', {})).rejects.toThrow('Maintenance not found');
    });
  });

  describe('delete', () => {
    it('should delete maintenance', async () => {
      const deleted = { _id: '123' };
      mockMaintenance.findByIdAndDelete.mockResolvedValue(deleted);

      const result = await MaintenanceService.delete('123');

      expect(mockMaintenance.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(result).toEqual(deleted);
    });

    it('should throw error if not found', async () => {
      mockMaintenance.findByIdAndDelete.mockResolvedValue(null);

      await expect(MaintenanceService.delete('123')).rejects.toThrow('Maintenance not found');
    });
  });
});
