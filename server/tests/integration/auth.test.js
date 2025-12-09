import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import authRoutes from '../../routes/authRoutes.js';
import User from '../../models/User.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@test.com',
        password: 'password123',
        phone: '0612345678'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.email).toBe('john@test.com');
      expect(response.body.role).toBe('chauffeur');
      expect(response.body).not.toHaveProperty('passwordHash');
    });

    it('should return 400 for duplicate email', async () => {
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@test.com',
        password: 'password123'
      };

      await request(app).post('/api/auth/register').send(userData);
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@test.com',
        password: 'password123'
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@test.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('email', 'john@test.com');
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@test.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@test.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout with valid refreshToken', async () => {
      await request(app).post('/api/auth/register').send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@test.com',
        password: 'password123'
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@test.com',
          password: 'password123'
        });

      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken: loginResponse.body.refreshToken })
        .expect(200);

      expect(response.body.message).toBe('Logged out successfully');
    });

    it('should return 400 for invalid refreshToken', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken: 'invalid_token' })
        .expect(400);

      expect(response.body.message).toBe('Invalid refresh token');
    });
  });
});
