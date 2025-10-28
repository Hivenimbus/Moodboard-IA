import type { GeneratedItem, BaseImage } from '../types';

if (!process.env.MINIMAX_API_KEY) {
    throw new Error("MINIMAX_API_KEY environment variable is not set.");
}

const MINIMAX_API_URL = "https://api.minimax.io/v1/image_generation";
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;

// Prompt principal simplificado para moodboard arquitetônico
const MOODBOARD_SYSTEM_PROMPT = `Crie um moodboard arquitetônico clean e elegante com poucos elementos bem selecionados. Focus em essencialidade e harmonia visual. Sem textos.`;

export const generateMoodboardItem = async (prompt: string, baseImage: BaseImage | null): Promise<GeneratedItem> => {
    try {
        let imageUrl: string;
        let base64Data: string;
        let mimeType: string;

        const headers = {
            "Authorization": `Bearer ${MINIMAX_API_KEY}`,
            "Content-Type": "application/json",
        };

        if (baseImage) {
            // Caso 1: Image-to-Image com imagem de referência
            const payload = {
                model: "image-01",
                prompt: `${MOODBOARD_SYSTEM_PROMPT} Use a referência visual como inspiração. Tema: ${prompt}`,
                aspect_ratio: "16:9",
                response_format: "base64",
                subject_reference: [
                    {
                        type: "character",
                        image_file: `data:${baseImage.mimeType};base64,${baseImage.data}`
                    }
                ]
            };

            const response = await fetch(MINIMAX_API_URL, {
                method: "POST",
                headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`MiniMax API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
            }

            const result = await response.json();

            if (!result.data?.image_base64 || result.data.image_base64.length === 0) {
                throw new Error('A edição da imagem falhou. A API não retornou nenhuma imagem.');
            }

            base64Data = result.data.image_base64[0];
            mimeType = 'image/jpeg'; // MiniMax geralmente retorna JPEG
            imageUrl = `data:${mimeType};base64,${base64Data}`;

        } else {
            // Caso 2: Text-to-Image do zero
            const payload = {
                model: "image-01",
                prompt: `${MOODBOARD_SYSTEM_PROMPT} Tema: ${prompt}`,
                aspect_ratio: "16:9",
                response_format: "base64",
            };

            const response = await fetch(MINIMAX_API_URL, {
                method: "POST",
                headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`MiniMax API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
            }

            const result = await response.json();

            if (!result.data?.image_base64 || result.data.image_base64.length === 0) {
                throw new Error('A geração da imagem falhou. A API não retornou nenhuma imagem.');
            }

            base64Data = result.data.image_base64[0];
            mimeType = 'image/jpeg';
            imageUrl = `data:${mimeType};base64,${base64Data}`;
        }

        return {
            id: crypto.randomUUID(),
            imageUrl,
            prompt,
            base64Data,
            mimeType,
        };

    } catch (error) {
        console.error('Error calling MiniMax API:', error);
        if (error instanceof Error) {
            if (error.message.includes('401')) {
                throw new Error("Chave da API MiniMax inválida. Verifique sua MINIMAX_API_KEY.");
            }
            if (error.message.includes('429') || error.message.includes('rate limit')) {
                throw new Error("Você excedeu o limite de solicitações da API MiniMax. Por favor, espere um momento antes de tentar novamente.");
            }
            if (error.message.includes('quota')) {
                throw new Error("Você excedeu sua cota da API MiniMax. Verifique seu plano ou adicione créditos.");
            }
            throw new Error(`Falha ao gerar imagem: ${error.message}`);
        }
        throw new Error('Ocorreu um erro desconhecido durante a geração da imagem.');
    }
};