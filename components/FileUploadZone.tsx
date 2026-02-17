'use client';

import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function FileUploadZone({ onFileSelect, isLoading }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border bg-card hover:border-primary/50'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />

      <div className="mb-4 rounded-full bg-accent/10 p-4">
        <Upload className="h-8 w-8 text-accent" />
      </div>

      <h3 className="mb-2 text-balance text-center text-lg font-semibold text-foreground">
        Upload Your Room Photo
      </h3>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Drag and drop your image here, or click to browse
      </p>

      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        variant="default"
        size="lg"
        className="bg-primary hover:bg-primary/90"
      >
        {isLoading ? 'Analyzing...' : 'Select Image'}
      </Button>

      <p className="mt-4 text-xs text-muted-foreground">
        Supported formats: JPG, PNG, WebP • Max 10MB
      </p>
    </div>
  );
}
