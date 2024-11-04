import { datasets, Dataset } from './datasetConfig';
import { ImageProcessor } from './imageProcessor';
import * as fs from 'fs';
import * as path from 'path';

interface ImageMetadata {
  id: string;
  path: string;
  type: Dataset['type'];
  annotations?: any[];
}

export class DatasetLoader {
  private imageIndex: Map<string, ImageMetadata> = new Map();
  private imageProcessor: ImageProcessor;
  
  constructor() {
    this.imageProcessor = new ImageProcessor();
  }

  async initialize() {
    await this.imageProcessor.initialize();
    
    for (const dataset of Object.values(datasets)) {
      await this.loadDataset(dataset);
    }
    
    console.log(`Loaded ${this.imageIndex.size} images from all datasets`);
  }

  private async loadDataset(dataset: Dataset) {
    try {
      const files = await this.getDatasetFiles(dataset);
      
      for (const file of files) {
        const id = path.basename(file, path.extname(file));
        const metadata: ImageMetadata = {
          id,
          path: file,
          type: dataset.type
        };

        if (dataset.type === 'coco') {
          metadata.annotations = await this.loadCocoAnnotations(file);
        }

        this.imageIndex.set(id, metadata);
      }

      // Process images with ML model
      await this.imageProcessor.processDataset(dataset);
      
    } catch (error) {
      console.error(`Error loading dataset ${dataset.name}:`, error);
    }
  }

  private async getDatasetFiles(dataset: Dataset): Promise<string[]> {
    const files: string[] = [];
    const validExtensions = new Set(dataset.format);

    try {
      const entries = await fs.promises.readdir(dataset.path, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase().slice(1);
          if (validExtensions.has(ext)) {
            files.push(path.join(dataset.path, entry.name));
          }
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dataset.path}:`, error);
    }

    return files;
  }

  private async loadCocoAnnotations(imagePath: string): Promise<any[]> {
    const annotationPath = imagePath.replace(/\.[^/.]+$/, '.json');
    try {
      const data = await fs.promises.readFile(annotationPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async searchImages(query: string): Promise<ImageMetadata[]> {
    const results = await this.imageProcessor.findSimilarImages(query);
    return results.map(result => {
      const metadata = this.imageIndex.get(path.basename(result.path, path.extname(result.path)));
      return {
        ...metadata!,
        similarity: result.similarity
      };
    });
  }
}