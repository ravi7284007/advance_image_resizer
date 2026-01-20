'use client';

import { useEffect, useRef } from 'react';
import { ImageResizerSettings } from '../../types';
import { addWatermark, hexToRgba } from '../../utils/imageProcessing';

interface LivePreviewProps {
  selectedFile: File | null;
  settings: ImageResizerSettings;
}

export default function LivePreview({ selectedFile, settings }: LivePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!selectedFile || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      drawPreview(img);
    };
    img.src = URL.createObjectURL(selectedFile);

    return () => {
      URL.revokeObjectURL(img.src);
    };
  }, [selectedFile, settings]);

  const drawPreview = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DPR = window.devicePixelRatio || 1;
    const canvasSize = Math.max(settings.outputWidth, settings.outputHeight);
    
    canvas.width = canvasSize * DPR;
    canvas.height = canvasSize * DPR;
    canvas.style.width = '300px';
    canvas.style.height = '300px';
    ctx.scale(DPR, DPR);

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const ratio = img.width / img.height;
    const blur = settings.blurIntensity;
    const fade = settings.fadeEffect;
    const opacity = settings.overlayOpacity;
    const bgColor = settings.overlayColor;
    const border = settings.borderWidth;
    const bColor = settings.borderColor;
    const bright = settings.brightness;
    const contr = settings.contrast;
    const sat = settings.saturation;

    // Background blur
    let bgW: number, bgH: number;
    if (ratio > 1) {
      bgH = canvasSize;
      bgW = canvasSize * ratio;
    } else {
      bgW = canvasSize;
      bgH = canvasSize / ratio;
    }

    if (blur > 0) {
      ctx.filter = `blur(${blur}px) brightness(${bright}%) contrast(${contr}%) saturate(${sat}%)`;
      ctx.drawImage(img, (canvasSize - bgW) / 2, (canvasSize - bgH) / 2, bgW, bgH);
    }

    ctx.filter = 'none';
    if (opacity > 0) {
      ctx.fillStyle = hexToRgba(bgColor, opacity);
      ctx.fillRect(0, 0, canvasSize, canvasSize);
    }

    // Foreground image
    let fgW: number, fgH: number;
    if (ratio > 1) {
      fgW = canvasSize - border * 2;
      fgH = (canvasSize - border * 2) / ratio;
    } else {
      fgH = canvasSize - border * 2;
      fgW = (canvasSize - border * 2) * ratio;
    }

    const x = (canvasSize - fgW) / 2;
    const y = (canvasSize - fgH) / 2;

    ctx.filter = `brightness(${bright}%) contrast(${contr}%) saturate(${sat}%)`;
    ctx.drawImage(img, x, y, fgW, fgH);

    if (border > 0) {
      ctx.filter = 'none';
      ctx.strokeStyle = bColor;
      ctx.lineWidth = border;
      ctx.strokeRect(x - border / 2, y - border / 2, fgW + border, fgH + border);
    }

    ctx.filter = 'none';
    if (fade > 0) {
      const topGrad = ctx.createLinearGradient(0, y, 0, y + fade);
      topGrad.addColorStop(0, 'rgba(0,0,0,0.11)');
      topGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(x, y, fgW, fade);

      const bottomGrad = ctx.createLinearGradient(0, y + fgH - fade, 0, y + fgH);
      bottomGrad.addColorStop(0, 'rgba(0,0,0,0)');
      bottomGrad.addColorStop(1, 'rgba(0,0,0,0.11)');
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(x, y + fgH - fade, fgW, fade);
    }

    addWatermark(ctx, canvasSize, canvasSize, settings);
  };

  if (!selectedFile) {
    return (
      <div className="mb-6 p-5 bg-blue-50 rounded-xl border-2 border-blue-200">
        <h3 className="text-blue-600 mb-4 text-lg font-semibold">🔍 Live Preview</h3>
        <div className="text-center text-gray-500 italic py-10">
          Upload an image and adjust settings to see live preview
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-5 bg-blue-50 rounded-xl border-2 border-blue-200">
      <h3 className="text-blue-600 mb-4 text-lg font-semibold">🔍 Live Preview</h3>
      <div className="flex justify-center gap-5 flex-wrap">
        <div className="text-center">
          <h4 className="text-sm text-gray-700 mb-2 font-medium">Original</h4>
          <img
            ref={originalImageRef}
            src={URL.createObjectURL(selectedFile)}
            alt="Original"
            className="max-w-[300px] max-h-[300px] rounded-lg shadow-lg bg-white"
          />
        </div>
        <div className="text-center">
          <h4 className="text-sm text-gray-700 mb-2 font-medium">Preview with Effects</h4>
          <canvas
            ref={canvasRef}
            className="max-w-[300px] max-h-[300px] rounded-lg shadow-lg bg-white"
          />
        </div>
      </div>
    </div>
  );
}