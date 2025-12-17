import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockTire = {
  create: jest.fn(),
  find: jest.fn().mockReturnValue({
    populate: jest.fn().mockResolvedValue([])
  }),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

jest.unstable_mockModule('../../models/Tire.js', () => ({
  default: mockTire
}));

const { default: tireService } = await import('../../services/tireService.js');

describe('TireService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a tire', async () => {
      const tireData = { serial: 'T-123', position: 'Front Left', nextCheckKm: 10000 };
      mockTire.create.mockResolvedValue(tireData);

      const result = await tireService.create(tireData);

      expect(mockTire.create).toHaveBeenCalledWith(tireData);
      expect(result).toEqual(tireData);
    });
  });

  describe('findAll', () => {
    it('should find all tires', async () => {
      const tires = [{ _id: '1' }, { _id: '2' }];
      mockTire.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(tires)
      });

      const result = await tireService.findAll();

      expect(mockTire.find).toHaveBeenCalled();
      expect(result).toEqual(tires);
    });
  });

  describe('findById', () => {
    it('should find tire by id', async () => {
      const tire = { _id: '123', serial: 'T-123' };
      mockTire.findById.mockResolvedValue(tire);

      const result = await tireService.findById('123');

      expect(mockTire.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(tire);
    });
  });

  describe('update', () => {
    it('should update tire', async () => {
      const updated = { _id: '123', wearPercent: 50 };
      mockTire.findByIdAndUpdate.mockResolvedValue(updated);

      const result = await tireService.update('123', { wearPercent: 50 });

      expect(mockTire.findByIdAndUpdate).toHaveBeenCalledWith('123', { wearPercent: 50 }, { new: true });
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should delete tire', async () => {
      const deleted = { _id: '123' };
      mockTire.findByIdAndDelete.mockResolvedValue(deleted);

      const result = await tireService.delete('123');

      expect(mockTire.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(result).toEqual(deleted);
    });
  });
});
