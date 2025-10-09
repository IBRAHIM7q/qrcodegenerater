import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getViewUrl } from '../services/pdfService';

const ViewPDF: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No PDF ID provided');
      setLoading(false);
      return;
    }

    const url = getViewUrl(id);
    if (!url) {
      setError('PDF not found');
      setLoading(false);
      return;
    }

    setPdfUrl(url);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212]">
        <div className="relative w-20 h-20">
          <div className="w-20 h-20 border-4 border-cyan-400/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-20 h-20 flex items-center justify-center">
            <span className="text-cyan-400 font-medium">Loading</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
        <div className="w-20 h-20 flex items-center justify-center bg-red-500/10 rounded-full mb-6">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Error</h1>
        <p className="text-gray-300 mb-6">{error}</p>
        <a href="/" className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md text-white font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/20">
          Return Home
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1a1a1a]">
      <div className="container mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Google Drive PDF Viewer
            </span>
          </h1>
          <a 
            href="/" 
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Generator
          </a>
        </header>
        
        <div className="w-full h-[calc(100vh-140px)] bg-[#1e1e1e] rounded-lg overflow-hidden shadow-2xl border border-gray-800">
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-full"
          >
            <div className="flex flex-col items-center justify-center h-full bg-[#1e1e1e] text-white p-8">
              <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full mb-6">
                <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xl font-medium mb-2">Unable to display PDF directly</p>
              <p className="text-gray-400 mb-6 text-center max-w-md">Your browser may not support embedded PDFs. You can download the file instead.</p>
              <a 
                href={pdfUrl} 
                download 
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md text-white font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/20 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </a>
            </div>
          </object>
        </div>
      </div>
    </div>
  );
};

export default ViewPDF;