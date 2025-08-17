import api from './api';

export interface UploadResponse {
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  url: string;
}

export const uploadsApi = {
  uploadPhoto: (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    
    return api.post<UploadResponse>('/uploads/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getPhotoUrl: (filename: string) => {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename; // For backward compatibility
    return `/api/v1/uploads/photos/${filename}`;
  },
};