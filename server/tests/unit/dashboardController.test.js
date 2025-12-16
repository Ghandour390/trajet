import { jest } from '@jest/globals';
import dashboardController from '../../controllers/dashboardController.js';
import dashboardService from '../../services/dashboardService.js';

jest.unstable_mockModule('../../services/dashboardService.js', () => ({
  default: {
    getStats: jest.fn(),
    getRecentTrips: jest.fn(),
    getVehiclesNeedingAttention: jest.fn()
  }
}));

describe('DashboardController', () => {
  let req, res;

  beforeAll(() => {
    dashboardService.getStats = jest.fn();
    dashboardService.getRecentTrips = jest.fn();
    dashboardService.getVehiclesNeedingAttention = jest.fn();
  });

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('should return stats successfully', async () => {
      const mockStats = {
        totalVehicles: 10,
        totalTrailers: 5,
        activeTrips: 3,
        totalDrivers: 8,
        pendingMaintenance: 2
      };

      dashboardService.getStats.mockResolvedValue(mockStats);

      await dashboardController.getStats(req, res);

      expect(dashboardService.getStats).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStats);
    });

    it('should handle errors', async () => {
      dashboardService.getStats.mockRejectedValue(new Error('Database error'));

      await dashboardController.getStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getRecentTrips', () => {
    it('should return recent trips successfully', async () => {
      const mockTrips = [
        { _id: '1', origin: 'A', destination: 'B' },
        { _id: '2', origin: 'C', destination: 'D' }
      ];

      dashboardService.getRecentTrips.mockResolvedValue(mockTrips);

      await dashboardController.getRecentTrips(req, res);

      expect(dashboardService.getRecentTrips).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTrips);
    });

    it('should handle errors', async () => {
      dashboardService.getRecentTrips.mockRejectedValue(new Error('Database error'));

      await dashboardController.getRecentTrips(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getVehiclesNeedingAttention', () => {
    it('should return vehicles needing attention successfully', async () => {
      const mockVehicles = [
        { _id: '1', status: 'maintenance' },
        { _id: '2', status: 'inactive' }
      ];

      dashboardService.getVehiclesNeedingAttention.mockResolvedValue(mockVehicles);

      await dashboardController.getVehiclesNeedingAttention(req, res);

      expect(dashboardService.getVehiclesNeedingAttention).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockVehicles);
    });

    it('should handle errors', async () => {
      dashboardService.getVehiclesNeedingAttention.mockRejectedValue(new Error('Database error'));

      await dashboardController.getVehiclesNeedingAttention(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
});
