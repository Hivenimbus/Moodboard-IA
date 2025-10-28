<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1t7eq0p546jsOFAOQib_oOtlz-TqbX_Ua

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy no Vercel

**Prerequisites:** Conta no Vercel

1. Configure as variáveis de ambiente no painel do Vercel:
   - `VITE_GEMINI_API_KEY`: Sua Gemini API key
   - `VITE_OPENAI_API_KEY`: Sua OpenAI API key (opcional)
   - `VITE_MINIMAX_API_KEY`: Sua Minimax API key (opcional)
   - `VITE_MINIMAX_GROUP_ID`: Seu Minimax Group ID (opcional)
   - `VITE_AZURE_OPENAI_API_KEY`: Sua Azure OpenAI API key (opcional)
   - `VITE_AZURE_OPENAI_ENDPOINT`: Seu Azure OpenAI endpoint (opcional)
   - `VITE_AZURE_OPENAI_DEPLOYMENT`: Seu Azure OpenAI deployment name (opcional)

2. Faça o deploy:
   - Conecte seu repositório ao Vercel
   - O Vercel irá detectar automaticamente o framework Vite
   - O build será executado automaticamente

3. Configure o domínio (opcional):
   - Adicione seu domínio personalizado nas configurações do projeto Vercel

**Nota importante:** O arquivo `vercel.json` está configurado para mapear as variáveis de ambiente do Vercel para as variáveis usadas no aplicativo.
