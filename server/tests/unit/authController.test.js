import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn()
};

jest.unstable_mockModule('../../services/authService.js', () => ({
  default: mockAuthService
}));

const { default: AuthController } = await import('../../controllers/authController.js');

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 200 with tokens on successful login', async () => {
      const mockResponse = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: { id: 'userId', email: 'test@test.com' }
      };

      req.body = { email: 'test@test.com', password: 'password123' };
      mockAuthService.login.mockResolvedValue(mockResponse);

      await AuthController.login(req, res);

      expect(mockAuthService.login).toHaveBeenCalledWith('test@test.com', 'password123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'accessToken',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: { id: 'userId', email: 'test@test.com' }
      });
    });

    it('should return 401 on invalid credentials', async () => {
      req.body = { email: 'test@test.com', password: 'wrongPassword' };
      mockAuthService.login.mockRejectedValue(new Error('Invalid email or password'));

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid email or password' });
    });
  });

  describe('register', () => {
    it('should return 201 with user on successful registration', async () => {
      const mockUser = { id: 'userId', email: 'test@test.com' };
      req.body = { email: 'test@test.com', password: 'password123' };
      mockAuthService.register.mockResolvedValue(mockUser);

      await AuthController.register(req, res);

      expect(mockAuthService.register).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, user: mockUser });
    });

    it('should return 400 on registration error', async () => {
      req.body = { email: 'test@test.com' };
      mockAuthService.register.mockRejectedValue(new Error('Validation error'));

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Validation error' });
    });
  });

  describe('logout', () => {
    it('should return 200 on successful logout', async () => {
      req.body = { refreshToken: 'refreshToken' };
      mockAuthService.logout.mockResolvedValue({ message: 'Logged out' });

      await AuthController.logout(req, res);

      expect(mockAuthService.logout).toHaveBeenCalledWith('refreshToken');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logged out' });
    });

    it('should return 400 on logout error', async () => {
      req.body = { refreshToken: 'invalidToken' };
      mockAuthService.logout.mockRejectedValue(new Error('Invalid token'));

      await AuthController.logout(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    });
  });
});
