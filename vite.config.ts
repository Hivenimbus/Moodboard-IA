import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
        'process.env.MINIMAX_API_KEY': JSON.stringify(env.VITE_MINIMAX_API_KEY || env.MINIMAX_API_KEY),
        'process.env.MINIMAX_GROUP_ID': JSON.stringify(env.VITE_MINIMAX_GROUP_ID || env.MINIMAX_GROUP_ID),
        'process.env.OPENROUTER_API_KEY': JSON.stringify(env.VITE_OPENROUTER_API_KEY || env.OPENROUTER_API_KEY),
        'process.env.OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY || env.OPENAI_API_KEY),
        'process.env.AZURE_OPENAI_API_KEY': JSON.stringify(env.VITE_AZURE_OPENAI_API_KEY || env.AZURE_OPENAI_API_KEY),
        'process.env.AZURE_OPENAI_ENDPOINT': JSON.stringify(env.VITE_AZURE_OPENAI_ENDPOINT || env.AZURE_OPENAI_ENDPOINT),
        'process.env.AZURE_OPENAI_DEPLOYMENT': JSON.stringify(env.VITE_AZURE_OPENAI_DEPLOYMENT || env.AZURE_OPENAI_DEPLOYMENT)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
