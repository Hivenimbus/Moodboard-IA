export interface GeneratedItem {
  id: string;
  imageUrl: string;
  prompt: string;
  base64Data: string;
  mimeType: string;
}

export interface BaseImage {
  data: string;
  mimeType: string;
}