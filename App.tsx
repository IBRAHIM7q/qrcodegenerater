
import React, { useState, useEffect, useRef } from 'react';
import QRCodePreview from './components/QRCodeDisplay';
import LogoUpload from './components/LogoUpload';
import CustomSlider from './components/CustomSlider';
import Accordion from './components/Accordion';
import GradientControls from './components/GradientControls';

import type { Options as QRCodeOptions, DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';

const initialOptions: QRCodeOptions = {
  width: 300,
  height: 300,
  type: 'canvas',
  data: 'https://google.com',
  image: '',
  margin: 10,
  qrOptions: {
    typeNumber: 0,
    mode: 'Byte',
    errorCorrectionLevel: 'Q',
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 4,
    crossOrigin: 'anonymous',
  },
  dotsOptions: {
    color: '#22d3ee',
    type: 'rounded',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [{ offset: 0, color: '#22d3ee' }, { offset: 1, color: '#d946ef' }]
    }
  },
  backgroundOptions: {
    color: '#000000',
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
    color: '#22d3ee',
  },
  cornersDotOptions: {
    type: 'dot',
    color: '#d946ef',
  },
};

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('https://google.com');
  const [options, setOptions] = useState<QRCodeOptions>(initialOptions);
  const [dotsColorType, setDotsColorType] = useState<'solid' | 'gradient'>('gradient');
  const [backgroundColorType, setBackgroundColorType] = useState<'solid' | 'gradient'>('solid');
  
  useEffect(() => {
    setOptions(prev => ({ ...prev, data: url || ' ' }));
  }, [url]);

  const handleOptionChange = <K extends keyof QRCodeOptions>(key: K, value: QRCodeOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };
  
  const handleImageOptionChange = <K extends keyof QRCodeOptions['imageOptions']>(key: K, value: any) => {
    handleOptionChange('imageOptions', { ...options.imageOptions, [key]: value });
  };
  
  const handleLogoChange = (logo: string | null) => {
    handleOptionChange('image', logo || '');
  };

  const dotTypes: DotType[] = ['square', 'dots', 'rounded', 'classy', 'classy-rounded', 'extra-rounded'];
  const cornerSquareTypes: CornerSquareType[] = ['square', 'dot', 'extra-rounded'];
  const cornerDotTypes: CornerDotType[] = ['square', 'dot'];

  const [activeTab, setActiveTab] = useState('url');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setUploadError('Please select a PDF file');
        setFile(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setUploadError('File size exceeds 10MB limit');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadError(null);
    
    const formData = new FormData();
    formData.append('pdf', file);
    
    try {
      const response = await fetch('http://localhost:3009/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload PDF');
      }
      
      setPdfUrl(data.url);
      setOptions(prev => ({
        ...prev,
        data: data.url
      }));
      setUploadSuccess(true);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setUploadSuccess(false);
    setPdfUrl(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen w-full bg-black p-4 lg:p-8 flex flex-col items-center">
      <header className="text-center mb-8 animate-fade-in-scale">
        <h1 className="text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Ibrahim - QR Code Generator</h1>
        <p className="text-gray-300 mt-3 text-xl">Create Stunning QR Codes with Google Drive Integration</p>
      </header>
      
      <div className="w-full max-w-7xl mb-8">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-900 p-1 rounded-lg inline-flex">
            <button 
              onClick={() => setActiveTab('url')} 
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'url' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              URL
            </button>
            <button 
              onClick={() => setActiveTab('pdf')} 
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'pdf' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              PDF
            </button>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT - PREVIEW */}
        <div className="lg:sticky top-8 self-start flex flex-col items-center justify-center p-8 bg-gray-900 border border-gray-800 rounded-3xl shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]">
            <div className="bg-gray-800 p-6 rounded-2xl mb-6 w-full">
                <QRCodePreview options={options} />
            </div>
        </div>

        {/* RIGHT - CONTROLS */}
        <div className="flex flex-col space-y-6 bg-gray-900 p-8 rounded-3xl border border-gray-800">
          {activeTab === 'url' ? (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter URL
                </label>
                <input
                  type="text"
                  value={options.data as string}
                  onChange={(e) => handleOptionChange('data', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </>
          ) : (
            <>
              {!uploadSuccess ? (
                <div className="w-full">
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
                  {uploadError && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-400 text-sm">
                      {uploadError}
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
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <h2 className="text-xl font-bold mb-4 text-white">PDF Uploaded Successfully!</h2>
                  <p className="text-gray-300 mb-6 text-center">
                    Your PDF is now available online. The QR code has been generated.
                  </p>
                  
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
            </>
          )}

            <Accordion title="Dots & Corners">
                <div className="space-y-4 p-4">
                    <StyleSelector label="Dot Style" options={dotTypes} value={options.dotsOptions?.type ?? 'square'} onChange={(v) => handleOptionChange('dotsOptions', { ...options.dotsOptions, type: v as DotType })} />
                    <StyleSelector label="Corner Square Style" options={cornerSquareTypes} value={options.cornersSquareOptions?.type ?? 'square'} onChange={(v) => handleOptionChange('cornersSquareOptions', { ...options.cornersSquareOptions, type: v as CornerSquareType })} />
                    <StyleSelector label="Corner Dot Style" options={cornerDotTypes} value={options.cornersDotOptions?.type ?? 'square'} onChange={(v) => handleOptionChange('cornersDotOptions', { ...options.cornersDotOptions, type: v as CornerDotType })} />
                    
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Corner Square Color</label>
                        <input 
                            type="color" 
                            value={options.cornersSquareOptions?.color || '#000000'} 
                            onChange={(e) => handleOptionChange('cornersSquareOptions', { 
                                ...options.cornersSquareOptions, 
                                color: e.target.value 
                            })} 
                            className="w-full h-10 p-1 bg-cyber-background border border-cyan-400/30 rounded-md cursor-pointer" 
                        />
                    </div>
                </div>
            </Accordion>
            
            <Accordion title="Colors & Gradients">
                <div className="space-y-6 p-4">
                    {/* Dots Color Section */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Dots Style</label>
                        <div className="flex items-center gap-2 mb-3">
                            <ColorModeToggle
                                mode={dotsColorType}
                                setMode={(mode) => {
                                    setDotsColorType(mode);
                                    if (mode === 'solid') {
                                        handleOptionChange('dotsOptions', { ...options.dotsOptions, gradient: undefined });
                                    } else {
                                        handleOptionChange('dotsOptions', { ...options.dotsOptions, gradient: initialOptions.dotsOptions.gradient });
                                    }
                                }}
                            />
                        </div>
                        {dotsColorType === 'solid' ? (
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">Dots Color</label>
                              <input type="color" value={options.dotsOptions?.color} onChange={(e) => handleOptionChange('dotsOptions', { ...options.dotsOptions, color: e.target.value, gradient: undefined })} className="w-full h-10 p-1 bg-cyber-background border border-cyan-400/30 rounded-md cursor-pointer" />
                            </div>
                        ) : (
                           <GradientControls
                                gradient={options.dotsOptions?.gradient}
                                onChange={(gradient) => handleOptionChange('dotsOptions', { ...options.dotsOptions, gradient })}
                            />
                        )}
                    </div>

                    <hr className="border-cyan-400/10" />

                    {/* Background Color Section */}
                     <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Background Style</label>
                        <div className="flex items-center gap-2 mb-3">
                            <ColorModeToggle
                                mode={backgroundColorType}
                                setMode={(mode) => {
                                    setBackgroundColorType(mode);
                                    if (mode === 'solid') {
                                        handleOptionChange('backgroundOptions', { ...options.backgroundOptions, gradient: undefined });
                                    } else {
                                        handleOptionChange('backgroundOptions', { ...options.backgroundOptions, gradient: { type: 'linear', rotation: 0, colorStops: [{ offset: 0, color: '#0f0f1c' }, { offset: 1, color: '#1b1b2f' }] } });
                                    }
                                }}
                            />
                        </div>
                        {backgroundColorType === 'solid' ? (
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1">Background Color</label>
                              <input type="color" value={options.backgroundOptions?.color} onChange={(e) => handleOptionChange('backgroundOptions', { ...options.backgroundOptions, color: e.target.value, gradient: undefined })} className="w-full h-10 p-1 bg-cyber-background border border-cyan-400/30 rounded-md cursor-pointer" />
                            </div>
                        ) : (
                           <GradientControls
                                gradient={options.backgroundOptions?.gradient}
                                onChange={(gradient) => handleOptionChange('backgroundOptions', { ...options.backgroundOptions, gradient })}
                            />
                        )}
                    </div>
                </div>
            </Accordion>

            <Accordion title="Logo">
                <div className="space-y-4 p-4">
                    <LogoUpload onLogoChange={handleLogoChange} />
                    {options.image && (
                      <>
                        <CustomSlider label="Logo Size" value={options.imageOptions.imageSize * 100} onChange={(e) => handleImageOptionChange('imageSize', Number(e.target.value) / 100)} min={10} max={90} step={1} unit="%" />
                        <CustomSlider label="Logo Padding" value={options.imageOptions.margin} onChange={(e) => handleImageOptionChange('margin', Number(e.target.value))} min={0} max={40} step={1} unit="px" />
                      </>
                    )}
                </div>
            </Accordion>
        </div>
      </div>
    </div>
  );
};

const StyleSelector: React.FC<{ label: string, options: string[], value: string, onChange: (v: string) => void }> = ({ label, options, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${value === opt ? 'bg-cyber-accent text-black shadow-neon' : 'bg-cyber-background text-gray-300 hover:bg-gray-800'}`}>
          {opt.replace(/-/g, ' ')}
        </button>
      ))}
    </div>
  </div>
);

const ColorModeToggle: React.FC<{ mode: 'solid' | 'gradient'; setMode: (mode: 'solid' | 'gradient') => void; }> = ({ mode, setMode }) => (
    <>
        <button onClick={() => setMode('solid')} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${mode === 'solid' ? 'bg-cyber-accent text-black shadow-neon' : 'bg-cyber-background text-gray-300 hover:bg-gray-800'}`}>
            Solid
        </button>
        <button onClick={() => setMode('gradient')} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${mode === 'gradient' ? 'bg-cyber-accent text-black shadow-neon' : 'bg-cyber-background text-gray-300 hover:bg-gray-800'}`}>
            Gradient
        </button>
    </>
);

export default App;
