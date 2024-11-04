import { ClipProcessor } from './clipProcessor';
import { ImagePreprocessor } from './imagePreprocessor';
import { Dataset } from './datasetConfig';
import * as tf from '@tensorflow/tfjs';

interface ProcessedImage {
  id: string;
  embedding: Float32Array;
  metadata: {
    path: string;
    type: string;
    size: number;
  };
}

export class ImageProcessor {
  private clipProcessor: ClipProcessor;
  private imagePreprocessor: ImagePreprocessor;
  private processedImages: Map<string, ProcessedImage> = new Map();
  private batchSize = 32;

  constructor() {
    this.clipProcessor = new ClipProcessor();
    this.imagePreprocessor = new ImagePreprocessor();
  }

  async initialize() {
    await this.clipProcessor.initialize();
    await tf.ready();
    console.log('Image processor initialized');
  }

  async processDataset(dataset: Dataset) {
    console.log(`Processing dataset: ${dataset.name}`);
    const images = await this.loadImagesFromDataset(dataset);
    
    // Process images in batches
    const batches = this.createBatches(images, this.batchSize);
    let processedCount = 0;

    for (const batch of batches) {
      const preprocessedBatch = await Promise.all(
        batch.map(async (image) => ({
          id: image.id,
          data: await this.imagePreprocessor.preprocessImage(image.path)
        }))
      );

      const batchEmbeddings = await this.clipProcessor.processBatch(preprocessedBatch);
      
      batchEmbeddings.forEach((embedding, id) => {
        const image = images.find(img => img.id === id);
        if (image) {
          this.processedImages.set(id, {
            id,
            embedding,
            metadata: {
              path: image.path,
              type: dataset.type,
              size: embedding.length
            }
          });
        }
      });

      processedCount += batch.length;
      console.log(`Processed ${processedCount}/${images.length} images`);
    }
  }

  async searchSimilarImages(query: string, topK: number = 5): Promise<Array<{ id: string; similarity: number }>> {
    const queryEmbedding = await this.clipProcessor.textToEmbedding(query);
    
    const similarities = Array.from(this.processedImages.values()).map(image => ({
      id: image.id,
      similarity: this.cosineSimilarity(queryEmbedding, image.embedding)
    }));

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  private async loadImagesFromDataset(dataset: Dataset) {
    // Implementation depends on your dataset structure
    // This is a placeholder that should be implemented based on your data
    return [];
  }

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  private cosineSimilarity(a: Float32Array, b: Float32Array): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}