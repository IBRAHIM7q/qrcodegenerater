import React, { useRef, useEffect, useState } from 'react';
import QRCodeStyling, { Options as QRCodeOptions, FileExtension } from 'qr-code-styling';

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

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md animate-fade-in-scale">
        <div ref={ref} className="w-full max-w-[300px] h-[300px] md:max-w-[350px] md:h-[350px] lg:max-w-[400px] lg:h-[400px] mx-auto" />
        <div className="flex items-center space-x-4">
            <button onClick={() => onDownloadClick('png')} className="px-5 py-2 font-semibold uppercase tracking-wider text-black bg-cyber-accent rounded-md hover:bg-cyber-accent-hover transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-card focus:ring-cyber-accent">PNG</button>
            <button onClick={() => onDownloadClick('jpeg')} className="px-5 py-2 font-semibold uppercase tracking-wider text-black bg-cyber-accent rounded-md hover:bg-cyber-accent-hover transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-card focus:ring-cyber-accent">JPEG</button>
            <button onClick={() => onDownloadClick('svg')} className="px-5 py-2 font-semibold uppercase tracking-wider text-black bg-cyber-accent rounded-md hover:bg-cyber-accent-hover transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-card focus:ring-cyber-accent">SVG</button>
        </div>
    </div>
  );
};

export default QRCodePreview;