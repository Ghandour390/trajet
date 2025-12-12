import fuelController from '../../controllers/fuelController.js';
import fuelService from '../../services/fuelService.js';

jest.mock('../../services/fuelService.js');

describe('FuelController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFuelRecord', () => {
    it('should create fuel record successfully', async () => {
      const mockRecord = { _id: '1', liters: 50 };
      req.body = { liters: 50, cost: 500 };

      fuelService.create.mockResolvedValue(mockRecord);

      await fuelController.createFuelRecord(req, res);

      expect(fuelService.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockRecord);
    });

    it('should handle errors', async () => {
      req.body = { liters: 50 };
      fuelService.create.mockRejectedValue(new Error('Validation error'));

      await fuelController.createFuelRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Validation error' });
    });
  });

  describe('getAllFuelRecords', () => {
    it('should return all fuel records', async () => {
      const mockRecords = [{ _id: '1' }, { _id: '2' }];
      req.query = { vehicle: 'vehicle123' };

      fuelService.findAll.mockResolvedValue(mockRecords);

      await fuelController.getAllFuelRecords(req, res);

      expect(fuelService.findAll).toHaveBeenCalledWith(req.query);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRecords);
    });
  });

  describe('getFuelRecordById', () => {
    it('should return fuel record by id', async () => {
      const mockRecord = { _id: '1', liters: 50 };
      req.params.id = '1';

      fuelService.findById.mockResolvedValue(mockRecord);

      await fuelController.getFuelRecordById(req, res);

      expect(fuelService.findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRecord);
    });

    it('should return 404 if not found', async () => {
      req.params.id = '1';
      fuelService.findById.mockResolvedValue(null);

      await fuelController.getFuelRecordById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Enregistrement non trouvé' });
    });
  });

  describe('getFuelByTrip', () => {
    it('should return fuel records by trip', async () => {
      const mockRecords = [{ _id: '1' }];
      req.params.tripId = 'trip123';

      fuelService.findByTrip.mockResolvedValue(mockRecords);

      await fuelController.getFuelByTrip(req, res);

      expect(fuelService.findByTrip).toHaveBeenCalledWith('trip123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRecords);
    });
  });

  describe('updateFuelRecord', () => {
    it('should update fuel record', async () => {
      const mockRecord = { _id: '1', liters: 60 };
      req.params.id = '1';
      req.body = { liters: 60 };

      fuelService.update.mockResolvedValue(mockRecord);

      await fuelController.updateFuelRecord(req, res);

      expect(fuelService.update).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRecord);
    });

    it('should return 404 if not found', async () => {
      req.params.id = '1';
      req.body = { liters: 60 };
      fuelService.update.mockResolvedValue(null);

      await fuelController.updateFuelRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteFuelRecord', () => {
    it('should delete fuel record', async () => {
      const mockRecord = { _id: '1' };
      req.params.id = '1';

      fuelService.delete.mockResolvedValue(mockRecord);

      await fuelController.deleteFuelRecord(req, res);

      expect(fuelService.delete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Enregistrement supprimé' });
    });
  });

  describe('getFuelStats', () => {
    it('should return fuel statistics', async () => {
      const mockStats = { totalLiters: 100, totalCost: 1000 };
      req.query = { vehicle: 'vehicle123' };

      fuelService.getStats.mockResolvedValue(mockStats);

      await fuelController.getFuelStats(req, res);

      expect(fuelService.getStats).toHaveBeenCalledWith(req.query);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStats);
    });
  });

  describe('getConsumptionByVehicle', () => {
    it('should return consumption by vehicle', async () => {
      const mockConsumption = [{ totalLiters: 100 }];
      req.params.vehicleId = 'vehicle123';
      req.query = { startDate: '2024-01-01' };

      fuelService.getConsumptionByVehicle.mockResolvedValue(mockConsumption);

      await fuelController.getConsumptionByVehicle(req, res);

      expect(fuelService.getConsumptionByVehicle).toHaveBeenCalledWith(
        'vehicle123',
        '2024-01-01',
        undefined
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockConsumption);
    });
  });
});
