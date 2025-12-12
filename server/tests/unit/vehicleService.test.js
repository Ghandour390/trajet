import { jest } from '@jest/globals';
import vehicleService from '../../services/vehicleService.js';
import Vehicle from '../../models/Vehicle.js';
import Tire from '../../models/Tire.js';
import Trip from '../../models/Trip.js';

describe('VehicleService', () => {
  beforeAll(() => {
    Vehicle.findOne = jest.fn();
    Vehicle.create = jest.fn();
    Vehicle.find = jest.fn();
    Vehicle.findById = jest.fn();
    Vehicle.findByIdAndUpdate = jest.fn();
    Vehicle.findByIdAndDelete = jest.fn();
    Tire.create = jest.fn();
    Trip.find = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create vehicle with tires', async () => {
      const vehicleData = {
        plateNumber: 'A-12345-B',
        type: 'Camion',
        brand: 'Mercedes',
        year: 2020,
        currentKm: 0
      };

      Vehicle.findOne.mockResolvedValue(null);
      Vehicle.create.mockResolvedValue({
        ...vehicleData,
        _id: 'vehicle123',
        tires: [],
        save: jest.fn()
      });

      Tire.create.mockResolvedValue({ _id: 'tire123' });

      const result = await vehicleService.create(vehicleData);

      expect(Vehicle.findOne).toHaveBeenCalledWith({ plateNumber: 'A-12345-B' });
      expect(Vehicle.create).toHaveBeenCalledWith(vehicleData);
      expect(Tire.create).toHaveBeenCalledTimes(6); // 6 tires for Camion
    });

    it('should throw error if vehicle exists', async () => {
      const vehicleData = { plateNumber: 'A-12345-B' };

      Vehicle.findOne.mockResolvedValue({ plateNumber: 'A-12345-B' });

      await expect(vehicleService.create(vehicleData)).rejects.toThrow(
        'Le véhicule avec la plaque A-12345-B existe déjà'
      );
    });
  });

  describe('findAll', () => {
    it('should return all vehicles', async () => {
      const mockVehicles = [{ _id: '1' }, { _id: '2' }];

      Vehicle.find.mockResolvedValue(mockVehicles);

      const result = await vehicleService.findAll();

      expect(Vehicle.find).toHaveBeenCalled();
      expect(result).toEqual(mockVehicles);
    });
  });

  describe('findById', () => {
    it('should return vehicle by id', async () => {
      const mockVehicle = { _id: '1', plateNumber: 'A-12345-B' };

      Vehicle.findById.mockResolvedValue(mockVehicle);

      const result = await vehicleService.findById('1');

      expect(Vehicle.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('update', () => {
    it('should update vehicle', async () => {
      const updateData = { currentKm: 10000 };
      const mockVehicle = { _id: '1', currentKm: 10000 };

      Vehicle.findByIdAndUpdate.mockResolvedValue(mockVehicle);

      const result = await vehicleService.update('1', updateData);

      expect(Vehicle.findByIdAndUpdate).toHaveBeenCalledWith('1', updateData, { new: true });
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('delete', () => {
    it('should delete vehicle', async () => {
      const mockVehicle = { _id: '1' };

      Vehicle.findByIdAndDelete.mockResolvedValue(mockVehicle);

      const result = await vehicleService.delete('1');

      expect(Vehicle.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('findAvailableVehicles', () => {
    it('should return available vehicles for date range', async () => {
      const startAt = '2024-01-15T08:00:00';
      const endAt = '2024-01-15T18:00:00';

      const mockQuery = {
        distinct: jest.fn().mockResolvedValue(['vehicle1', 'vehicle2'])
      };

      Trip.find.mockReturnValue(mockQuery);
      Vehicle.find.mockResolvedValue([{ _id: 'vehicle3' }]);

      const result = await vehicleService.findAvailableVehicles(startAt, endAt);

      expect(Trip.find).toHaveBeenCalledWith({
        $or: [
          { startAt: { $lte: new Date(endAt) }, endAt: { $gte: new Date(startAt) } },
          { startAt: { $gte: new Date(startAt), $lte: new Date(endAt) } }
        ],
        status: { $in: ['planned', 'in_progress'] }
      });

      expect(Vehicle.find).toHaveBeenCalledWith({
        status: { $in: ['active', 'in_use'] },
        _id: { $nin: ['vehicle1', 'vehicle2'] }
      });

      expect(result).toEqual([{ _id: 'vehicle3' }]);
    });

    it('should handle single date', async () => {
      const startAt = '2024-01-15T08:00:00';

      const mockQuery = {
        distinct: jest.fn().mockResolvedValue([])
      };

      Trip.find.mockReturnValue(mockQuery);
      Vehicle.find.mockResolvedValue([]);

      await vehicleService.findAvailableVehicles(startAt, null);

      expect(Trip.find).toHaveBeenCalled();
    });
  });
});
