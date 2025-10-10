import React, { useState, useRef } from 'react';
import { Options as QRCodeOptions } from 'qr-code-styling';
import QRCodePreview from './QRCodeDisplay';

const PDFUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [qrOptions, setQrOptions] = useState<QRCodeOptions>({
    width: 300,
    height: 300,
    type: 'svg',
    data: '',
    image: '',
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'Q'
    },
    dotsOptions: {
      color: '#222222',
      type: 'rounded'
    },
    backgroundOptions: {
      color: '#ffffff',
    },
    cornersSquareOptions: {
      color: '#222222',
      type: 'extra-rounded',
    },
    cornersDotOptions: {
      color: '#222222',
      type: 'dot',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error uploading file');
      }

      setPdfUrl(data.url);
      setQrOptions({
        ...qrOptions,
        data: data.url
      });
      setUploadSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setUploadSuccess(false);
    setPdfUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-cyber-card rounded-lg shadow-xl border border-gray-800">
      {!uploadSuccess ? (
        <>
          <h2 className="text-xl font-bold mb-4 text-white">Upload PDF for QR Code</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select PDF File
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="w-full px-3 py-2 text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full py-2 px-4 rounded-md font-medium transition-all ${
              !file || uploading
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/20'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload PDF & Generate QR Code'}
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-white">PDF Uploaded Successfully!</h2>
          <p className="text-gray-300 mb-6 text-center">
            Your PDF is now available online. Scan the QR code below to access it.
          </p>
          
          <div className="mb-6">
            <QRCodePreview options={qrOptions} />
          </div>
          
          {pdfUrl && (
            <div className="mb-6 w-full">
              <p className="text-sm text-gray-400 mb-2">PDF URL:</p>
              <div className="p-3 bg-gray-800 rounded-md text-gray-300 text-sm break-all">
                {pdfUrl}
              </div>
            </div>
          )}
          
          <button
            onClick={resetForm}
            className="w-full py-2 px-4 bg-gray-700 text-white rounded-md font-medium hover:bg-gray-600 transition-all"
          >
            Upload Another PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFUpload;