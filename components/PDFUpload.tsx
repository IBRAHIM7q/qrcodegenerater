import React, { useState } from 'react';
import { uploadPDF, getQRCodeUrl } from '../services/pdfService';

interface PDFUploadProps {
  onPDFUploaded: (pdfUrl: string, fileName: string, pdfId?: string) => void;
}

const PDFUpload: React.FC<PDFUploadProps> = ({ onPDFUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setFileName(file.name);
    setIsUploading(true);

    try {
      // Upload the PDF to our mock server
      const { url, id } = await uploadPDF(file);
      
      // Get the QR code URL for this PDF
      const qrCodeUrl = getQRCodeUrl(id);
      
      // Pass the QR code URL to the parent component
      onPDFUploaded(qrCodeUrl, file.name, id);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload PDF. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-cyan-400 bg-cyan-400/10'
            : 'border-cyan-400/30 hover:border-cyan-400/60'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('pdf-upload')?.click()}
      >
        <input
          type="file"
          id="pdf-upload"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileInput}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-gray-300">Uploading PDF...</p>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center justify-center py-2">
            <svg className="w-10 h-10 text-cyan-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-300 text-sm truncate max-w-full">{fileName}</p>
            <p className="text-cyan-400 text-xs mt-2">Click to change PDF</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-300 mb-1">Drag & drop your PDF file here</p>
            <p className="text-gray-400 text-sm">or click to browse</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUpload;