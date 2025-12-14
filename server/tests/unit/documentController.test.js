import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockDocumentService = {
  create: jest.fn(),
  findAll: jest.fn(),
  delete: jest.fn()
};

jest.unstable_mockModule('../../services/documentService.js', () => ({
  default: mockDocumentService
}));

const { uploadDocument, getDocuments, deleteDocument } = await import('../../controllers/documentController.js');

describe('DocumentController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, file: null, query: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('uploadDocument', () => {
    it('should upload document successfully', async () => {
      req.body = { relatedTo: 'trip', relatedId: '123' };
      req.file = { originalname: 'test.pdf', mimetype: 'application/pdf', size: 1000, buffer: Buffer.from('test') };
      req.user = { id: 'user123' };
      mockDocumentService.create.mockResolvedValue({ _id: '1' });

      await uploadDocument(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 400 if no file', async () => {
      req.body = { relatedTo: 'trip' };

      await uploadDocument(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getDocuments', () => {
    it('should get all documents', async () => {
      req.query = {};
      mockDocumentService.findAll.mockResolvedValue([{ _id: '1' }]);

      await getDocuments(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('deleteDocument', () => {
    it('should delete document', async () => {
      req.params.id = '123';
      mockDocumentService.delete.mockResolvedValue({ _id: '123' });

      await deleteDocument(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });
});
