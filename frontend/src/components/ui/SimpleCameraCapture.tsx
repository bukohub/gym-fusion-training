import React, { useRef, useState, useEffect } from 'react';
import { CameraIcon, XMarkIcon, CheckIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { uploadsApi } from '../../services/uploads';

interface SimpleCameraCaptureProps {
  onPhotoSaved: (filename: string) => void;
  onCancel: () => void;
}

const SimpleCameraCapture: React.FC<SimpleCameraCaptureProps> = ({ onPhotoSaved, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  // Initialize camera when component mounts
  useEffect(() => {
    initializeCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
      }
      
      setStream(mediaStream);
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('No se pudo acceder a la cámara');
      onCancel();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to data URL for preview
    const dataURL = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedPhoto(dataURL);

    // Stop camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const savePhoto = async () => {
    if (!canvasRef.current || !capturedPhoto) return;

    try {
      setIsUploading(true);

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', 0.8);
      });

      // Create file from blob
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });

      // Upload to server
      const response = await uploadsApi.uploadPhoto(file);
      
      toast.success('Foto guardada exitosamente');
      onPhotoSaved(response.data.filename);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error al guardar la foto');
    } finally {
      setIsUploading(false);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    initializeCamera();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {capturedPhoto ? 'Confirmar Foto' : 'Tomar Foto'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Camera/Photo Display */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-6">
          {!capturedPhoto ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-80 object-cover"
              />
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p>Iniciando cámara...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <img
              src={capturedPhoto}
              alt="Foto capturada"
              className="w-full h-80 object-cover"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {!capturedPhoto ? (
            <>
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
              >
                <XMarkIcon className="w-5 h-5 mr-2" />
                Cancelar
              </button>
              <button
                onClick={capturePhoto}
                disabled={!cameraReady}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
              >
                <CameraIcon className="w-5 h-5 mr-2" />
                Capturar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={retakePhoto}
                disabled={isUploading}
                className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Repetir
              </button>
              <button
                onClick={savePhoto}
                disabled={isUploading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5 mr-2" />
                    Guardar
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default SimpleCameraCapture;