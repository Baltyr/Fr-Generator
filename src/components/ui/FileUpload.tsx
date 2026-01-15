import React, { useRef, useState, DragEvent } from 'react';
import { Button } from './Button';

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  onFileSelect: (file: File) => void;
  error?: string;
  helperText?: string;
  currentFileName?: string;
  required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  maxSize = 10,
  onFileSelect,
  error,
  helperText,
  currentFileName,
  required = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const validateAndSelectFile = (file: File) => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      alert(`El archivo es muy grande. Tamaño máximo: ${maxSize}MB`);
      return;
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return type.toLowerCase() === fileExtension;
        }
        // Handle MIME types
        return file.type.match(type.replace('*', '.*'));
      });

      if (!isAccepted) {
        alert(`Tipo de archivo no válido. Se aceptan: ${accept}`);
        return;
      }
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
          {required && <span className="text-accent-red ml-1">*</span>}
        </label>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6
          transition-all duration-200
          ${isDragging
            ? 'border-accent-purple bg-accent-purple/10'
            : hasError
            ? 'border-accent-red bg-accent-red/5'
            : 'border-border bg-bg-card hover:border-accent-purple hover:bg-bg-primary'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          {/* Upload icon */}
          <svg
            className={`w-12 h-12 mb-3 ${
              isDragging ? 'text-accent-purple' : 'text-text-muted'
            }`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>

          {currentFileName ? (
            <div className="mb-3">
              <p className="text-sm font-medium text-text-primary mb-1">
                📄 {currentFileName}
              </p>
              <p className="text-xs text-text-muted">
                Haz clic o arrastra un archivo para reemplazar
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-text-primary mb-1">
                Arrastra y suelta tu archivo aquí
              </p>
              <p className="text-xs text-text-muted mb-3">
                o
              </p>
            </>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleButtonClick}
            type="button"
          >
            Seleccionar archivo
          </Button>

          {(accept || maxSize) && (
            <div className="mt-3 text-xs text-text-muted">
              {accept && <div>Formatos: {accept}</div>}
              {maxSize && <div>Tamaño máximo: {maxSize}MB</div>}
            </div>
          )}
        </div>
      </div>

      {(error || helperText) && (
        <p
          className={`mt-1.5 text-sm ${
            hasError ? 'text-accent-red' : 'text-text-muted'
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
