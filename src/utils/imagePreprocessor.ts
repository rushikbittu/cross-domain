import * as tf from '@tensorflow/tfjs';
import Tiff from 'tiff.js';

export class ImagePreprocessor {
  async preprocessImage(
    input: Blob | File | string,
    targetSize = { width: 224, height: 224 }
  ): Promise<ImageData> {
    let imageData: ImageData;

    if (input instanceof Blob || input instanceof File) {
      const extension = this.getFileExtension(input.name).toLowerCase();
      
      if (extension === 'tiff' || extension === 'tif') {
        imageData = await this.processTiff(input);
      } else {
        imageData = await this.processStandardImage(input);
      }
    } else {
      // URL string
      const response = await fetch(input);
      const blob = await response.blob();
      imageData = await this.processStandardImage(blob);
    }

    return this.resizeImage(imageData, targetSize);
  }

  private async processTiff(input: Blob): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const tiff = new Tiff({ buffer: reader.result as ArrayBuffer });
          const canvas = tiff.toCanvas();
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Could not get canvas context');
          resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(input);
    });
  }

  private async processStandardImage(input: Blob): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(ctx.getImageData(0, 0, img.width, img.height));
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(input);
    });
  }

  private async resizeImage(
    imageData: ImageData,
    targetSize: { width: number; height: number }
  ): Promise<ImageData> {
    const tensor = tf.browser.fromPixels(imageData)
      .resizeBilinear([targetSize.height, targetSize.width]);
    
    const canvas = document.createElement('canvas');
    canvas.width = targetSize.width;
    canvas.height = targetSize.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    await tf.browser.toPixels(tensor, canvas);
    tensor.dispose();

    return ctx.getImageData(0, 0, targetSize.width, targetSize.height);
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop() || '';
  }
}