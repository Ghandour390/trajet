import { jest } from '@jest/globals';
import tireService from '../../services/tireService.js';
import Tire from '../../models/Tire.js';
import TireAlert from '../../models/TireAlert.js';

describe('TireService - Enhanced', () => {
  beforeAll(() => {
    Tire.find = jest.fn();
    Tire.findById = jest.fn();
    TireAlert.find = jest.fn();
    TireAlert.findOne = jest.fn();
    TireAlert.create = jest.fn();
    TireAlert.findByIdAndUpdate = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTiresNeedingAttention', () => {
    it('should return tires needing attention', async () => {
      const mockTires = [
        { _id: '1', pressure: 6, needsAttention: () => true },
        { _id: '2', depth: 2, needsAttention: () => true },
        { _id: '3', pressure: 8, depth: 5, needsAttention: () => false }
      ];

      Tire.find.mockResolvedValue(mockTires);

      const result = await tireService.getTiresNeedingAttention();

      expect(Tire.find).toHaveBeenCalledWith({ stockStatus: 'mounted' });
      expect(result).toHaveLength(2);
    });
  });

  describe('addInspection', () => {
    it('should add inspection and check alerts', async () => {
      const mockTire = {
        _id: 'tire1',
        pressure: 6,
        depth: 2,
        addInspection: jest.fn().mockResolvedValue(true),
        needsAttention: () => true
      };

      Tire.findById.mockResolvedValue(mockTire);
      TireAlert.findOne.mockResolvedValue(null);
      TireAlert.create.mockResolvedValue({});

      const inspectionData = { pressure: 6, depth: 2, notes: 'Low pressure' };
      await tireService.addInspection('tire1', inspectionData);

      expect(mockTire.addInspection).toHaveBeenCalledWith(inspectionData);
      expect(TireAlert.create).toHaveBeenCalled();
    });
  });

  describe('checkAndCreateAlerts', () => {
    it('should create alert for low pressure', async () => {
      const tire = {
        _id: 'tire1',
        vehicleId: 'vehicle1',
        pressure: 5,
        depth: 5,
        wearPercent: 50
      };

      TireAlert.findOne.mockResolvedValue(null);
      TireAlert.create.mockResolvedValue({});

      await tireService.checkAndCreateAlerts(tire);

      expect(TireAlert.create).toHaveBeenCalledWith(
        expect.objectContaining({
          alertType: 'low_pressure',
          severity: 'critical'
        })
      );
    });

    it('should create alert for low depth', async () => {
      const tire = {
        _id: 'tire1',
        vehicleId: 'vehicle1',
        pressure: 8,
        depth: 2,
        wearPercent: 50
      };

      TireAlert.findOne.mockResolvedValue(null);
      TireAlert.create.mockResolvedValue({});

      await tireService.checkAndCreateAlerts(tire);

      expect(TireAlert.create).toHaveBeenCalledWith(
        expect.objectContaining({
          alertType: 'low_depth',
          severity: 'critical'
        })
      );
    });

    it('should not create duplicate alerts', async () => {
      const tire = {
        _id: 'tire1',
        vehicleId: 'vehicle1',
        pressure: 5,
        depth: 5,
        wearPercent: 50
      };

      TireAlert.findOne.mockResolvedValue({ _id: 'existing' });

      await tireService.checkAndCreateAlerts(tire);

      expect(TireAlert.create).not.toHaveBeenCalled();
    });
  });

  describe('getAlerts', () => {
    it('should return unresolved alerts', async () => {
      const mockAlerts = [
        { _id: '1', alertType: 'low_pressure', severity: 'critical' }
      ];

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockAlerts)
      };

      TireAlert.find.mockReturnValue(mockQuery);

      const result = await tireService.getAlerts();

      expect(TireAlert.find).toHaveBeenCalledWith({ isResolved: false });
      expect(result).toEqual(mockAlerts);
    });
  });

  describe('resolveAlert', () => {
    it('should resolve alert', async () => {
      const mockAlert = { _id: 'alert1', isResolved: true };

      TireAlert.findByIdAndUpdate.mockResolvedValue(mockAlert);

      const result = await tireService.resolveAlert('alert1', 'user1');

      expect(TireAlert.findByIdAndUpdate).toHaveBeenCalledWith(
        'alert1',
        expect.objectContaining({
          isResolved: true,
          resolvedBy: 'user1'
        }),
        { new: true }
      );
      expect(result).toEqual(mockAlert);
    });
  });
});
