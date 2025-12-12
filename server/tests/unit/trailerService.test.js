import { jest } from '@jest/globals';
import trailerService from '../../services/trailerService.js';
import Trailer from '../../models/Trailer.js';
import Tire from '../../models/Tire.js';
import Trip from '../../models/Trip.js';

describe('TrailerService', () => {
  beforeAll(() => {
    Trailer.findOne = jest.fn();
    Trailer.create = jest.fn();
    Trailer.find = jest.fn();
    Trailer.findById = jest.fn();
    Trailer.findByIdAndUpdate = jest.fn();
    Trailer.findByIdAndDelete = jest.fn();
    Tire.create = jest.fn();
    Trip.find = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create trailer with tires', async () => {
      const trailerData = {
        plateNumber: 'R-12345-B',
        type: 'Remorque frigorifique',
        currentKm: 0
      };

      Trailer.findOne.mockResolvedValue(null);
      Trailer.create.mockResolvedValue({
        ...trailerData,
        _id: 'trailer123',
        tires: [],
        save: jest.fn()
      });

      Tire.create.mockResolvedValue({ _id: 'tire123' });

      const result = await trailerService.create(trailerData);

      expect(Trailer.findOne).toHaveBeenCalledWith({ plateNumber: 'R-12345-B' });
      expect(Trailer.create).toHaveBeenCalledWith(trailerData);
      expect(Tire.create).toHaveBeenCalledTimes(4); // 4 tires for trailer
    });

    it('should throw error if trailer exists', async () => {
      const trailerData = { plateNumber: 'R-12345-B' };

      Trailer.findOne.mockResolvedValue({ plateNumber: 'R-12345-B' });

      await expect(trailerService.create(trailerData)).rejects.toThrow(
        'La remorque avec la plaque R-12345-B existe déjà'
      );
    });
  });

  describe('findAll', () => {
    it('should return all trailers with populated attachedTo', async () => {
      const mockTrailers = [{ _id: '1' }];

      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mockTrailers)
      };

      Trailer.find.mockReturnValue(mockQuery);

      const result = await trailerService.findAll();

      expect(Trailer.find).toHaveBeenCalled();
      expect(mockQuery.populate).toHaveBeenCalledWith('attachedTo', 'plateNumber');
      expect(result).toEqual(mockTrailers);
    });
  });

  describe('findById', () => {
    it('should return trailer by id', async () => {
      const mockTrailer = { _id: '1', plateNumber: 'R-12345-B' };

      const mockQuery = {
        populate: jest.fn().mockResolvedValue(mockTrailer)
      };

      Trailer.findById.mockReturnValue(mockQuery);

      const result = await trailerService.findById('1');

      expect(Trailer.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockTrailer);
    });
  });

  describe('update', () => {
    it('should update trailer', async () => {
      const updateData = { currentKm: 5000 };
      const mockTrailer = { _id: '1', currentKm: 5000 };

      Trailer.findByIdAndUpdate.mockResolvedValue(mockTrailer);

      const result = await trailerService.update('1', updateData);

      expect(Trailer.findByIdAndUpdate).toHaveBeenCalledWith('1', updateData, { new: true });
      expect(result).toEqual(mockTrailer);
    });
  });

  describe('delete', () => {
    it('should delete trailer', async () => {
      const mockTrailer = { _id: '1' };

      Trailer.findByIdAndDelete.mockResolvedValue(mockTrailer);

      const result = await trailerService.delete('1');

      expect(Trailer.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockTrailer);
    });
  });

  describe('findAvailableTrailers', () => {
    it('should return available trailers for date range', async () => {
      const startAt = '2024-01-15T08:00:00';
      const endAt = '2024-01-15T18:00:00';

      const mockQuery = {
        distinct: jest.fn().mockResolvedValue(['trailer1', 'trailer2'])
      };

      Trip.find.mockReturnValue(mockQuery);
      Trailer.find.mockResolvedValue([{ _id: 'trailer3' }]);

      const result = await trailerService.findAvailableTrailers(startAt, endAt);

      expect(Trip.find).toHaveBeenCalledWith({
        $or: [
          { startAt: { $lte: new Date(endAt) }, endAt: { $gte: new Date(startAt) } },
          { startAt: { $gte: new Date(startAt), $lte: new Date(endAt) } }
        ],
        status: { $in: ['planned', 'in_progress'] }
      });

      expect(Trailer.find).toHaveBeenCalledWith({
        _id: { $nin: ['trailer1', 'trailer2'] }
      });

      expect(result).toEqual([{ _id: 'trailer3' }]);
    });
  });
});
