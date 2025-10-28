import type { GeneratedItem, BaseImage } from '../types';

if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set.");
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export const editImageWithOpenRouter = async (prompt: string, baseImage: BaseImage): Promise<GeneratedItem> => {
    try {
        const headers = {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://moodboard-ia.com",
            "X-Title": "Moodboard IA"
        };

        // Construir o payload para a API OpenRouter
        const payload = {
            model: "google/gemini-2.5-flash-image",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Edite esta imagem de moodboard arquitetônico: ${prompt}. Mantenha o estilo de moodboard com elementos visuais clean e elegantes, sem textos.`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${baseImage.mimeType};base64,${baseImage.data}`
                            }
                        }
                    ]
                }
            ],
            response_format: {
                type: "image",
                image: {
                    format: "jpeg",
                    quality: "high"
                }
            }
        };

        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const result = await response.json();

        // Debug: Log da resposta completa
        console.log('OpenRouter Response:', JSON.stringify(result, null, 2));

        // Extrair a imagem editada da resposta
        if (!result.choices || result.choices.length === 0) {
            throw new Error('A edição da imagem falhou. A API não retornou nenhuma opção.');
        }

        const choice = result.choices[0];

        // Verificar se há images array (formato correto da OpenRouter)
        let base64Data: string;
        let mimeType = 'image/png'; // OpenRouter geralmente retorna PNG

        if (choice.message?.images && choice.message.images.length > 0) {
            // Extrair do array de images
            const imageData = choice.message.images[0].image_url.url;
            const base64Match = imageData.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);

            if (base64Match) {
                base64Data = base64Match[1];
                // Extrair mimeType do data URL
                const mimeTypeMatch = imageData.match(/data:image\/([^;]+);/);
                if (mimeTypeMatch) {
                    mimeType = `image/${mimeTypeMatch[1]}`;
                }
            } else {
                throw new Error('Formato de imagem inválido no array de images.');
            }
        } else if (choice.message?.content) {
            // Fallback para formato antigo (content direto)
            if (typeof choice.message.content === 'string') {
                const base64Match = choice.message.content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);
                if (base64Match) {
                    base64Data = base64Match[1];
                    const mimeTypeMatch = choice.message.content.match(/data:image\/([^;]+);/);
                    if (mimeTypeMatch) {
                        mimeType = `image/${mimeTypeMatch[1]}`;
                    }
                } else {
                    base64Data = choice.message.content;
                }
            } else if (choice.message.content.url) {
                const urlMatch = choice.message.content.url.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);
                if (urlMatch) {
                    base64Data = urlMatch[1];
                    const mimeTypeMatch = choice.message.content.url.match(/data:image\/([^;]+);/);
                    if (mimeTypeMatch) {
                        mimeType = `image/${mimeTypeMatch[1]}`;
                    }
                } else {
                    throw new Error('Formato de imagem não suportado.');
                }
            }
        } else {
            throw new Error('A edição da imagem falhou. A API não retornou conteúdo ou imagens válidas.');
        }

        const imageUrl = `data:${mimeType};base64,${base64Data}`;

        return {
            id: crypto.randomUUID(),
            imageUrl,
            prompt,
            base64Data,
            mimeType,
        };

    } catch (error) {
        console.error('Error calling OpenRouter API:', error);
        if (error instanceof Error) {
            if (error.message.includes('401')) {
                throw new Error("Chave da API OpenRouter inválida. Verifique sua OPENROUTER_API_KEY.");
            }
            if (error.message.includes('429') || error.message.includes('rate limit')) {
                throw new Error("Você excedeu o limite de solicitações da API OpenRouter. Por favor, espere um momento antes de tentar novamente.");
            }
            if (error.message.includes('quota') || error.message.includes('credits')) {
                throw new Error("Você excedeu sua cota da API OpenRouter. Verifique seu plano ou adicione créditos.");
            }
            throw new Error(`Falha ao editar imagem: ${error.message}`);
        }
        throw new Error('Ocorreu um erro desconhecido durante a edição da imagem.');
    }
};