import React, { useRef, useEffect, useState } from 'react';
import QRCodeStyling, { Options as QRCodeOptions, FileExtension } from 'qr-code-styling';
import jsPDF from 'jspdf';

interface QRCodePreviewProps {
  options: QRCodeOptions;
}

const QRCodePreview: React.FC<QRCodePreviewProps> = ({ options }) => {
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(options));
  const ref = useRef<HTMLDivElement>(null);
  
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
      
      // Save PDF
      pdf.save('qrcode.pdf');
      
      // Clean up
      canvas.remove();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md animate-fade-in-scale">
        <div ref={ref} className="w-full max-w-[300px] h-[300px] md:max-w-[350px] md:h-[350px] lg:max-w-[400px] lg:h-[400px] mx-auto" />
        
        <div className="w-full text-center">
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-3">Download Your QR Code</h3>
            <div className="flex flex-wrap items-center justify-center gap-4">
                <button onClick={() => onDownloadClick('png')} className="px-5 py-2 font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-md hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1b1b3f] focus:ring-cyan-400">PNG</button>
                <button onClick={() => onDownloadClick('jpeg')} className="px-5 py-2 font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-md hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1b1b3f] focus:ring-cyan-400">JPEG</button>
                <button onClick={() => onDownloadClick('svg')} className="px-5 py-2 font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-md hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1b1b3f] focus:ring-cyan-400">SVG</button>
                <button onClick={onDownloadPDF} className="px-5 py-2 font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-md hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1b1b3f] focus:ring-cyan-400">PDF</button>
            </div>
        </div>
    </div>
  );
};

export default QRCodePreview;