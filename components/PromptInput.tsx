import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Ex: 'Uma casa de concreto brutalista em um penhasco com iluminação do pôr do sol.'"
      className="w-full h-32 p-3 bg-slate-900 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-300 placeholder-slate-500"
    />
  );
};