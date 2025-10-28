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

### Passo 1: Configure as Variáveis de Ambiente no Vercel

**IMPORTANTE:** Configure as variáveis de ambiente **ANTES** de fazer o deploy para evitar erros.

1. Acesse o painel do Vercel: https://vercel.com/dashboard
2. Vá para "Settings" → "Environment Variables" do seu projeto
3. Adicione as seguintes variáveis:

**Variável Obrigatória:**
- `VITE_GEMINI_API_KEY`: Sua Gemini API key (obtida em https://makersuite.google.com/app/apikey)

**Variáveis Opcionais (para outras APIs):**
- `VITE_OPENAI_API_KEY`: Sua OpenAI API key
- `VITE_MINIMAX_API_KEY`: Sua Minimax API key
- `VITE_MINIMAX_GROUP_ID`: Seu Minimax Group ID
- `VITE_AZURE_OPENAI_API_KEY`: Sua Azure OpenAI API key
- `VITE_AZURE_OPENAI_ENDPOINT`: Seu Azure OpenAI endpoint
- `VITE_AZURE_OPENAI_DEPLOYMENT`: Seu Azure OpenAI deployment name

**Nota:** Use exatamente os nomes acima, incluindo o prefixo `VITE_`

### Passo 2: Faça o Deploy

1. Conecte seu repositório GitHub ao Vercel
2. O Vercel irá detectar automaticamente que é um projeto Vite
3. Clique em "Deploy"
4. Aguarde o build completar

### Passo 3: Verifique o Deploy

Após o deploy, verifique se:
- A aplicação carrega corretamente (sem tela azul apenas)
- Todas as funcionalidades de IA estão operacionais
- Não há erros no console do navegador

### Passo 4: Configure o Domínio (Opcional)

- Adicione seu domínio personalizado em "Settings" → "Domains"
- Configure o DNS conforme instruções do Vercel

### Troubleshooting

**Erro de variáveis de ambiente:**
- Verifique se as variáveis foram adicionadas **ANTES** do deploy
- Confirme os nomes exatos das variáveis (incluindo `VITE_`)
- Faça um novo deploy após configurar as variáveis

**Tela azul/interface não carrega:**
- Verifique o console do navegador por erros JavaScript
- Confirme se as variáveis de ambiente estão corretas
- Verifique os logs de build no painel do Vercel
