import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockJwt = {
  verify: jest.fn()
};

jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));

const { authenticate, authorize } = await import('../../middleware/auth.js');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate with valid token', () => {
      req.headers.authorization = 'Bearer validtoken';
      mockJwt.verify.mockReturnValue({ id: 'userId', role: 'admin' });

      authenticate(req, res, next);

      expect(mockJwt.verify).toHaveBeenCalledWith('validtoken', process.env.JWT_SECRET);
      expect(req.user).toEqual({ id: 'userId', role: 'admin' });
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if no token provided', () => {
      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
      req.headers.authorization = 'Bearer invalidtoken';
      mockJwt.verify.mockImplementation(() => { throw new Error('Invalid'); });

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    it('should authorize user with correct role', () => {
      req.user = { id: 'userId', role: 'admin' };
      const middleware = authorize('admin', 'chauffeur');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user has wrong role', () => {
      req.user = { id: 'userId', role: 'chauffeur' };
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user not authenticated', () => {
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
