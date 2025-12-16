import multer from 'multer';

// Configuration multer avec validation
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('FORMAT_INVALIDE'), false);
  }
  
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Middleware de gestion d'erreurs multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false,
        message: 'L\'image est trop volumineuse (max 5MB)' 
      });
    }
    return res.status(400).json({ 
      success: false,
      message: 'Erreur lors de l\'upload: ' + err.message 
    });
  }
  
  if (err && err.message === 'FORMAT_INVALIDE') {
    return res.status(400).json({ 
      success: false,
      message: 'Format d\'image non supporté. Utilisez JPG, PNG ou WEBP' 
    });
  }
  
  next(err);
};

export default upload;
