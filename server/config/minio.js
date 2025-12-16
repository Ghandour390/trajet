import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

const BUCKET_NAME = 'trajet-documents';

// Créer le bucket et le rendre public
const initBucket = async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`Bucket ${BUCKET_NAME} créé`);
    }
    
    // Rendre le bucket public
    const policy = {
      Version: '2012-10-17',
      Statement: [{
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
      }]
    };
    
    await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    console.log(`Bucket ${BUCKET_NAME} configuré en mode public`);
    
  } catch (error) {
    console.warn('Erreur MinIO:', error.message);
  }
};

initBucket();

export const uploadToMinio = async (file, folder = '') => {
  try {
    // Validation du fichier
    if (!file || !file.buffer) {
      throw new Error('Fichier invalide ou corrompu');
    }

    // Vérifier la connexion MinIO
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
      throw new Error('Service de stockage non disponible');
    }

    const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    
    await minioClient.putObject(BUCKET_NAME, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype
    });
    
    // Utiliser MINIO_PUBLIC_URL si défini, sinon localhost pour développement
    const publicUrl = process.env.MINIO_PUBLIC_URL 
      ? `${process.env.MINIO_PUBLIC_URL}/${BUCKET_NAME}/${fileName}`
      : `http://localhost:${process.env.MINIO_PORT || 9000}/${BUCKET_NAME}/${fileName}`;
    
    return publicUrl;
  } catch (error) {
    console.error('Erreur MinIO upload:', error);
    throw new Error('Erreur MinIO: ' + error.message);
  }
};

// Générer une URL présignée pour accéder au fichier
export const getPresignedUrl = async (fileName, expiry = 24 * 60 * 60) => {
  try {
    const url = await minioClient.presignedGetObject(BUCKET_NAME, fileName, expiry);
    return url;
  } catch (error) {
    throw new Error('Erreur lors de la génération de l\'URL: ' + error.message);
  }
};

export { minioClient, BUCKET_NAME };
