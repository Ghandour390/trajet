import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Trip from '../../models/Trip.js';
import User from '../../models/User.js';
import Vehicle from '../../models/Vehicle.js';
import tripRoutes from '../../routes/tripRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/trips', tripRoutes);

let adminToken, chauffeurToken, adminUser, chauffeurUser, testVehicle;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test_db');
  
  adminUser = await User.create({
    firstname: 'Admin',
    lastname: 'Test',
    email: 'admin@test.com',
    passwordHash: 'hash',
    role: 'admin'
  });

  chauffeurUser = await User.create({
    firstname: 'Chauffeur',
    lastname: 'Test',
    email: 'chauffeur@test.com',
    passwordHash: 'hash',
    role: 'chauffeur'
  });

  adminToken = jwt.sign({ id: adminUser._id, role: 'admin' }, process.env.JWT_SECRET || 'test_secret');
  chauffeurToken = jwt.sign({ id: chauffeurUser._id, role: 'chauffeur' }, process.env.JWT_SECRET || 'test_secret');

  testVehicle = await Vehicle.create({
    plateNumber: 'TEST-123',
    type: 'Camion',
    brand: 'Test',
    year: 2020,
    currentKm: 1000
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await Trip.deleteMany({});
  await Vehicle.deleteMany({});
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Trip.deleteMany({});
});

describe('Trip Integration Tests', () => {
  describe('POST /api/trips - TRAJ-41', () => {
    it('should create a trip as admin', async () => {
      const tripData = {
        reference: 'TRIP001',
        origin: 'Casablanca',
        destination: 'Marrakech',
        assignedTo: chauffeurUser._id,
        vehicleRef: testVehicle._id,
        startKm: 1000
      };

      const response = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(tripData);

      expect(response.status).toBe(201);
      expect(response.body.origin).toBe('Casablanca');
      expect(response.body.destination).toBe('Marrakech');
    });

    it('should reject trip creation by chauffeur', async () => {
      const response = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${chauffeurToken}`)
        .send({ origin: 'Test' });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/trips', () => {
    it('should return all trips for admin', async () => {
      await Trip.create([
        { reference: 'T1', origin: 'A', destination: 'B', assignedTo: chauffeurUser._id, vehicleRef: testVehicle._id, startKm: 1000 },
        { reference: 'T2', origin: 'C', destination: 'D', assignedTo: chauffeurUser._id, vehicleRef: testVehicle._id, startKm: 1000 }
      ]);

      const response = await request(app)
        .get('/api/trips')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    it('should return only assigned trips for chauffeur', async () => {
      const otherUser = await User.create({
        firstname: 'Other',
        lastname: 'User',
        email: 'other@test.com',
        passwordHash: 'hash',
        role: 'chauffeur'
      });

      await Trip.create([
        { reference: 'T1', origin: 'A', destination: 'B', assignedTo: chauffeurUser._id, vehicleRef: testVehicle._id, startKm: 1000 },
        { reference: 'T2', origin: 'C', destination: 'D', assignedTo: otherUser._id, vehicleRef: testVehicle._id, startKm: 1000 }
      ]);

      const response = await request(app)
        .get('/api/trips')
        .set('Authorization', `Bearer ${chauffeurToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].reference).toBe('T1');
    });
  });

  describe('PATCH /api/trips/:id - TRAJ-42', () => {
    it('should assign driver to trip', async () => {
      const trip = await Trip.create({
        reference: 'TRIP001',
        origin: 'Casablanca',
        destination: 'Marrakech',
        assignedTo: chauffeurUser._id,
        vehicleRef: testVehicle._id,
        startKm: 1000
      });

      const response = await request(app)
        .patch(`/api/trips/${trip._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ assignedTo: chauffeurUser._id });

      expect(response.status).toBe(200);
      expect(response.body.assignedTo).toBeDefined();
    });
  });

  describe('PATCH /api/trips/:id/status - TRAJ-43', () => {
    it('should update trip status', async () => {
      const trip = await Trip.create({
        reference: 'TRIP001',
        origin: 'Casablanca',
        destination: 'Marrakech',
        assignedTo: chauffeurUser._id,
        vehicleRef: testVehicle._id,
        startKm: 1000,
        status: 'planned'
      });

      const response = await request(app)
        .patch(`/api/trips/${trip._id}/status`)
        .set('Authorization', `Bearer ${chauffeurToken}`)
        .send({ status: 'in_progress' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('in_progress');
    });
  });

  describe('PATCH /api/trips/:id/mileage - TRAJ-44', () => {
    it('should save KM', async () => {
      const trip = await Trip.create({
        reference: 'TRIP001',
        origin: 'Casablanca',
        destination: 'Marrakech',
        assignedTo: chauffeurUser._id,
        vehicleRef: testVehicle._id,
        startKm: 1000
      });

      const response = await request(app)
        .patch(`/api/trips/${trip._id}/mileage`)
        .set('Authorization', `Bearer ${chauffeurToken}`)
        .send({ startKm: 1000, endKm: 1250 });

      expect(response.status).toBe(200);
      expect(response.body.startKm).toBe(1000);
      expect(response.body.endKm).toBe(1250);
    });
  });

  describe('PATCH /api/trips/:id/fuel - TRAJ-44', () => {
    it('should save fuel', async () => {
      const trip = await Trip.create({
        reference: 'TRIP001',
        origin: 'Casablanca',
        destination: 'Marrakech',
        assignedTo: chauffeurUser._id,
        vehicleRef: testVehicle._id,
        startKm: 1000
      });

      const response = await request(app)
        .patch(`/api/trips/${trip._id}/fuel`)
        .set('Authorization', `Bearer ${chauffeurToken}`)
        .send({ fuelVolume: 80 });

      expect(response.status).toBe(200);
      expect(response.body.fuelVolume).toBe(80);
    });
  });
});
