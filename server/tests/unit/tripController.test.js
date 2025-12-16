import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockTrip = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

jest.unstable_mockModule('../../models/Trip.js', () => ({
  default: mockTrip
}));

const { default: tripController } = await import('../../controllers/tripController.js');

describe('TripController', () => {
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

  describe('createTrip - TRAJ-41', () => {
    it('should create a trip', async () => {
      const tripData = { origin: 'Casablanca', destination: 'Marrakech' };
      req.body = tripData;

      await tripController.createTrip(req, res);

      expect(res.status).toHaveBeenCalled();
    });
  });

  describe('getAllTrips', () => {
    it('should return all trips for admin', async () => {
      const mockTrips = [{ _id: 'trip1' }, { _id: 'trip2' }];
      const populateChain = {
        populate: jest.fn(function() {
          if (this.populate.mock.calls.length === 3) {
            return Promise.resolve(mockTrips);
          }
          return this;
        })
      };
      mockTrip.find.mockReturnValue(populateChain);

      await tripController.getAllTrips(req, res);

      expect(mockTrip.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith(mockTrips);
    });

    it('should filter trips for chauffeur', async () => {
      req.user.role = 'chauffeur';
      const mockTrips = [{ _id: 'trip1', assignedTo: 'user123' }];
      const populateChain = {
        populate: jest.fn(function() {
          if (this.populate.mock.calls.length === 3) {
            return Promise.resolve(mockTrips);
          }
          return this;
        })
      };
      mockTrip.find.mockReturnValue(populateChain);

      await tripController.getAllTrips(req, res);

      expect(mockTrip.find).toHaveBeenCalledWith({ assignedTo: 'user123' });
    });
  });

  describe('updateTrip - TRAJ-42', () => {
    it('should assign driver to trip', async () => {
      req.params.id = 'trip123';
      req.body = { assignedTo: 'driver456', vehicleRef: null, trailerRef: null };

      await tripController.updateTrip(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('updateStatus - TRAJ-43', () => {
    it('should update trip status', async () => {
      req.params.id = 'trip123';
      req.body = { status: 'in_progress' };
      mockTrip.findByIdAndUpdate.mockResolvedValue({ _id: 'trip123', status: 'in_progress' });

      await tripController.updateStatus(req, res);

      expect(mockTrip.findByIdAndUpdate).toHaveBeenCalledWith(
        'trip123',
        { status: 'in_progress' },
        { new: true }
      );
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('updateMileage - TRAJ-44', () => {
    it('should save KM', async () => {
      req.params.id = 'trip123';
      req.body = { startKm: 1000, endKm: 1250 };
      mockTrip.findByIdAndUpdate.mockResolvedValue({ _id: 'trip123', ...req.body });

      await tripController.updateMileage(req, res);

      expect(mockTrip.findByIdAndUpdate).toHaveBeenCalledWith(
        'trip123',
        { startKm: 1000, endKm: 1250 },
        { new: true }
      );
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('updateFuel - TRAJ-44', () => {
    it('should save fuel', async () => {
      req.params.id = 'trip123';
      req.body = { fuelVolume: 80 };
      mockTrip.findByIdAndUpdate.mockResolvedValue({ _id: 'trip123', fuelVolume: 80 });

      await tripController.updateFuel(req, res);

      expect(mockTrip.findByIdAndUpdate).toHaveBeenCalledWith(
        'trip123',
        { fuelVolume: 80 },
        { new: true }
      );
      expect(res.json).toHaveBeenCalled();
    });
  });
});
