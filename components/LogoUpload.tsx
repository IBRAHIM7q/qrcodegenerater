import React, { useState, useRef } from 'react';
import XIcon from './icons/XIcon';

interface LogoUploadProps {
  onLogoChange: (logo: string | null) => void;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ onLogoChange }) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        onLogoChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/svg+xml"
            className="hidden"
            aria-hidden="true"
        />
        {!logoPreview ? (
             <button
                type="button"
                onClick={triggerFileSelect}
                className="w-full px-4 py-3 text-sm font-semibold text-cyber-accent bg-transparent border-2 border-dashed border-cyber-accent/50 rounded-lg hover:border-cyber-accent hover:bg-cyber-accent/10 hover:text-cyan-300 transition-colors"
            >
                Add Logo (optional)
            </button>
        ) : (
            <div className="flex items-center justify-between p-2 bg-cyber-background rounded-lg">
                <div className="flex items-center gap-3">
                    <img src={logoPreview} alt="Logo Preview" className="w-10 h-10 rounded-md object-contain bg-white/10" />
                    <span className="text-sm font-medium text-gray-300">Logo added</span>
                </div>
                <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="p-1.5 text-gray-400 rounded-full hover:bg-red-500/20 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Remove logo"
                >
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
        )}
    </div>
  );
};

export default LogoUpload;