import React, { useState } from 'react';
import { CameraIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import SimpleCameraCapture from './SimpleCameraCapture';
import { uploadsApi } from '../../services/uploads';

interface PhotoCaptureProps {
  currentPhoto?: string;
  onPhotoChange: (filename: string) => void;
  userName?: string;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ currentPhoto, onPhotoChange, userName }) => {
  const [showCamera, setShowCamera] = useState(false);

  const handlePhotoSaved = (filename: string) => {
    onPhotoChange(filename);
    setShowCamera(false);
  };

  const handleRemovePhoto = () => {
    onPhotoChange('');
    toast.success('Foto eliminada');
  };

  const getPhotoUrl = (filename: string) => {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename;
    return `/api/v1/uploads/photos/${filename}`;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
      
      {/* Current Photo Display */}
      <div className="flex items-center space-x-4">
        {currentPhoto ? (
          <div className="relative">
            <img
              src={getPhotoUrl(currentPhoto)}
              alt={userName || 'Usuario'}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
            <PhotoIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}

        {/* Action Button */}
        <div className="flex-1">
          <button
            type="button"
            onClick={() => setShowCamera(true)}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <CameraIcon className="w-4 h-4 mr-2" />
            {currentPhoto ? 'Cambiar Foto' : 'Tomar Foto'}
          </button>
          
          {currentPhoto && (
            <p className="text-xs text-gray-500 mt-1">
              Haz clic en "Cambiar Foto" para capturar una nueva imagen
            </p>
          )}
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <SimpleCameraCapture
          onPhotoSaved={handlePhotoSaved}
          onCancel={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default PhotoCapture;