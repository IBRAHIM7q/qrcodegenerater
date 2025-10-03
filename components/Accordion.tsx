import React, { useState } from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-cyber-card/70 backdrop-blur-xl border border-cyan-400/20 rounded-2xl shadow-glass overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-lg text-white"
      >
        <span>{title}</span>
        <ChevronDownIcon
          className={`w-6 h-6 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;