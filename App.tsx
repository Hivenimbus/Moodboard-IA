import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { MoodboardGrid } from './components/MoodboardGrid';
import { Loader } from './components/Loader';
import { ImageUploader } from './components/ImageUploader';
import { ImageModal } from './components/ImageModal';
import { generateMoodboardItem } from './services/minimaxService';
import { editImageWithOpenRouter } from './services/openrouterService';
import type { GeneratedItem, BaseImage } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [baseImage, setBaseImage] = useState<BaseImage | null>(null);
  const [generatedItems, setGeneratedItems] = useState<GeneratedItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);
  const [isEditingLoading, setIsEditingLoading] = useState<boolean>(false);
  const [editPrompt, setEditPrompt] = useState<string>('');


  const handleImageClear = () => {
    setBaseImage(null);
  };
  
  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Por favor, forneça uma descrição.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let newItem: GeneratedItem;

      if (baseImage) {
        // Usar OpenRouter para edição de imagem (image-to-image)
        newItem = await editImageWithOpenRouter(prompt, baseImage);
      } else {
        // Usar MiniMax para criação de imagem (text-to-image)
        newItem = await generateMoodboardItem(prompt, baseImage);
      }

      setGeneratedItems(prevItems => [newItem, ...prevItems]);
      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, baseImage]);

  const handleSelectItem = (item: GeneratedItem) => {
    setSelectedItem(item);
    setEditPrompt(''); // Limpa a descrição de edição anterior
    setError(null); // Limpa o erro principal ao abrir o modal
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };
  
  const handleDeleteItem = (id: string) => {
    setGeneratedItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleGenerateVariation = async () => {
    if (!editPrompt || !selectedItem) {
      setError('Por favor, forneça uma descrição para gerar uma variação.');
      return;
    }

    setIsEditingLoading(true);
    setError(null);

    try {
      const baseImageForEdit: BaseImage = {
        data: selectedItem.base64Data,
        mimeType: selectedItem.mimeType,
      };
      // Usar OpenRouter para variações (image-to-image)
      const newItem = await editImageWithOpenRouter(editPrompt, baseImageForEdit);
      setGeneratedItems(prevItems => [newItem, ...prevItems]);
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
      console.error(err);
    } finally {
      setIsEditingLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-teal-400 mb-4">1. Envie uma Imagem (Opcional)</h2>
                <ImageUploader onImageUpload={setBaseImage} onImageClear={handleImageClear} />
              </div>
               <div>
                <h2 className="text-xl font-semibold text-teal-400 mb-4">2. Descreva sua Visão</h2>
                <PromptInput value={prompt} onChange={setPrompt} />
              </div>
               <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt}
                className="w-full flex justify-center items-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader />
                    Gerando...
                  </>
                ) : (
                 <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Adicionar ao Moodboard
                 </>
                )}
              </button>
              {error && !selectedItem && <p className="text-red-400 mt-4 text-center">{error}</p>}
            </div>
          </div>

          <div className="lg:col-span-2">
             <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg min-h-[50vh]">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">Meu Moodboard</h2>
              <MoodboardGrid 
                items={generatedItems} 
                isLoading={isLoading} 
                onItemClick={handleSelectItem}
                onItemDelete={handleDeleteItem}
              />
            </div>
          </div>
        </main>
      </div>
      {selectedItem && (
        <ImageModal 
          item={selectedItem}
          onClose={handleCloseModal}
          onGenerateVariation={handleGenerateVariation}
          isLoading={isEditingLoading}
          error={error}
          editPrompt={editPrompt}
          setEditPrompt={setEditPrompt}
        />
      )}
    </div>
  );
};

export default App;