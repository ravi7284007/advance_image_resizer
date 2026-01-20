'use client';

import { useState, useRef } from 'react';
import { useImageResizerSettings } from '../../hooks/useImageResizerSettings';
import { ProcessedImage } from '../../types';
import { addWatermark, hexToRgba, getPixelColor, getMostCommonColor } from '../../utils/imageProcessing';
import FileUpload from './FileUpload';
import ControlPanel from './ControlPanel';
import LivePreview from './LivePreview';

export default function ImageResizer() {
  const { settings, updateSettings, resetSettings } = useImageResizerSettings();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setStatus(`${files.length} image(s) selected. Click "Process Images" to start.`);
    setProcessedImages([]);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      resetSettings();
      setStatus('Settings reset to defaults!');
    }
  };

  const processImages = async () => {
    if (!selectedFiles.length) return;

    setIsProcessing(true);
    const processed: ProcessedImage[] = [];
    
    setStatus(`Processing ${selectedFiles.length} images...`);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setStatus(`Processing ${i + 1}/${selectedFiles.length}: ${file.name}`);
      
      const processedImage = await processImage(file);
      if (processedImage) {
        processed.push(processedImage);
        
        // Auto-download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(processedImage.blob);
        link.download = processedImage.filename;
        link.click();
      }
    }

    setProcessedImages(processed);
    setStatus(`All ${selectedFiles.length} images processed successfully! ✔`);
    setIsProcessing(false);
  };

  const processImage = (file: File): Promise<ProcessedImage | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          resolve(null);
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        const DPR = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
        const canvasWidth = settings.outputWidth;
        const canvasHeight = settings.outputHeight;
        
        canvas.width = canvasWidth * DPR;
        canvas.height = canvasHeight * DPR;
        canvas.style.width = canvasWidth + 'px';
        canvas.style.height = canvasHeight + 'px';
        ctx.scale(DPR, DPR);
        
        // Enhanced quality settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.textRenderingOptimization = 'optimizeQuality';
        ctx.antialias = 'subpixel';
        ctx.patternQuality = 'best';
        
        if (settings.removeBackground) {
          await drawImageWithoutBackground(img, ctx);
        } else {
          drawImageOnContext(img, ctx);
        }
        
        const format = settings.outputFormat;
        const mimeType = format === 'png' ? 'image/png' : format === 'jpeg' ? 'image/jpeg' : 'image/webp';
        const qualityValue = settings.quality / 100;

        canvas.toBlob((blob) => {
          if (blob) {
            const clean = file.name.replace(/\.[^/.]+$/, '');
            const filename = `${clean}_${canvasWidth}x${canvasHeight}.${format}`;
            resolve({ blob, filename });
          } else {
            resolve(null);
          }
          
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }, mimeType, qualityValue);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const drawImageWithoutBackground = async (img: HTMLImageElement, context: CanvasRenderingContext2D) => {
    const canvasWidth = settings.outputWidth;
    const canvasHeight = settings.outputHeight;
    
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Handle different background types
    if (settings.bgType === 'color') {
      context.fillStyle = settings.backgroundColor;
      context.fillRect(0, 0, canvasWidth, canvasHeight);
    } else if (settings.bgType === 'image' && settings.backgroundImage) {
      const bgImg = new Image();
      await new Promise((resolve) => {
        bgImg.onload = () => {
          context.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
          resolve(null);
        };
        bgImg.src = settings.backgroundImage!;
      });
    }
    
    // Create temp canvas for background removal
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    tempCtx.drawImage(img, 0, 0);
    
    const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    
    const tolerance = 30;
    const edgeColors = [];
    
    // Sample edge colors
    for (let x = 0; x < img.width; x++) {
      edgeColors.push(getPixelColor(data, x, 0, img.width));
      edgeColors.push(getPixelColor(data, x, img.height - 1, img.width));
    }
    for (let y = 0; y < img.height; y++) {
      edgeColors.push(getPixelColor(data, 0, y, img.width));
      edgeColors.push(getPixelColor(data, img.width - 1, y, img.width));
    }
    
    const bgColor = getMostCommonColor(edgeColors);
    
    // Remove background by making matching pixels transparent
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (Math.abs(r - bgColor.r) < tolerance &&
          Math.abs(g - bgColor.g) < tolerance &&
          Math.abs(b - bgColor.b) < tolerance) {
        data[i + 3] = 0;
      }
    }
    
    tempCtx.putImageData(imageData, 0, 0);
    
    // Calculate positioning for foreground image
    const ratio = img.width / img.height;
    let drawWidth: number, drawHeight: number;
    
    if (ratio > 1) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / ratio;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * ratio;
    }
    
    const x = (canvasWidth - drawWidth) / 2;
    const y = (canvasHeight - drawHeight) / 2;
    
    const bright = settings.brightness;
    const contr = settings.contrast;
    const sat = settings.saturation;
    context.filter = `brightness(${bright}%) contrast(${contr}%) saturate(${sat}%)`;
    
    context.drawImage(tempCanvas, x, y, drawWidth, drawHeight);
    context.filter = 'none';
    
    addWatermark(context, canvasWidth, canvasHeight, settings);
  };

  const drawImageOnContext = (img: HTMLImageElement, context: CanvasRenderingContext2D) => {
    const canvasWidth = settings.outputWidth;
    const canvasHeight = settings.outputHeight;
    
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Enhanced quality settings
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.textRenderingOptimization = 'optimizeQuality';

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

    let bgW: number, bgH: number;
    if (ratio > 1) {
      bgH = canvasHeight;
      bgW = canvasHeight * ratio;
    } else {
      bgW = canvasWidth;
      bgH = canvasWidth / ratio;
    }

    if (blur > 0) {
      context.filter = `blur(${blur}px) brightness(${bright}%) contrast(${contr}%) saturate(${sat}%)`;
      context.drawImage(img, (canvasWidth - bgW) / 2, (canvasHeight - bgH) / 2, bgW, bgH);
    }

    context.filter = 'none';
    if (opacity > 0) {
      context.fillStyle = hexToRgba(bgColor, opacity);
      context.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    let fgW: number, fgH: number;
    if (ratio > 1) {
      fgW = canvasWidth - border * 2;
      fgH = (canvasWidth - border * 2) / ratio;
    } else {
      fgH = canvasHeight - border * 2;
      fgW = (canvasHeight - border * 2) * ratio;
    }

    const x = (canvasWidth - fgW) / 2;
    const y = (canvasHeight - fgH) / 2;

    // Apply sharpening filter for better texture
    context.filter = `brightness(${bright}%) contrast(${contr + 5}%) saturate(${sat}%) contrast(1.1)`;
    context.drawImage(img, x, y, fgW, fgH);

    if (border > 0) {
      context.filter = 'none';
      context.strokeStyle = bColor;
      context.lineWidth = border;
      context.strokeRect(x - border / 2, y - border / 2, fgW + border, fgH + border);
    }

    context.filter = 'none';
    if (fade > 0) {
      const topGrad = context.createLinearGradient(0, y, 0, y + fade);
      topGrad.addColorStop(0, 'rgba(0,0,0,0.11)');
      topGrad.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = topGrad;
      context.fillRect(x, y, fgW, fade);

      const bottomGrad = context.createLinearGradient(0, y + fgH - fade, 0, y + fgH);
      bottomGrad.addColorStop(0, 'rgba(0,0,0,0)');
      bottomGrad.addColorStop(1, 'rgba(0,0,0,0.11)');
      context.fillStyle = bottomGrad;
      context.fillRect(x, y + fgH - fade, fgW, fade);
    }

    addWatermark(context, canvasWidth, canvasHeight, settings);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full p-10">
      <h2 className="text-gray-800 mb-2 text-3xl font-bold">Advanced Batch Image Resizer</h2>
      <p className="text-sm text-gray-600 mb-8">High-quality output with customizable effects</p>

      <FileUpload onFilesSelected={handleFilesSelected} disabled={isProcessing} />
      
      <ControlPanel 
        settings={settings} 
        onSettingsChange={updateSettings} 
        onReset={handleReset} 
      />

      <LivePreview 
        selectedFile={selectedFiles[0] || null} 
        settings={settings} 
      />

      <div className="text-center mb-6">
        <button
          onClick={processImages}
          disabled={!selectedFiles.length || isProcessing}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none py-4 px-8 rounded-lg text-lg font-semibold cursor-pointer transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mr-3"
        >
          {isProcessing ? 'Processing...' : 'Process Images'}
        </button>
      </div>

      {status && (
        <div className={`mt-5 p-3 rounded-lg text-sm font-medium ${
          status.includes('successfully') ? 'bg-green-100 text-green-800' :
          status.includes('Processing') ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {status}
        </div>
      )}

      {processedImages.length > 0 && (
        <div className="mt-5 flex justify-center gap-5 flex-wrap">
          {processedImages.map((img, index) => (
            <div key={index} className="text-center">
              <img
                src={URL.createObjectURL(img.blob)}
                alt={img.filename}
                className="max-w-[200px] max-h-[200px] rounded-lg shadow-lg"
              />
              <p className="mt-2 text-xs text-gray-600">{img.filename}</p>
            </div>
          ))}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      
      {/* Credit Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Created by{' '}
          <a 
            href="https://ravi-wt.netlify.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            Ravi
          </a>
        </p>
      </div>
    </div>
  );
}