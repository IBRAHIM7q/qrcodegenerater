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
      <div className="flex flex-col min-h-screen bg-[#121212]">
        <header className="bg-[#1E1E1E] p-4 text-white border-b border-[#333] shadow-lg">
          <h1 className="text-xl font-bold">PDF Viewer</h1>
        </header>
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-white flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading PDF...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#121212]">
        <header className="bg-[#1E1E1E] p-4 text-white border-b border-[#333] shadow-lg">
          <h1 className="text-xl font-bold">PDF Viewer</h1>
        </header>
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-white bg-red-500/10 p-6 rounded-lg border border-red-500/20 shadow-lg max-w-md">
            <div className="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-semibold">Error</span>
            </div>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <header className="bg-[#1E1E1E] p-4 text-white border-b border-[#333] shadow-lg">
        <h1 className="text-xl font-bold">PDF Viewer</h1>
      </header>
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl border border-[#333]">
          <div className="bg-[#1E1E1E] p-4 flex justify-between items-center border-b border-[#333]">
            <div className="text-white font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Your PDF Document
            </div>
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in new tab
            </a>
          </div>
          <object 
            data={pdfUrl} 
            type="application/pdf"
            className="w-full h-[80vh] bg-[#121212]"
          >
            <div className="flex flex-col items-center justify-center h-[80vh] bg-[#121212] text-white p-8">
              <p className="mb-4">Unable to display PDF directly.</p>
              <a 
                href={pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
              >
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