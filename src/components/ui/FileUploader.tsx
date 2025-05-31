import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect: (fileContent: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  buttonText?: string;
  dragActiveText?: string;
  dragInactiveText?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  accept = '.json',
  maxSize = 5, // 5MB default
  className,
  buttonText = 'Select File',
  dragActiveText = 'Drop it here',
  dragInactiveText = 'Drag and drop your file here or'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);

    // Check file extension against accept prop
    if (accept) {
      const allowedExts = accept.split(',').map(ext => ext.trim().toLowerCase());
      const fileName = file.name.toLowerCase();
      const hasAllowedExt = allowedExts.some(ext => fileName.endsWith(ext));
      if (!hasAllowedExt) {
        setError(`Invalid file type. Please upload a file of type: ${allowedExts.join(', ')}`);
        return;
      }
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSize}MB.`);
      return;
    }

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onFileSelect(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={className}>
      <div
        className={cn(
          'flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg transition-colors',
          dragActive ? 'border-devops-blue bg-devops-blue/5' : 'border-border bg-muted/20',
          error ? 'border-devops-red/50' : '',
          'relative'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className={cn(
              'w-8 h-8 mb-3',
              dragActive ? 'text-devops-blue' : 'text-muted-foreground',
              error ? 'text-devops-red' : ''
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          
          {fileName ? (
            <p className="text-sm text-center">
              <span className="font-medium">{fileName}</span> selected
            </p>
          ) : (
            <p className="text-sm text-center text-muted-foreground">
              {dragActive ? dragActiveText : dragInactiveText}
            </p>
          )}
          
          {!dragActive && !fileName && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleButtonClick}
              className="mt-2"
            >
              {buttonText}
            </Button>
          )}
          
          {error && <p className="mt-2 text-sm text-center text-devops-red">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
