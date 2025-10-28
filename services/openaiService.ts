import type { GeneratedItem, BaseImage } from '../types';

if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set.");
}

const OPENAI_API_URL = "https://api.openai.com/v1/images/generations";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Prompt principal para moodboard arquitetônico (reutilizado do MiniMax)
const MOODBOARD_SYSTEM_PROMPT = `Crie um moodboard arquitetônico. Seja fiel ao estilo arquitetônico solicitado, incluindo materiais, cores e formas típicas. Represente autenticamente a essência deste estilo. Sem textos.`;

export const generateImageWithOpenAI = async (prompt: string): Promise<GeneratedItem> => {
    try {
        const headers = {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        };

        const payload = {
            model: "gpt-image-1-mini", // Modelo solicitado
            prompt: `${MOODBOARD_SYSTEM_PROMPT} Tema: ${prompt}`,
            size: "1024x1024",
            quality: "low",
            n: 1,
        };

        const response = await fetch(OPENAI_API_URL, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const result = await response.json();

        // Debug: Log da resposta
        console.log('OpenAI Response:', JSON.stringify(result, null, 2));

        if (!result.data || result.data.length === 0) {
            throw new Error('A geração da imagem falhou. A API não retornou nenhuma imagem.');
        }

        const imageData = result.data[0];

        if (!imageData.b64_json) {
            throw new Error('A geração da imagem falhou. A API não retornou dados base64.');
        }

        const base64Data = imageData.b64_json;
        const mimeType = 'image/png'; // OpenAI retorna PNG conforme output_format
        const imageUrl = `data:${mimeType};base64,${base64Data}`;

        return {
            id: crypto.randomUUID(),
            imageUrl,
            prompt,
            base64Data,
            mimeType,
        };

    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        if (error instanceof Error) {
            if (error.message.includes('401')) {
                throw new Error("Chave da API OpenAI inválida. Verifique sua OPENAI_API_KEY.");
            }
            if (error.message.includes('429') || error.message.includes('rate limit')) {
                throw new Error("Você excedeu o limite de solicitações da API OpenAI. Por favor, espere um momento antes de tentar novamente.");
            }
            if (error.message.includes('quota') || error.message.includes('insufficient_quota')) {
                throw new Error("Você excedeu sua cota da API OpenAI. Verifique seu plano ou adicione créditos.");
            }
            if (error.message.includes('content_policy_violation')) {
                throw new Error("A solicitação foi recusada por violar a política de conteúdo da OpenAI. Tente um prompt diferente.");
            }
            throw new Error(`Falha ao gerar imagem: ${error.message}`);
        }
        throw new Error('Ocorreu um erro desconhecido durante a geração da imagem.');
    }
};