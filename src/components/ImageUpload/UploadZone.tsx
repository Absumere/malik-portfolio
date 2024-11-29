'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface UploadZoneProps {
  onUpload: (files: File[]) => Promise<void>;
  maxFiles?: number;
  acceptedFileTypes?: string[];
}

interface PreviewFile extends File {
  preview: string;
  progress?: number;
  status?: 'uploading' | 'success' | 'error';
  error?: string;
}

export default function UploadZone({ 
  onUpload, 
  maxFiles = 10,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp']
}: UploadZoneProps) {
  const [files, setFiles] = useState<PreviewFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'uploading' as const
      })
    );
    
    setFiles(prev => [...prev, ...newFiles]);
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    maxFiles,
    multiple: true
  });

  const removeFile = (file: PreviewFile) => {
    URL.revokeObjectURL(file.preview);
    setFiles(files => files.filter(f => f !== file));
  };

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-12 h-12 text-gray-400" />
          {isDragActive ? (
            <p className="text-lg font-medium">Drop the files here...</p>
          ) : (
            <>
              <p className="text-lg font-medium">Drag & drop files here</p>
              <p className="text-sm text-gray-500">or click to select files</p>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {files.map((file) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                <Image
                  src={file.preview}
                  alt={file.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => removeFile(file)}
                      className="p-1 bg-white rounded-full text-gray-700 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-white text-sm truncate px-2">
                      {file.name}
                    </div>
                    {file.status === 'uploading' && (
                      <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {file.status === 'success' && (
                  <div className="absolute top-2 left-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
