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
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    await minioClient.putObject(BUCKET_NAME, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype
    });
    // Retourner l'URL publique directe (utiliser localhost pour l'accès externe)
    const endpoint = process.env.NODE_ENV === 'production' ? process.env.MINIO_ENDPOINT : 'localhost';
    const publicUrl = `http://${endpoint}:${process.env.MINIO_PORT || 9000}/${BUCKET_NAME}/${fileName}`;
    return publicUrl;
  } catch (error) {
    throw new Error('Erreur lors de l\'upload: ' + error.message);
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
