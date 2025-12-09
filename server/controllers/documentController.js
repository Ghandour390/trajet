import Document from '../models/Document.js';
import multer from 'multer';
import path from 'path';
import { minioClient, BUCKET_NAME } from '../config/minio.js';

// Configuration multer pour upload en mémoire
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Type de fichier non autorisé'));
  }
});

// Upload document
export const uploadDocument = async (req, res) => {
  try {
    const { relatedTo, relatedId, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    // Générer nom unique
    const filename = `${Date.now()}-${req.file.originalname}`;
    
    // Upload vers MinIO
    await minioClient.putObject(
      BUCKET_NAME,
      filename,
      req.file.buffer,
      req.file.size,
      { 'Content-Type': req.file.mimetype }
    );

    const document = await Document.create({
      filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: `${BUCKET_NAME}/${filename}`,
      uploadedBy: req.user.id,
      relatedTo,
      relatedId,
      description
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get documents
export const getDocuments = async (req, res) => {
  try {
    const { relatedTo, relatedId } = req.query;
    const filter = {};
    
    if (relatedTo) filter.relatedTo = relatedTo;
    if (relatedId) filter.relatedId = relatedId;

    const documents = await Document.find(filter)
      .populate('uploadedBy', 'firstname lastname')
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    // Supprimer de MinIO
    await minioClient.removeObject(BUCKET_NAME, document.filename);

    await document.deleteOne();
    res.json({ message: 'Document supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download document
export const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    // Télécharger depuis MinIO
    const dataStream = await minioClient.getObject(BUCKET_NAME, document.filename);
    
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    
    dataStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
