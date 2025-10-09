import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getViewUrl } from '../services/pdfService';

const ViewPDF: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No PDF ID provided');
      setLoading(false);
      return;
    }
    
    console.log('Loading PDF with ID:', id);
    
    // Get the PDF URL using the ID
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
      <div className="flex flex-col min-h-screen bg-gray-900">
        <header className="bg-gray-800 p-4 text-white">
          <h1 className="text-xl font-bold">PDF Viewer</h1>
        </header>
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-white">Loading PDF...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900">
        <header className="bg-gray-800 p-4 text-white">
          <h1 className="text-xl font-bold">PDF Viewer</h1>
        </header>
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-white bg-red-500/20 p-4 rounded border border-red-500/30">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <header className="bg-gray-800 p-4 text-white">
        <h1 className="text-xl font-bold">PDF Viewer</h1>
      </header>
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl border border-cyan-400/30 rounded bg-gray-800 overflow-hidden">
          <div className="bg-gray-700 p-3 flex justify-between items-center">
            <div className="text-white">Your PDF Document</div>
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              Open in new tab
            </a>
          </div>
          <iframe 
            src={pdfUrl} 
            className="w-full h-[80vh]" 
            title="PDF Viewer"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewPDF;