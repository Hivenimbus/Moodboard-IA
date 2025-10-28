import React, { useState, useRef } from 'react';
import type { BaseImage } from '../types';

interface ImageUploaderProps {
  onImageUpload: (image: BaseImage) => void;
  onImageClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onImageClear }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        if (base64String) {
          setPreview(reader.result as string);
          onImageUpload({ data: base64String, mimeType: file.type });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageClear();
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <div
        onClick={handleClick}
        className="cursor-pointer border-2 border-dashed border-slate-600 hover:border-teal-400 transition-colors duration-300 rounded-lg p-6 text-center bg-slate-800/50"
      >
        {preview ? (
          <div className="relative group">
            <img src={preview} alt="Pré-visualização da imagem" className="mx-auto max-h-48 rounded-md object-contain" />
            <button 
              onClick={handleClearImage}
              className="absolute top-1 right-1 bg-slate-900/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500"
              aria-label="Remover imagem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="text-slate-400 flex flex-col items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
            <p className="font-semibold">Clique para enviar uma imagem</p>
            <p className="text-sm">PNG, JPG, ou WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};