import React from 'react';

type ModelType = 'minimax' | 'openai';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  disabled?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  disabled = false
}) => {
  const models = [
    {
      id: 'minimax' as ModelType,
      name: 'MiniMax Image-01',
      description: 'Rápido e econômico',
      color: 'bg-blue-500'
    },
    {
      id: 'openai' as ModelType,
      name: 'DALL-E 3',
      description: 'Alta qualidade e detalhe',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-teal-400 mb-3">3. Escolha o Modelo de IA</h3>

      <div className="grid grid-cols-1 gap-3">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => onModelChange(model.id)}
            disabled={disabled}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-300 text-left
              ${selectedModel === model.id
                ? `${model.color} bg-opacity-20 border-${model.color === 'bg-blue-500' ? 'blue' : 'green'}-400 shadow-lg`
                : 'bg-slate-700 border-slate-600 hover:border-slate-500'
              }
              ${disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:shadow-md transform hover:scale-[1.02]'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full ${model.color}`} />
                  <h4 className="font-semibold text-white">{model.name}</h4>
                </div>
                <p className="text-sm text-slate-300">{model.description}</p>
              </div>

              {selectedModel === model.id && (
                <div className="ml-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-3 p-3 bg-slate-700 rounded-lg">
        <p className="text-xs text-slate-400">
          <span className="font-semibold">Dica:</span> Experimente ambos os modelos para ver qual gera o estilo que prefere para seu moodboard.
        </p>
      </div>
    </div>
  );
};