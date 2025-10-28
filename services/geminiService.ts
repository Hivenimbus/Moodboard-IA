import { GoogleGenAI, Modality } from "@google/genai";
import type { GeneratedItem, BaseImage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const editModel = 'gemini-2.5-flash-image-preview';
const creationModel = 'imagen-4.0-generate-001';

export const generateMoodboardItem = async (prompt: string, baseImage: BaseImage | null): Promise<GeneratedItem> => {
  try {
    let imageUrl: string;
    let base64Data: string;
    let mimeType: string;

    if (baseImage) {
      // Caso 1: Edição de Imagem com Nano Banana
      const parts = [
        {
          inlineData: {
            data: baseImage.data,
            mimeType: baseImage.mimeType,
          },
        },
        { text: prompt },
      ];

      const response = await ai.models.generateContent({
          model: editModel,
          contents: {
            parts: parts,
          },
          config: {
              responseModalities: [Modality.IMAGE, Modality.TEXT],
              systemInstruction: "You are an AI image editing tool. Modify the user's image based on their text prompt. Only output the edited image. Do not output any conversational text.",
          },
      });
      
      if (!response.candidates || response.candidates.length === 0) {
        const blockReason = response.promptFeedback?.blockReason;
        if (blockReason) {
            throw new Error(`A edição da imagem falhou devido a filtros de segurança: ${blockReason}`);
        }
        throw new Error('A edição da imagem falhou. A API não retornou nenhum candidato.');
      }

      const imagePart = response.candidates[0].content.parts.find(part => part.inlineData);

      if (!imagePart?.inlineData) {
          console.error('API response did not contain an image part:', JSON.stringify(response.candidates[0], null, 2));
          throw new Error('A edição da imagem falhou. A API não retornou uma imagem.');
      }
      
      base64Data = imagePart.inlineData.data;
      mimeType = imagePart.inlineData.mimeType;
      imageUrl = `data:${mimeType};base64,${base64Data}`;

    } else {
      // Caso 2: Geração de Imagem do zero com Imagen
      const response = await ai.models.generateImages({
        model: creationModel,
        prompt: `Crie uma imagem de moodboard arquitetônico de: ${prompt}`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
        },
      });

      if (!response.generatedImages || response.generatedImages.length === 0) {
          throw new Error('A geração da imagem falhou. A API não retornou nenhuma imagem.');
      }

      base64Data = response.generatedImages[0].image.imageBytes;
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
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')) {
            throw new Error("Você excedeu o limite de solicitações da API. Por favor, espere um momento antes de tentar novamente ou verifique sua cota na Plataforma Google AI.");
        }
        throw new Error(`Falha ao gerar imagem: ${error.message}`);
    }
    throw new Error('Ocorreu um erro desconhecido durante a geração da imagem.');
  }
};