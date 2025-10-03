import React from 'react';

interface CustomSliderProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

const CustomSlider: React.FC<CustomSliderProps> = ({ label, value, onChange, min, max, step, unit = 'px' }) => {
  return (
    <div>
      <label className="flex justify-between items-center text-sm font-semibold text-gray-300 mb-2">
        <span>{label}</span>
        <span className="text-cyber-accent font-mono bg-cyber-background/50 px-2 py-0.5 rounded-md text-xs">{value}{unit}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyber-accent"
        style={{
          '--thumb-color': 'var(--cyan-glow)'
        } as React.CSSProperties}
      />
    </div>
  );
};

export default CustomSlider;