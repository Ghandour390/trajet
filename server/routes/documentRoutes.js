import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
  uploadDocument, 
  getDocuments, 
  deleteDocument, 
  downloadDocument,
  upload 
} from '../controllers/documentController.js';

const router = express.Router();

router.post('/', authenticate, upload.single('file'), uploadDocument);
router.get('/', authenticate, getDocuments);
router.get('/:id/download', authenticate, downloadDocument);
router.delete('/:id', authenticate, deleteDocument);

export default router;
