export interface ImageResizerSettings {
  outputWidth: number;
  outputHeight: number;
  removeBackground: boolean;
  bgType: 'transparent' | 'color' | 'image';
  backgroundColor: string;
  backgroundImage: string | null;
  blurIntensity: number;
  fadeEffect: number;
  overlayOpacity: number;
  overlayColor: string;
  outputFormat: 'png' | 'jpeg' | 'webp';
  quality: number;
  watermarkText: string;
  watermarkPosition: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left' | 'center' | 'repeat';
  watermarkSize: number;
  watermarkOpacity: number;
  watermarkColor: string;
  watermarkFont: string;
  repeatSpacing: number;
  repeatRotation: number;
  borderWidth: number;
  borderColor: string;
  brightness: number;
  contrast: number;
  saturation: number;
}

export interface ProcessedImage {
  blob: Blob;
  filename: string;
}