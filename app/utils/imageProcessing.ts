import { ImageResizerSettings } from '../types';

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getPixelColor(data: Uint8ClampedArray, x: number, y: number, width: number) {
  const index = (y * width + x) * 4;
  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2]
  };
}

export function getMostCommonColor(colors: Array<{r: number, g: number, b: number}>) {
  const colorMap: Record<string, number> = {};
  
  colors.forEach(color => {
    const key = `${Math.floor(color.r / 10)},${Math.floor(color.g / 10)},${Math.floor(color.b / 10)}`;
    colorMap[key] = (colorMap[key] || 0) + 1;
  });
  
  let maxCount = 0;
  let mostCommon = null;
  
  for (const key in colorMap) {
    if (colorMap[key] > maxCount) {
      maxCount = colorMap[key];
      const parts = key.split(',');
      mostCommon = {
        r: parseInt(parts[0]) * 10,
        g: parseInt(parts[1]) * 10,
        b: parseInt(parts[2]) * 10
      };
    }
  }
  
  return mostCommon || { r: 255, g: 255, b: 255 };
}

export function addWatermark(
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  settings: ImageResizerSettings
) {
  const wmText = settings.watermarkText.trim();
  if (!wmText) return;

  const wmSize = settings.watermarkSize;
  const wmOpacity = settings.watermarkOpacity;
  const wmColor = settings.watermarkColor;
  const wmFont = settings.watermarkFont;
  const wmPos = settings.watermarkPosition;

  context.font = `bold ${wmSize}px ${wmFont}`;
  const wmRgba = hexToRgba(wmColor, wmOpacity);
  context.fillStyle = wmRgba;
  context.strokeStyle = `rgba(0, 0, 0, ${wmOpacity * 0.5})`;
  context.lineWidth = 2;

  if (wmPos === 'repeat') {
    const spacing = settings.repeatSpacing;
    const rotation = settings.repeatRotation;
    
    context.save();
    context.translate(canvasWidth / 2, canvasHeight / 2);
    context.rotate((rotation * Math.PI) / 180);
    context.translate(-canvasWidth / 2, -canvasHeight / 2);
    
    const cols = Math.ceil(canvasWidth / spacing) + 2;
    const rows = Math.ceil(canvasHeight / spacing) + 2;
    
    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const wmX = col * spacing;
        const wmY = row * spacing + wmSize;
        
        context.strokeText(wmText, wmX, wmY);
        context.fillText(wmText, wmX, wmY);
      }
    }
    
    context.restore();
  } else {
    let wmX: number, wmY: number;
    const padding = 30;

    switch(wmPos) {
      case 'bottom-center':
        context.textAlign = 'center';
        wmX = canvasWidth / 2;
        wmY = canvasHeight - padding;
        break;
      case 'bottom-right':
        context.textAlign = 'right';
        wmX = canvasWidth - padding;
        wmY = canvasHeight - padding;
        break;
      case 'bottom-left':
        context.textAlign = 'left';
        wmX = padding;
        wmY = canvasHeight - padding;
        break;
      case 'top-center':
        context.textAlign = 'center';
        wmX = canvasWidth / 2;
        wmY = padding + wmSize;
        break;
      case 'top-right':
        context.textAlign = 'right';
        wmX = canvasWidth - padding;
        wmY = padding + wmSize;
        break;
      case 'top-left':
        context.textAlign = 'left';
        wmX = padding;
        wmY = padding + wmSize;
        break;
      case 'center':
        context.textAlign = 'center';
        wmX = canvasWidth / 2;
        wmY = canvasHeight / 2;
        break;
    }

    context.strokeText(wmText, wmX, wmY);
    context.fillText(wmText, wmX, wmY);
  }
}