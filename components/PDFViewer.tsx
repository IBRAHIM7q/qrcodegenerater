import React, { useEffect, useState } from 'react';
import { getViewUrl } from '../services/pdfService';

interface PDFViewerProps {
  pdfUrl: string;
  onClose: () => void;
  pdfId?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, pdfId, onClose }) => {
  const [viewUrl, setViewUrl] = useState<string>(pdfUrl);
  
  useEffect(() => {
    // If we have a PDF ID, use the server view URL
    if (pdfId) {
      const serverViewUrl = getViewUrl(pdfId);
      setViewUrl(serverViewUrl);
    }
  }, [pdfId]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden border border-cyan-400/30">
        <div className="flex justify-between items-center p-4 border-b border-cyan-400/30">
          <h3 className="text-xl font-bold text-white">PDF Viewer</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 bg-white">
          <iframe 
            src={viewUrl} 
            className="w-full h-full" 
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;