import request from 'supertest';
import express from 'express';
import fuelRoutes from '../../routes/fuelRoutes.js';
import { authenticate, authorize } from '../../middleware/auth.js';

jest.mock('../../middleware/auth.js');

const app = express();
app.use(express.json());
app.use('/api/fuel', fuelRoutes);

describe('Fuel Routes Integration', () => {
  beforeEach(() => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { _id: 'user123', role: 'admin' };
      next();
    });

    authorize.mockImplementation((...roles) => (req, res, next) => {
      if (roles.includes(req.user.role)) {
        next();
      } else {
        res.status(403).json({ message: 'Forbidden' });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/fuel', () => {
    it('should create fuel record', async () => {
      const fuelData = {
        trip: 'trip123',
        vehicle: 'vehicle123',
        driver: 'driver123',
        liters: 50,
        cost: 500,
        station: 'Shell'
      };

      const response = await request(app)
        .post('/api/fuel')
        .send(fuelData);

      expect(response.status).toBe(201);
    });
  });

  describe('GET /api/fuel', () => {
    it('should get all fuel records (admin only)', async () => {
      const response = await request(app)
        .get('/api/fuel');

      expect(response.status).toBe(200);
    });

    it('should deny access for non-admin', async () => {
      authenticate.mockImplementation((req, res, next) => {
        req.user = { _id: 'user123', role: 'chauffeur' };
        next();
      });

      const response = await request(app)
        .get('/api/fuel');

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/fuel/stats', () => {
    it('should get fuel statistics', async () => {
      const response = await request(app)
        .get('/api/fuel/stats')
        .query({ vehicle: 'vehicle123' });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/fuel/trip/:tripId', () => {
    it('should get fuel records by trip', async () => {
      const response = await request(app)
        .get('/api/fuel/trip/trip123');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/fuel/:id', () => {
    it('should get fuel record by id', async () => {
      const response = await request(app)
        .get('/api/fuel/fuel123');

      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/fuel/:id', () => {
    it('should update fuel record (admin only)', async () => {
      const updateData = { liters: 60 };

      const response = await request(app)
        .put('/api/fuel/fuel123')
        .send(updateData);

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/fuel/:id', () => {
    it('should delete fuel record (admin only)', async () => {
      const response = await request(app)
        .delete('/api/fuel/fuel123');

      expect(response.status).toBe(200);
    });
  });
});
