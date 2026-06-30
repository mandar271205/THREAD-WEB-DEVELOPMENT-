"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { UploadCloud, FileImage, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function DropZone({ onFileSelect, isLoading }: DropZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const originalFile = acceptedFiles[0];
    setIsCompressing(true);
    
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(originalFile, options);
      setFile(compressedFile);
      onFileSelect(compressedFile);
    } catch (error) {
      console.error("Error compressing image:", error);
    } finally {
      setIsCompressing(false);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    disabled: isLoading || isCompressing
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  if (file) {
    return (
      <div className="border-2 border-border rounded-xl p-8 bg-card flex flex-col items-center justify-center relative shadow-sm">
        <div className="absolute top-4 right-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={removeFile}
            disabled={isLoading}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <FileImage className="w-16 h-16 text-primary mb-4" />
        <p className="font-medium text-lg mb-1">{file.name}</p>
        <p className="text-sm text-muted-foreground mb-6">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
        {isLoading && (
          <div className="flex items-center text-primary font-medium">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Analyzing Fabric...
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-card/50'}
        ${(isLoading || isCompressing) ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      {isCompressing ? (
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-lg font-medium">Optimizing Image...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6">
            <UploadCloud className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-xl font-medium mb-2">
            {isDragActive ? "Drop the fabric image here" : "Drag & drop a fabric image"}
          </p>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">
            Supports JPG, JPEG, PNG. Image will be automatically compressed before analysis.
          </p>
          <Button variant="outline" type="button">
            Browse Files
          </Button>
        </div>
      )}
    </div>
  );
}
