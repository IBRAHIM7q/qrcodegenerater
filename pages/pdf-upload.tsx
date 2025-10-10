import React from 'react';
import PDFUpload from '../components/PDFUpload';

export default function PDFUploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1a1a1a] py-12">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              PDF QR Code Generator
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload your PDF files and generate QR codes that link directly to them online.
            Share documents easily by letting others scan and view them instantly.
          </p>
        </header>
        
        <div className="max-w-md mx-auto">
          <PDFUpload />
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="/" 
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to QR Code Generator
          </a>
        </div>
      </div>
    </div>
  );
}