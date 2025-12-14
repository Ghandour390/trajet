import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockDocument = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn()
};

const mockMinioClient = {
  putObject: jest.fn(),
  removeObject: jest.fn()
};

jest.unstable_mockModule('../../models/Document.js', () => ({
  default: mockDocument
}));

jest.unstable_mockModule('../../config/minio.js', () => ({
  minioClient: mockMinioClient,
  BUCKET_NAME: 'test-bucket'
}));

const { default: documentService } = await import('../../services/documentService.js');

describe('DocumentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a document', async () => {
      const fileData = { 
        filename: 'test.pdf', 
        originalName: 'test.pdf',
        mimeType: 'application/pdf',
        size: 1000,
        buffer: Buffer.from('test'),
        relatedTo: 'trip',
        relatedId: '123'
      };
      mockMinioClient.putObject.mockResolvedValue({});
      mockDocument.create.mockResolvedValue({ _id: '1', filename: 'test.pdf' });

      const result = await documentService.create(fileData, 'user123');

      expect(mockMinioClient.putObject).toHaveBeenCalled();
      expect(mockDocument.create).toHaveBeenCalled();
      expect(result).toHaveProperty('_id');
    });
  });

  describe('findAll', () => {
    it('should find all documents', async () => {
      const docs = [{ _id: '1' }, { _id: '2' }];
      mockDocument.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(docs)
        })
      });

      const result = await documentService.findAll();

      expect(result).toEqual(docs);
    });
  });

  describe('findById', () => {
    it.skip('should find document by id', async () => {
      const doc = { _id: '123', type: 'invoice' };
      const populateMock = jest.fn().mockResolvedValue(doc);
      mockDocument.findById.mockReturnValue({
        populate: populateMock
      });

      const result = await documentService.findById('123');

      expect(populateMock).toHaveBeenCalled();
      expect(result).toEqual(doc);
    });
  });

  describe('delete', () => {
    it('should delete document', async () => {
      const deleted = { _id: '123', filename: 'test.pdf', deleteOne: jest.fn() };
      mockDocument.findById.mockResolvedValue(deleted);
      mockMinioClient.removeObject.mockResolvedValue({});

      const result = await documentService.delete('123');

      expect(mockMinioClient.removeObject).toHaveBeenCalled();
      expect(result).toEqual(deleted);
    });
  });
});
