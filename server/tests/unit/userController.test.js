import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockUserService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAvailableChauffeurs: jest.fn()
};

jest.unstable_mockModule('../../services/userService.js', () => ({
  default: mockUserService
}));

jest.unstable_mockModule('../../config/minio.js', () => ({
  uploadToMinio: jest.fn()
}));

const { default: userController } = await import('../../controllers/userController.js');

describe('UserController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, file: null, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getAllUsers', () => {
    it('should get all users', async () => {
      mockUserService.findAll.mockResolvedValue([{ _id: '1' }]);

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should get user by id', async () => {
      req.params.id = '123';
      mockUserService.findById.mockResolvedValue({ _id: '123' });

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if not found', async () => {
      req.params.id = '123';
      mockUserService.findById.mockResolvedValue(null);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      req.params.id = '123';
      req.body = { firstname: 'John' };
      mockUserService.update.mockResolvedValue({ _id: '123' });

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      req.params.id = '123';
      mockUserService.delete.mockResolvedValue({ _id: '123' });

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getAvailableChauffeurs', () => {
    it('should get available chauffeurs', async () => {
      req.query = { startAt: '2024-01-01' };
      mockUserService.findAvailableChauffeurs.mockResolvedValue([{ _id: '1' }]);

      await userController.getAvailableChauffeurs(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 if startAt missing', async () => {
      req.query = {};

      await userController.getAvailableChauffeurs(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
