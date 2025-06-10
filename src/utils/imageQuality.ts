
import * as tf from '@tensorflow/tfjs';

export interface ImageQualityResult {
  isAcceptable: boolean;
  issues: string[];
  score: number;
}

export const analyzeImageQuality = async (imageFile: File): Promise<ImageQualityResult> => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      if (!ctx) {
        resolve({
          isAcceptable: false,
          issues: ['Unable to process image'],
          score: 0
        });
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Check for darkness
      const brightness = calculateBrightness(pixels);
      const blurriness = calculateBlurriness(pixels, canvas.width, canvas.height);
      
      const issues: string[] = [];
      let score = 100;

      // Check if image is too dark
      if (brightness < 50) {
        issues.push('Image is too dark, please take photo in better lighting');
        score -= 30;
      }

      // Check if image is too blurry
      if (blurriness < 15) {
        issues.push('Image appears blurry, please ensure camera is steady and focused');
        score -= 25;
      }

      // Check image resolution
      if (canvas.width < 400 || canvas.height < 400) {
        issues.push('Image resolution is too low, please use higher quality camera settings');
        score -= 20;
      }

      // Check for very small file size (might indicate poor quality)
      if (imageFile.size < 50000) { // Less than 50KB
        issues.push('Image file size is very small, this might indicate poor quality');
        score -= 15;
      }

      const isAcceptable = issues.length === 0 && score >= 70;

      resolve({
        isAcceptable,
        issues,
        score: Math.max(0, score)
      });
    };

    img.onerror = () => {
      resolve({
        isAcceptable: false,
        issues: ['Unable to load image file'],
        score: 0
      });
    };

    img.src = URL.createObjectURL(imageFile);
  });
};

const calculateBrightness = (pixels: Uint8ClampedArray): number => {
  let totalBrightness = 0;
  const pixelCount = pixels.length / 4;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    // Calculate perceived brightness
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
    totalBrightness += brightness;
  }

  return totalBrightness / pixelCount;
};

const calculateBlurriness = (pixels: Uint8ClampedArray, width: number, height: number): number => {
  // Simple edge detection for blur estimation
  let edgeSum = 0;
  let edgeCount = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4;
      
      // Convert to grayscale
      const current = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
      const right = 0.299 * pixels[i + 4] + 0.587 * pixels[i + 5] + 0.114 * pixels[i + 6];
      const down = 0.299 * pixels[i + width * 4] + 0.587 * pixels[i + width * 4 + 1] + 0.114 * pixels[i + width * 4 + 2];
      
      // Calculate edge strength
      const edgeX = Math.abs(current - right);
      const edgeY = Math.abs(current - down);
      const edge = Math.sqrt(edgeX * edgeX + edgeY * edgeY);
      
      edgeSum += edge;
      edgeCount++;
    }
  }

  return edgeCount > 0 ? edgeSum / edgeCount : 0;
};

export const checkForDuplicateImage = async (newImageFile: File, existingImages: File[]): Promise<boolean> => {
  // Simple duplicate detection based on file size and basic hash
  const newImageSize = newImageFile.size;
  const sizeTolerance = 1000; // 1KB tolerance

  for (const existingImage of existingImages) {
    if (Math.abs(existingImage.size - newImageSize) < sizeTolerance) {
      // Additional check could be implemented here for more sophisticated duplicate detection
      return true;
    }
  }

  return false;
};
