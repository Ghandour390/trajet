import api from '../api/axios';

/**
 * File helper utilities for upload and download
 */

/**
 * Download a file from the server
 * @param {string} filename - The filename to save as
 * @param {string} url - Optional custom URL (defaults to /reports/download)
 */
export const downloadFile = async (filename, url = '/reports/download') => {
  try {
    const response = await api.get(url, {
      responseType: 'blob',
      params: { filename },
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

/**
 * Download PDF report
 * @param {string} filename - The PDF filename
 */
export const downloadPDF = async (filename) => {
  try {
    // For demo purposes, create a simple PDF placeholder
    // In production, this would call an actual API endpoint
    console.log(`Downloading PDF: ${filename}`);
    
    // Simulate download - replace with actual API call
    const link = document.createElement('a');
    link.href = '#';
    link.download = filename;
    // link.click();
    
    alert(`Le téléchargement de ${filename} sera disponible prochainement.`);
    return true;
  } catch (error) {
    console.error('PDF download error:', error);
    throw error;
  }
};

/**
 * Upload a file to the server
 * @param {File} file - The file to upload
 * @param {string} endpoint - The API endpoint
 * @param {Function} onProgress - Progress callback (optional)
 */
export const uploadFile = async (file, endpoint = '/documents/upload', onProgress = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    // Add progress handler if provided
    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      };
    }

    const response = await api.post(endpoint, formData, config);
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

/**
 * Upload multiple files
 * @param {FileList} files - The files to upload
 * @param {string} endpoint - The API endpoint
 */
export const uploadMultipleFiles = async (files, endpoint = '/documents/upload-multiple') => {
  try {
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

/**
 * Get file extension from filename
 * @param {string} filename - The filename
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate file type
 * @param {File} file - The file to validate
 * @param {Array} allowedTypes - Array of allowed MIME types
 */
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum size in bytes
 */
export const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};
