import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockTrailerService = {
  create: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

jest.unstable_mockModule('../../services/trailerService.js', () => ({
  default: mockTrailerService
}));

const { default: trailerController } = await import('../../controllers/trailerController.js');

describe('TrailerController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createTrailer', () => {
    it('should create trailer successfully', async () => {
      req.body = { plateNumber: 'R-123-B', type: 'Remorque' };
      mockTrailerService.create.mockResolvedValue({ _id: '1', plateNumber: 'R-123-B' });

      await trailerController.createTrailer(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockTrailerService.create.mockRejectedValue(new Error('Error'));

      await trailerController.createTrailer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getAllTrailers', () => {
    it('should get all trailers', async () => {
      mockTrailerService.findAll.mockResolvedValue([{ _id: '1' }]);

      await trailerController.getAllTrailers(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('updateTrailer', () => {
    it('should update trailer', async () => {
      req.params.id = '123';
      req.body = { plateNumber: 'R-456-B' };
      mockTrailerService.update.mockResolvedValue({ _id: '123' });

      await trailerController.updateTrailer(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('deleteTrailer', () => {
    it('should delete trailer', async () => {
      req.params.id = '123';
      mockTrailerService.delete.mockResolvedValue({ _id: '123' });

      await trailerController.deleteTrailer(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });
});
