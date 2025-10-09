
import React, { useState, useEffect } from 'react';
import QRCodePreview from './components/QRCodeDisplay';
import LogoUpload from './components/LogoUpload';
import PDFUpload from './components/PDFUpload';
import PDFViewer from './components/PDFViewer';
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
    color: '#0f0f1c',
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
  const [isPdfMode, setIsPdfMode] = useState<boolean>(false);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [pdfId, setPdfId] = useState<string>('');
  const [showPdfViewer, setShowPdfViewer] = useState<boolean>(false);
  
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f0f2c] via-[#1b1b3f] to-[#2d1b4f] p-4 lg:p-8 flex flex-col items-center">
      {showPdfViewer && isPdfMode && url && (
        <PDFViewer pdfUrl={url} pdfId={pdfId} onClose={() => setShowPdfViewer(false)} />
      )}
      <header className="text-center mb-8 animate-fade-in-scale">
        <h1 className="text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Ibrahim - Create Your QR Code</h1>
        <p className="text-gray-300 mt-3 text-xl">Design stunning QR codes with a modern aesthetic</p>
      </header>
      
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT - PREVIEW */}
        <div className="lg:sticky top-8 self-start flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]">
            <div className="bg-white/10 p-6 rounded-2xl mb-6 w-full">
                <QRCodePreview options={options} />
            </div>
        </div>

        {/* RIGHT - CONTROLS */}
        <div className="flex flex-col space-y-6">
            <div className="bg-cyber-card/70 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6 shadow-glass">
                <div className="flex space-x-4 mb-4">
                    <button 
                        className={`px-4 py-2 rounded-lg transition-all ${!isPdfMode ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white' : 'bg-gray-700/50 text-gray-300'}`}
                        onClick={() => setIsPdfMode(false)}
                    >
                        URL
                    </button>
                    <button 
                        className={`px-4 py-2 rounded-lg transition-all ${isPdfMode ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white' : 'bg-gray-700/50 text-gray-300'}`}
                        onClick={() => setIsPdfMode(true)}
                    >
                        PDF
                    </button>
                </div>
                
                {!isPdfMode ? (
                    <>
                        <label htmlFor="url-input" className="block text-sm font-semibold text-gray-300 mb-2">URL</label>
                        <input
                            id="url-input"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            required
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                        />
                    </>
                ) : (
                    <>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">PDF File</label>
                        <PDFUpload 
                            onPDFUploaded={(pdfUrl, fileName, id) => {
                                setUrl(pdfUrl);
                                setPdfFileName(fileName);
                                if (id) setPdfId(id);
                            }} 
                        />
                        {pdfFileName && (
                            <div className="mt-2">
                                <p className="text-sm text-cyan-400 mb-2">
                                    PDF: {pdfFileName}
                                </p>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => setShowPdfViewer(true)}
                                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all"
                                    >
                                        View PDF
                                    </button>
                                </div>
                                <div className="mt-4 p-3 bg-cyan-900/30 border border-cyan-400/30 rounded-lg">
                                    <p className="text-sm text-white">
                                        <span className="font-bold text-cyan-400">Scanning Instructions:</span> Scan this QR code with your mobile device camera or QR scanner app to view the PDF online instantly.
                                    </p>
                                    <p className="text-sm text-white mt-2">
                                        <span className="text-green-400">Works on all devices:</span> This QR code will open a PDF viewer that works on both mobile and desktop browsers.
                                    </p>
                                    <p className="text-sm text-white mt-2">
                                        <span className="text-yellow-400">Note:</span> For demonstration purposes, this will display a sample PDF document.
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
                    
                    
            </div>

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
                    
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Corner Dot Color</label>
                        <input 
                            type="color" 
                            value={options.cornersDotOptions?.color || '#d946ef'} 
                            onChange={(e) => handleOptionChange('cornersDotOptions', { 
                                ...options.cornersDotOptions, 
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
