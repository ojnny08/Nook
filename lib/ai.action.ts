import puter from "@heyputer/puter.js";
import { NOOK_RENDER_PROMPT } from "./consstants";

export const fetchUrlAsData = async (url: string): Promise<string | null> => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to getch image ${response.statusText}`);
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    })
}

export const generate3DView = async ({ sourceImage }: Generate3DViewParams) => {
    const dataUrl = sourceImage.startsWith("data:")
        ? sourceImage
        : await fetchUrlAsData(sourceImage);

    const base64Data = dataUrl?.split(',')[1];
    const mimeType = dataUrl?.split(';')[0].split(':')[1];

    if (!mimeType || !base64Data) throw new Error("Invalid source image");

    const response = await puter.ai.txt2img(NOOK_RENDER_PROMPT, {
        provider: 'gemini',
        model: 'gemini-2.5-flash-image-preview',
        input_image: base64Data,
        test_mode: true,
        input_image_mime_type: mimeType,
        ratio: { w: 1024, h: 1024}
    });

    const rawImageUrl = (response as HTMLImageElement).src ?? null;

    if (!rawImageUrl) return { renderedImage: null, renderedPath: null };

    const renderedImage = rawImageUrl.startsWith("data:")
        ? rawImageUrl 
        : await fetchUrlAsData(rawImageUrl);
    
        return { renderedImage, renderedPath: undefined };
}
