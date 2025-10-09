import React, { useState } from 'react';
import { uploadPDF, getQRCodeUrl, getDirectUrl, uploadToGoogleDrive } from '../services/pdfService';

interface PDFUploadProps {
  onPDFUploaded: (pdfUrl: string, fileName: string, pdfId?: string) => void;
}

const PDFUpload: React.FC<PDFUploadProps> = ({ onPDFUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  let progressInterval: any = null;

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
      const errorMessage = 'Please upload a PDF file';
      setUploadError(errorMessage);
      alert(errorMessage);
      return;
    }

    setFileName(file.name);
    setIsUploading(true);
    setUploadProgress(10); // Start progress
    setUploadSuccess(false);
    setUploadError(null);

    try {
      // Simulate progress during upload
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 15);
          return newProgress > 90 ? 90 : newProgress; // Cap at 90% until complete
        });
      }, 500);

      console.log('Starting PDF upload to local server...');
      
      // Upload the PDF to our local server
      const { url, id } = await uploadPDF(file);
      
      if (progressInterval) clearInterval(progressInterval);
      setUploadProgress(100); // Complete progress
      
      console.log('PDF uploaded successfully to local server. URL:', url, 'ID:', id);
      
      // Store the uploaded file ID
      setUploadedFileId(id);
      
      // Get the QR code URL for this PDF
      const qrCodeUrl = getQRCodeUrl(id);
      
      // Get the direct URL for displaying alongside QR code
      const directUrl = getDirectUrl(id);
      
      console.log('QR Code URL:', qrCodeUrl);
      console.log('Direct URL:', directUrl);
      
      // Pass the QR code URL and direct URL to the parent component
      onPDFUploaded(qrCodeUrl, file.name, id);
      
      // Store the direct URL in localStorage for persistence
      if (directUrl) {
        localStorage.setItem(`pdf_direct_url_${id}`, directUrl);
      }
      
      // Show success state
      setUploadSuccess(true);
    } catch (error: any) {
      console.error('Error uploading PDF:', error);
      if (progressInterval) clearInterval(progressInterval);
      setIsUploading(false);
      setUploadError(error.message || 'Failed to upload PDF. Please try again.');
      alert('Failed to upload PDF. Please try again. Error: ' + (error.message || error));
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadToGoogleDrive = async () => {
    if (!uploadedFileId) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(50);
      
      // Simulate uploading to Google Drive
      const { url, driveFileId } = await uploadToGoogleDrive(uploadedFileId);
      
      setUploadProgress(100);
      
      // Update the parent component with the new Google Drive URL
      const qrCodeUrl = getQRCodeUrl(uploadedFileId);
      onPDFUploaded(qrCodeUrl, fileName, uploadedFileId);
      
      // Store the direct URL in localStorage for persistence
      if (url) {
        localStorage.setItem(`pdf_direct_url_${uploadedFileId}`, url);
      }
      
      alert('File successfully uploaded to Google Drive! The QR code now points to your Google Drive file.');
    } catch (error: any) {
      console.error('Error uploading to Google Drive:', error);
      setUploadError(error.message || 'Failed to upload to Google Drive. Please try again.');
      alert('Failed to upload to Google Drive. Please try again. Error: ' + (error.message || error));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-cyan-400 bg-cyan-400/10'
            : uploadSuccess
            ? 'border-green-500 bg-green-500/10'
            : uploadError
            ? 'border-red-500 bg-red-500/10'
            : 'border-gray-700 hover:border-cyan-400/60 bg-[#121212]'
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
            <div className="relative w-16 h-16">
              <div className="w-16 h-16 border-4 border-cyan-400/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 flex items-center justify-center">
                <span className="text-xs font-semibold text-cyan-400">{uploadProgress}%</span>
              </div>
            </div>
            <p className="text-gray-300 mt-3">Uploading file...</p>
            <p className="text-gray-400 text-xs mt-1">This may take a moment</p>
          </div>
        ) : uploadError ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-3 shadow-lg shadow-red-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-gray-200 font-medium">Upload Failed</p>
            <p className="text-gray-400 text-sm mt-1 text-center px-2">{uploadError}</p>
          </div>
        ) : uploadSuccess ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-3 shadow-lg shadow-green-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-200 font-medium">File Uploaded Successfully!</p>
            <p className="text-gray-400 text-sm mt-1">Your file is stored locally</p>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center justify-center py-2">
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full mb-3 shadow-lg shadow-cyan-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-200 font-medium truncate max-w-full">{fileName}</p>
            <div className="flex items-center mt-2 text-cyan-400 text-xs">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Click to change PDF
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-[#1e1e1e] to-[#2d2d2d] rounded-full mb-4 shadow-inner">
              <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-gray-200 font-medium mb-2">Upload PDF File</p>
            <p className="text-gray-400 text-sm">Drag & drop your file or click to browse</p>
            <p className="text-cyan-400/70 text-xs mt-3 max-w-xs">Your file will be stored locally and accessible via QR code</p>
          </div>
        )}
      </div>
      
      {uploadSuccess && (
        <div className="mt-4 space-y-3">
          <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-center">
            <p className="text-green-400 text-sm font-medium">
              <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              File successfully uploaded to local storage
            </p>
          </div>
          
          <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
            <h4 className="text-amber-400 font-medium mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Google Drive Integration
            </h4>
            <p className="text-sm text-gray-300 mb-3">
              To store this file in your personal Google Drive and generate a QR code that links directly to Google Drive:
            </p>
            <button 
              onClick={handleUploadToGoogleDrive}
              className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all text-sm font-medium"
            >
              Upload to Google Drive
            </button>
            <p className="text-xs text-gray-400 mt-2">
              Note: A complete Google Drive integration requires OAuth2 authentication which needs to be implemented on the backend.
            </p>
          </div>
        </div>
      )}
      
      {uploadError && (
        <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-center">
          <p className="text-red-400 text-sm font-medium">
            <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Upload failed: {uploadError}
          </p>
        </div>
      )}
    </div>
  );
};

export default PDFUpload;