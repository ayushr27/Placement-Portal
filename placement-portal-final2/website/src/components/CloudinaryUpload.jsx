import React, { useState } from 'react';
import { Upload } from 'lucide-react';

// Cloudinary configuration with fallback values
const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dgsbvayag',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'students'
};

/**
 * Cloudinary image upload utility component
 * Uploads image files to Cloudinary using JavaScript SDK
 */
export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImageFile = async (file) => {
    if (!file) {
      return { error: 'No file provided' };
    }

    // Validate file type (allow images and PDFs for resume)
    const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
    if (!isValidType) {
      return { error: 'File must be an image or PDF' };
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { error: 'File size must be less than 10MB' };
    }

    setUploading(true);
    setError(null);

    try {
      const cloudName = CLOUDINARY_CONFIG.cloudName;
      
      if (!cloudName) {
        throw new Error('Cloudinary cloud name not configured');
      }

      // Use Cloudinary upload API endpoint
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // For unsigned uploads, we need to either:
      // 1. Have an unsigned preset, or
      // 2. Remove the upload_preset parameter for now
      const uploadPreset = CLOUDINARY_CONFIG.uploadPreset;
      if (uploadPreset) {
        formData.append('upload_preset', uploadPreset);
      }
      
      formData.append('folder', 'student-profiles');

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const result = await response.json();

      setUploading(false);
      return { url: result.secure_url, error: null };
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      setError(err.message);
      setUploading(false);
      return { error: err.message, url: null };
    }
  };

  return { uploadImageFile, uploading, error };
};

/**
 * Simple component to display upload status
 */
export const UploadStatus = ({ uploading, error, success }) => {
  if (uploading) {
    return (
      <div className="flex items-center gap-2 text-sm text-blue-600">
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        Uploading to Cloudinary...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <span className="w-4 h-4 text-center">⚠️</span>
        Error: {error}
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <span className="w-4 h-4">✓</span>
        Uploaded successfully
      </div>
    );
  }

  return null;
};

/**
 * File upload input component
 */
export const FileUploadInput = ({ onFileSelect, uploading, currentValue, accept = "image/*" }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-[#003d82] hover:bg-blue-50 transition-all">
        <Upload size={18} className="text-[#003d82]" />
        <span className="text-sm text-gray-700">
          {currentValue ? 'Change file' : 'Choose file to upload'}
        </span>
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {currentValue && (
        <p className="text-xs text-gray-500 px-4">
          Current: {currentValue.substring(0, 50)}...
        </p>
      )}
    </div>
  );
};

export default useCloudinaryUpload;

