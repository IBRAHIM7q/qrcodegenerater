
import React from 'react';
import type { Gradient } from 'qr-code-styling';

interface GradientControlsProps {
  gradient: Gradient;
  onChange: (gradient: Gradient) => void;
}

const GradientControls: React.FC<GradientControlsProps> = ({ gradient, onChange }) => {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...gradient, type: e.target.value as 'linear' | 'radial' });
  };

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...gradient, rotation: Number(e.target.value) });
  };

  const handleColorStopChange = (index: number, color: string) => {
    const newColorStops = [...(gradient?.colorStops || [])];
    newColorStops[index] = { ...(newColorStops[index] || { offset: index }), color };
    onChange({ ...gradient, colorStops: newColorStops });
  };

  const color1 = gradient?.colorStops?.[0]?.color || '#000000';
  const color2 = gradient?.colorStops?.[1]?.color || '#ffffff';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
          <select value={gradient?.type || 'linear'} onChange={handleTypeChange} className="w-full px-3 py-2 bg-cyber-background text-gray-100 border border-cyan-400/30 rounded-md focus:outline-none focus:ring-1 focus:ring-cyber-accent">
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>
        {gradient?.type === 'linear' && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Rotation (°)</label>
            <input 
              type="number" 
              value={gradient?.rotation || 0} 
              onChange={handleRotationChange} 
              className="w-full px-3 py-2 bg-cyber-background text-gray-100 border border-cyan-400/30 rounded-md focus:outline-none focus:ring-1 focus:ring-cyber-accent" 
              min="0"
              max="360"
            />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Colors</label>
        <div className="flex items-center gap-2">
          <input type="color" value={color1} onChange={(e) => handleColorStopChange(0, e.target.value)} className="w-full h-10 p-1 bg-cyber-background border border-cyan-400/30 rounded-md cursor-pointer" />
          <input type="color" value={color2} onChange={(e) => handleColorStopChange(1, e.target.value)} className="w-full h-10 p-1 bg-cyber-background border border-cyan-400/30 rounded-md cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default GradientControls;
