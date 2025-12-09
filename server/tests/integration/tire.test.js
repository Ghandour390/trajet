import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Tire from '../../models/Tire.js';
import Vehicle from '../../models/Vehicle.js';
import User from '../../models/User.js';
import tireRoutes from '../../routes/tireRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/tires', tireRoutes);

let adminToken, adminUser, testVehicle;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test_db');
  
  adminUser = await User.create({
    firstname: 'Admin',
    lastname: 'Test',
    email: 'admin-tire@test.com',
    passwordHash: 'hash',
    role: 'admin'
  });

  testVehicle = await Vehicle.create({
    plateNumber: 'TIRE-TEST',
    type: 'Camion',
    brand: 'Test',
    year: 2020,
    currentKm: 1000
  });

  adminToken = jwt.sign({ id: adminUser._id, role: 'admin' }, process.env.JWT_SECRET || 'test_secret');
});

afterAll(async () => {
  await User.deleteMany({});
  await Tire.deleteMany({});
  await Vehicle.deleteMany({});
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Tire.deleteMany({});
});

describe('Tire Integration Tests', () => {
  describe('POST /api/tires - TRAJ-46', () => {
    it('should create a tire', async () => {
      const tireData = {
        serial: 'TIRE001',
        position: 'Front Left',
        wearPercent: 20,
        nextCheckKm: 50000
      };

      const response = await request(app)
        .post('/api/tires')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(tireData);

      expect(response.status).toBe(201);
      expect(response.body.serial).toBe('TIRE001');
      expect(response.body.position).toBe('Front Left');
    });
  });

  describe('GET /api/tires', () => {
    it('should return all tires', async () => {
      await Tire.create([
        { serial: 'T1', position: 'Front Left', nextCheckKm: 50000 },
        { serial: 'T2', position: 'Front Right', nextCheckKm: 50000 }
      ]);

      const response = await request(app)
        .get('/api/tires')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe('PATCH /api/tires/:id', () => {
    it('should update tire', async () => {
      const tire = await Tire.create({
        serial: 'TIRE001',
        position: 'Front Left',
        wearPercent: 20,
        nextCheckKm: 50000
      });

      const response = await request(app)
        .patch(`/api/tires/${tire._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ wearPercent: 50 });

      expect(response.status).toBe(200);
      expect(response.body.wearPercent).toBe(50);
    });
  });

  describe('POST /api/tires/:id/link - TRAJ-48', () => {
    it('should link tire to vehicle', async () => {
      const tire = await Tire.create({
        serial: 'TIRE001',
        position: 'Front Left',
        nextCheckKm: 50000
      });

      const response = await request(app)
        .post(`/api/tires/${tire._id}/link`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ vehicleId: testVehicle._id });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Tire linked to vehicle');

      const updatedVehicle = await Vehicle.findById(testVehicle._id);
      expect(updatedVehicle.tires).toContainEqual(tire._id);
    });
  });

  describe('DELETE /api/tires/:id', () => {
    it('should delete tire', async () => {
      const tire = await Tire.create({
        serial: 'TIRE001',
        position: 'Front Left',
        nextCheckKm: 50000
      });

      const response = await request(app)
        .delete(`/api/tires/${tire._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Tire deleted');

      const deletedTire = await Tire.findById(tire._id);
      expect(deletedTire).toBeNull();
    });
  });
});
