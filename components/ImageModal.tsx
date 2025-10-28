import React from 'react';
import type { GeneratedItem } from '../types';
import { Loader } from './Loader';

interface ImageModalProps {
  item: GeneratedItem;
  onClose: () => void;
  onGenerateVariation: () => void;
  isLoading: boolean;
  error: string | null;
  editPrompt: string;
  setEditPrompt: (prompt: string) => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ 
  item, 
  onClose, 
  onGenerateVariation, 
  isLoading, 
  error,
  editPrompt,
  setEditPrompt 
}) => {
  return (
    <div 
        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" 
        aria-modal="true"
        role="dialog"
        onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row gap-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
       >
         <div className="flex-1 p-4 flex items-center justify-center bg-black/50">
            <img 
                src={item.imageUrl} 
                alt={item.prompt} 
                className="max-w-full max-h-[80vh] object-contain rounded-md"
            />
         </div>
        <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-400">Descrição Original</h3>
                <p className="text-slate-300 italic">"{item.prompt}"</p>
            </div>
            <div>
                 <h3 className="text-xl font-semibold text-teal-400 mb-2">Editar esta Imagem</h3>
                <textarea
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Ex: 'Aumente as janelas e mude o material para madeira escura.'"
                    className="w-full h-28 p-3 bg-slate-900 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-300 placeholder-slate-500"
                />
            </div>
          </div>
          <div className="space-y-4">
            <button
                onClick={onGenerateVariation}
                disabled={isLoading || !editPrompt}
                className="w-full flex justify-center items-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
                {isLoading ? (
                <>
                    <Loader />
                    Gerando Variação...
                </>
                ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.734V6a2 2 0 012-2h2.5" />
                    </svg>
                    Gerar Variação
                </>
                )}
            </button>
            {error && <p className="text-red-400 text-center">{error}</p>}
          </div>

        </div>
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            aria-label="Fechar modal"
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>
    </div>
  );
};