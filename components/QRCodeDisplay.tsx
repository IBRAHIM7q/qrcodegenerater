import React, { useRef, useEffect, useState } from 'react';
import QRCodeStyling, { Options as QRCodeOptions, FileExtension } from 'qr-code-styling';
import jsPDF from 'jspdf';

interface QRCodePreviewProps {
  options: QRCodeOptions;
  pdfUrl?: string; // Added URL prop
}

const QRCodePreview: React.FC<QRCodePreviewProps> = ({ options, pdfUrl }) => {
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(options));
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    qrCode.update(options);
  }, [options, qrCode]);
  
  const onDownloadClick = (extension: FileExtension) => {
    qrCode.download({
      name: 'qrcode',
      extension: extension,
    });
  };

  const copyToClipboard = () => {
    if (pdfUrl) {
      navigator.clipboard.writeText(pdfUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy URL: ', err);
        });
    }
  };

  const onDownloadPDF = async () => {
    try {
      // Create a canvas element to render the QR code
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Set canvas dimensions
      canvas.width = options.width || 300;
      canvas.height = options.height || 300;
      
      // Create a temporary QR code instance for the canvas
      const tempQR = new QRCodeStyling(options);
      await tempQR.append(canvas);
      
      // Get the data URL from the canvas
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title
      pdf.setFontSize(16);
      pdf.text('QR Code', 105, 20, { align: 'center' });
      
      // Calculate dimensions to fit on A4 page with margins
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 20; // 20mm margin
      const maxWidth = pdfWidth - (margin * 2);
      
      // Add QR code image centered on page
      pdf.addImage(
        dataUrl, 
        'PNG', 
        margin, 
        margin + 20, 
        maxWidth, 
        maxWidth // Keep aspect ratio square
      );
      
      // Add URL to PDF if available
      if (pdfUrl) {
        pdf.setFontSize(10);
        pdf.text('PDF URL:', margin, pdfHeight - margin - 10);
        pdf.text(pdfUrl, margin, pdfHeight - margin - 5, { maxWidth: pdfWidth - (margin * 2) });
      }
      
      // Save PDF
      pdf.save('qrcode.pdf');
      
      // Clean up
      canvas.remove();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md animate-fade-in-scale bg-[#0a0a0a] p-6 rounded-xl shadow-2xl border border-gray-800">
        <div ref={ref} className="w-full max-w-[300px] h-[300px] md:max-w-[350px] md:h-[350px] lg:max-w-[400px] lg:h-[400px] mx-auto bg-white p-4 rounded-lg shadow-lg" />
        
        {pdfUrl && (
          <div className="w-full bg-[#121212] rounded-lg p-4 border border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              PDF URL (Click to Copy):
            </h4>
            <div 
              onClick={copyToClipboard}
              className="flex items-center justify-between bg-[#1e1e1e] p-3 rounded cursor-pointer hover:bg-[#252525] transition-colors border border-gray-700"
            >
              <div className="text-cyan-400 text-sm truncate mr-2 font-mono">
                {pdfUrl}
              </div>
              <div className="flex-shrink-0">
                {copied ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              This link will open your PDF stored in Google Drive
            </div>
          </div>
        )}
        
        <div className="w-full text-center">
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-3">Download Your QR Code</h3>
            <div className="flex flex-wrap items-center justify-center gap-4">
                <button onClick={() => onDownloadClick('png')} className="px-5 py-2 font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-md hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:ring-cyan-400">PNG</button>
                <button onClick={() => onDownloadClick('jpeg')} className="px-5 py-2 font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-md hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:ring-cyan-400">JPEG</button>
                <button onClick={() => onDownloadClick('svg')} className="px-5 py-2 font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-md hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:ring-cyan-400">SVG</button>
                <button onClick={onDownloadPDF} className="px-5 py-2 font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-md hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:ring-cyan-400">PDF</button>
            </div>
        </div>
    </div>
  );
};

export default QRCodePreview;