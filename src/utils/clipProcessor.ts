import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;

export class ClipProcessor {
  private clipPipeline: any = null;
  private batchSize = 32;

  async initialize() {
    this.clipPipeline = await pipeline('feature-extraction', 'Xenova/clip-vit-base-patch32');
    console.log('CLIP model loaded');
  }

  async textToEmbedding(text: string): Promise<Float32Array> {
    if (!this.clipPipeline) {
      throw new Error('CLIP model not initialized');
    }

    const output = await this.clipPipeline(text, {
      pooling: 'mean',
      normalize: true,
    });

    return new Float32Array(output.data);
  }

  async imageToEmbedding(imageData: ImageData): Promise<Float32Array> {
    if (!this.clipPipeline) {
      throw new Error('CLIP model not initialized');
    }

    const output = await this.clipPipeline(imageData, {
      pooling: 'mean',
      normalize: true,
    });

    return new Float32Array(output.data);
  }

  async processBatch(items: Array<{ id: string; data: ImageData }>) {
    const batches = this.createBatches(items, this.batchSize);
    const results = new Map<string, Float32Array>();

    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(async (item) => ({
          id: item.id,
          embedding: await this.imageToEmbedding(item.data),
        }))
      );

      batchResults.forEach(({ id, embedding }) => {
        results.set(id, embedding);
      });
    }

    return results;
  }

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }
}