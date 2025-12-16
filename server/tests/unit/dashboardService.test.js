import { jest } from '@jest/globals';
import dashboardService from '../../services/dashboardService.js';
import Vehicle from '../../models/Vehicle.js';
import Trailer from '../../models/Trailer.js';
import Trip from '../../models/Trip.js';
import User from '../../models/User.js';
import Maintenance from '../../models/Maintenance.js';

describe('DashboardService', () => {
  beforeAll(() => {
    Vehicle.countDocuments = jest.fn();
    Trailer.countDocuments = jest.fn();
    Trip.countDocuments = jest.fn();
    User.countDocuments = jest.fn();
    Maintenance.countDocuments = jest.fn();
    Trip.find = jest.fn();
    Vehicle.find = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('should return dashboard statistics', async () => {
      Vehicle.countDocuments.mockResolvedValue(10);
      Trailer.countDocuments.mockResolvedValue(5);
      Trip.countDocuments.mockResolvedValue(3);
      User.countDocuments.mockResolvedValue(8);
      Maintenance.countDocuments.mockResolvedValue(2);

      const result = await dashboardService.getStats();

      expect(result).toEqual({
        totalVehicles: 10,
        totalTrailers: 5,
        activeTrips: 3,
        totalDrivers: 8,
        pendingMaintenance: 2
      });

      expect(Vehicle.countDocuments).toHaveBeenCalled();
      expect(Trailer.countDocuments).toHaveBeenCalled();
      expect(Trip.countDocuments).toHaveBeenCalledWith({ status: 'in_progress' });
      expect(User.countDocuments).toHaveBeenCalledWith({ role: 'chauffeur' });
      expect(Maintenance.countDocuments).toHaveBeenCalledWith({ status: 'pending' });
    });
  });

  describe('getRecentTrips', () => {
    it('should return 5 recent trips with populated fields', async () => {
      const mockTrips = [
        { _id: '1', origin: 'A', destination: 'B' },
        { _id: '2', origin: 'C', destination: 'D' }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis()
      };

      mockQuery.populate.mockReturnValueOnce(mockQuery).mockResolvedValueOnce(mockTrips);
      Trip.find.mockReturnValue(mockQuery);

      const result = await dashboardService.getRecentTrips();

      expect(Trip.find).toHaveBeenCalled();
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockQuery.limit).toHaveBeenCalledWith(5);
      expect(result).toEqual(mockTrips);
    });
  });

  describe('getVehiclesNeedingAttention', () => {
    it('should return vehicles in maintenance or inactive', async () => {
      const mockVehicles = [
        { _id: '1', status: 'maintenance' },
        { _id: '2', status: 'inactive' }
      ];

      const mockQuery = {
        limit: jest.fn().mockResolvedValue(mockVehicles)
      };

      Vehicle.find.mockReturnValue(mockQuery);

      const result = await dashboardService.getVehiclesNeedingAttention();

      expect(Vehicle.find).toHaveBeenCalledWith({
        $or: [
          { status: 'maintenance' },
          { status: 'inactive' }
        ]
      });
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockVehicles);
    });
  });
});
