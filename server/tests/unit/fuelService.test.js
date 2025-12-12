import { jest } from '@jest/globals';
import fuelService from '../../services/fuelService.js';
import Fuel from '../../models/Fuel.js';

jest.unstable_mockModule('../../models/Fuel.js', () => ({
  default: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    aggregate: jest.fn()
  }
}));

describe('FuelService', () => {
  beforeAll(() => {
    Fuel.create = jest.fn();
    Fuel.find = jest.fn();
    Fuel.findById = jest.fn();
    Fuel.findByIdAndUpdate = jest.fn();
    Fuel.findByIdAndDelete = jest.fn();
    Fuel.aggregate = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create fuel record', async () => {
      const fuelData = {
        trip: 'trip123',
        vehicle: 'vehicle123',
        driver: 'driver123',
        liters: 50,
        cost: 500
      };

      Fuel.create.mockResolvedValue(fuelData);

      const result = await fuelService.create(fuelData);

      expect(Fuel.create).toHaveBeenCalledWith(fuelData);
      expect(result).toEqual(fuelData);
    });
  });

  describe('findAll', () => {
    it('should return all fuel records with filters', async () => {
      const filters = { vehicle: 'vehicle123' };
      const mockRecords = [{ _id: '1', liters: 50 }];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockRecords)
      };

      Fuel.find.mockReturnValue(mockQuery);

      const result = await fuelService.findAll(filters);

      expect(Fuel.find).toHaveBeenCalledWith({ vehicle: 'vehicle123' });
      expect(result).toEqual(mockRecords);
    });

    it('should filter by date range', async () => {
      const filters = {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      };

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([])
      };

      Fuel.find.mockReturnValue(mockQuery);

      await fuelService.findAll(filters);

      expect(Fuel.find).toHaveBeenCalledWith({
        date: {
          $gte: new Date('2024-01-01'),
          $lte: new Date('2024-12-31')
        }
      });
    });
  });

  describe('findById', () => {
    it('should return fuel record by id', async () => {
      const mockRecord = { _id: '1', liters: 50 };

      const mockQuery = {
        populate: jest.fn().mockReturnThis()
      };
      mockQuery.populate.mockResolvedValue(mockRecord);

      Fuel.findById.mockReturnValue(mockQuery);

      const result = await fuelService.findById('1');

      expect(Fuel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockRecord);
    });
  });

  describe('findByTrip', () => {
    it('should return fuel records by trip', async () => {
      const mockRecords = [{ _id: '1', trip: 'trip123' }];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockRecords)
      };

      Fuel.find.mockReturnValue(mockQuery);

      const result = await fuelService.findByTrip('trip123');

      expect(Fuel.find).toHaveBeenCalledWith({ trip: 'trip123' });
      expect(result).toEqual(mockRecords);
    });
  });

  describe('update', () => {
    it('should update fuel record', async () => {
      const updateData = { liters: 60 };
      const mockRecord = { _id: '1', liters: 60 };

      Fuel.findByIdAndUpdate.mockResolvedValue(mockRecord);

      const result = await fuelService.update('1', updateData);

      expect(Fuel.findByIdAndUpdate).toHaveBeenCalledWith('1', updateData, {
        new: true,
        runValidators: true
      });
      expect(result).toEqual(mockRecord);
    });
  });

  describe('delete', () => {
    it('should delete fuel record', async () => {
      const mockRecord = { _id: '1' };

      Fuel.findByIdAndDelete.mockResolvedValue(mockRecord);

      const result = await fuelService.delete('1');

      expect(Fuel.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockRecord);
    });
  });

  describe('getStats', () => {
    it('should return fuel statistics', async () => {
      const mockStats = [{
        totalLiters: 100,
        totalCost: 1000,
        avgPricePerLiter: 10,
        count: 2
      }];

      Fuel.aggregate.mockResolvedValue(mockStats);

      const result = await fuelService.getStats({});

      expect(Fuel.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockStats[0]);
    });

    it('should return default stats if no records', async () => {
      Fuel.aggregate.mockResolvedValue([]);

      const result = await fuelService.getStats({});

      expect(result).toEqual({
        totalLiters: 0,
        totalCost: 0,
        avgPricePerLiter: 0,
        count: 0
      });
    });
  });

  describe('getConsumptionByVehicle', () => {
    it('should return consumption by vehicle', async () => {
      const mockConsumption = [{
        _id: 'vehicle123',
        totalLiters: 100,
        totalCost: 1000
      }];

      Fuel.aggregate.mockResolvedValue(mockConsumption);

      const result = await fuelService.getConsumptionByVehicle('vehicle123');

      expect(Fuel.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockConsumption);
    });
  });
});
