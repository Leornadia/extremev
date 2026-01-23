'use client';

import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Spinner } from '@/components/ui';

interface FileUploadProps {
  type: 'model' | 'image';
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
  label?: string;
  accept?: string;
}

export function FileUpload({
  type,
  onUploadComplete,
  currentUrl,
  label,
  accept,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultAccept =
    type === 'model' ? '.glb,.gltf' : '.jpg,.jpeg,.png,.webp,.avif';

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create preview for images
      if (type === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }

      // Upload file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      setSuccess(true);
      onUploadComplete(data.data.url);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setPreview(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}

      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
        {/* Preview */}
        {preview && type === 'image' && (
          <div className="mb-4 relative inline-block">
            <img src={preview} alt="Preview" className="max-h-40 rounded-lg" />
            <button
              onClick={handleClear}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {preview && type === 'model' && (
          <div className="mb-4 p-4 bg-neutral-100 rounded-lg">
            <p className="text-sm text-neutral-700 font-medium">
              Model uploaded
            </p>
            <p className="text-xs text-neutral-500 mt-1 break-all">{preview}</p>
            <button
              onClick={handleClear}
              className="mt-2 text-sm text-red-600 hover:text-red-700"
            >
              Clear
            </button>
          </div>
        )}

        {/* Upload Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept || defaultAccept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <Button
          type="button"
          variant="secondary"
          onClick={handleButtonClick}
          disabled={uploading}
          className="mx-auto"
        >
          {uploading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {preview ? 'Change File' : 'Upload File'}
            </>
          )}
        </Button>

        <p className="text-xs text-neutral-500 mt-2">
          {type === 'model'
            ? 'GLB or GLTF files (max 50MB)'
            : 'JPG, PNG, WebP, or AVIF (max 10MB)'}
        </p>

        {/* Status Messages */}
        {error && (
          <div className="mt-4 flex items-center justify-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Upload successful!</span>
          </div>
        )}
      </div>
    </div>
  );
}
