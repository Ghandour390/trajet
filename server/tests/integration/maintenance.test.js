import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import maintenanceRoutes from '../../routes/maintenanceRoutes.js';
import Maintenance from '../../models/Maintenance.js';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/maintenance', maintenanceRoutes);

const adminToken = jwt.sign({ id: 'admin123', role: 'admin' }, process.env.JWT_SECRET);

describe('Maintenance Integration Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Maintenance.deleteMany({});
  });

  describe('POST /api/maintenance', () => {
    it('should create a maintenance', async () => {
      const data = {
        vehicleRef: new mongoose.Types.ObjectId(),
        type: 'Oil change',
        date: new Date(),
        km: 10000,
        cost: 500
      };

      const response = await request(app)
        .post('/api/maintenance')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(data)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.type).toBe('Oil change');
    });

    it('should return 401 without token', async () => {
      await request(app)
        .post('/api/maintenance')
        .send({})
        .expect(401);
    });
  });

  describe('GET /api/maintenance/:id', () => {
    it('should return 404 for invalid id', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/maintenance/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('PATCH /api/maintenance/:id', () => {
    it('should update maintenance', async () => {
      const maintenance = await Maintenance.create({
        vehicleRef: new mongoose.Types.ObjectId(),
        type: 'Oil change',
        date: new Date(),
        km: 10000
      });

      const response = await request(app)
        .patch(`/api/maintenance/${maintenance._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ type: 'Tire change' })
        .expect(200);

      expect(response.body.type).toBe('Tire change');
    });
  });

  describe('DELETE /api/maintenance/:id', () => {
    it('should delete maintenance', async () => {
      const maintenance = await Maintenance.create({
        vehicleRef: new mongoose.Types.ObjectId(),
        type: 'Oil change',
        date: new Date(),
        km: 10000
      });

      await request(app)
        .delete(`/api/maintenance/${maintenance._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const found = await Maintenance.findById(maintenance._id);
      expect(found).toBeNull();
    });
  });
});
