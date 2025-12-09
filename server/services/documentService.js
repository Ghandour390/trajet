import Document from '../models/Document.js';
import { minioClient, BUCKET_NAME } from '../config/minio.js';

class DocumentService {
  async create(fileData, uploadedBy) {
    const { filename, originalName, mimeType, size, buffer, relatedTo, relatedId, description } = fileData;
    
    await minioClient.putObject(
      BUCKET_NAME,
      filename,
      buffer,
      size,
      { 'Content-Type': mimeType }
    );

    return await Document.create({
      filename,
      originalName,
      mimeType,
      size,
      path: `${BUCKET_NAME}/${filename}`,
      uploadedBy,
      relatedTo,
      relatedId,
      description
    });
  }

  async findAll(filter = {}) {
    return await Document.find(filter)
      .populate('uploadedBy', 'firstname lastname')
      .sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Document.findById(id);
  }

  async delete(id) {
    const document = await Document.findById(id);
    if (!document) {
      return null;
    }

    await minioClient.removeObject(BUCKET_NAME, document.filename);
    await document.deleteOne();
    return document;
  }

  async getFileStream(filename) {
    return await minioClient.getObject(BUCKET_NAME, filename);
  }
}

export default new DocumentService();
