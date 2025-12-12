import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';

const mockAuthController = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  refreshToken: jest.fn(),
  my: jest.fn(),
  changePassword: jest.fn()
};

jest.unstable_mockModule('../../controllers/authController.js', () => ({
  default: mockAuthController
}));

const { default: authRoutes } = await import('../../routes/authRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe.skip('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should call authController.register', async () => {
      mockAuthController.register.mockImplementation((req, res) => {
        res.status(201).json({ id: '123', email: 'test@test.com' });
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com', password: 'password123' });

      expect(mockAuthController.register).toHaveBeenCalled();
      expect(response.status).toBe(201);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should call authController.login', async () => {
      mockAuthController.login.mockImplementation((req, res) => {
        res.status(200).json({ accessToken: 'token', refreshToken: 'refresh' });
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'password123' });

      expect(mockAuthController.login).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should call authController.logout', async () => {
      mockAuthController.logout.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Logged out' });
      });

      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken: 'token' });

      expect(mockAuthController.logout).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });
});
