import type { ImageEnhancement } from "@shared/schema";

export async function applyImageEnhancements(
  imageUrl: string, 
  enhancements: ImageEnhancement
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (!ctx) {
        resolve(imageUrl);
        return;
      }
      
      // Apply brightness adjustment
      if (enhancements.brightness !== 0) {
        ctx.filter = `brightness(${100 + enhancements.brightness}%)`;
      }
      
      ctx.drawImage(img, 0, 0);
      
      // Get image data for pixel-level adjustments
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Apply contrast, saturation, and exposure adjustments
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        // Apply contrast
        if (enhancements.contrast !== 0) {
          const factor = (259 * (enhancements.contrast + 255)) / (255 * (259 - enhancements.contrast));
          r = Math.max(0, Math.min(255, factor * (r - 128) + 128));
          g = Math.max(0, Math.min(255, factor * (g - 128) + 128));
          b = Math.max(0, Math.min(255, factor * (b - 128) + 128));
        }
        
        // Apply saturation
        if (enhancements.saturation !== 0) {
          const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
          const saturationFactor = 1 + (enhancements.saturation / 100);
          r = Math.max(0, Math.min(255, gray + saturationFactor * (r - gray)));
          g = Math.max(0, Math.min(255, gray + saturationFactor * (g - gray)));
          b = Math.max(0, Math.min(255, gray + saturationFactor * (b - gray)));
        }
        
        // Apply exposure (simplified)
        if (enhancements.exposure !== 0) {
          const exposureFactor = Math.pow(2, enhancements.exposure / 100);
          r = Math.max(0, Math.min(255, r * exposureFactor));
          g = Math.max(0, Math.min(255, g * exposureFactor));
          b = Math.max(0, Math.min(255, b * exposureFactor));
        }
        
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }
      
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };
    
    img.src = imageUrl;
  });
}

export function downloadCanvasImage(imageUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = imageUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const { width, height } = img;
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        } else {
          resolve(file);
        }
      }, file.type);
    };
    
    img.src = URL.createObjectURL(file);
  });
}
