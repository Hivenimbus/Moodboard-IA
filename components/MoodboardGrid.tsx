import React from 'react';
import type { GeneratedItem } from '../types';

interface MoodboardGridProps {
  items: GeneratedItem[];
  isLoading: boolean;
  onItemClick: (item: GeneratedItem) => void;
  onItemDelete: (id: string) => void;
}

interface GeneratedImageCardProps {
    item: GeneratedItem;
    onClick: (item: GeneratedItem) => void;
    onDelete: (id: string) => void;
}


const GeneratedImageCard: React.FC<GeneratedImageCardProps> = ({ item, onClick, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o modal abra
    onDelete(item.id);
  };
    
  return (
    <div 
        onClick={() => onClick(item)}
        className="relative bg-slate-800 rounded-lg overflow-hidden shadow-lg group transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/20 cursor-pointer"
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 z-10 bg-slate-900/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500"
        aria-label="Deletar imagem"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <img src={item.imageUrl} alt={item.prompt} className="w-full h-64 object-cover" />
      <div className="p-4">
        <p className="text-slate-300 text-sm italic">"{item.prompt}"</p>
      </div>
    </div>
  );
};


export const MoodboardGrid: React.FC<MoodboardGridProps> = ({ items, isLoading, onItemClick, onItemDelete }) => {
  if (items.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-slate-500 h-full p-8 border-2 border-dashed border-slate-700 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
        <h3 className="text-xl font-semibold">Seu Moodboard está Vazio</h3>
        <p className="mt-1">As imagens geradas aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {items.map((item) => (
        <GeneratedImageCard 
          key={item.id} 
          item={item} 
          onClick={onItemClick} 
          onDelete={onItemDelete}
        />
      ))}
    </div>
  );
};