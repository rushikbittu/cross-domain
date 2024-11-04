import { datasets } from './datasetConfig';

// Simulated delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Example dataset images (replace these with your actual dataset paths)
const mockDatasetImages = {
  drone: [
    '/path/to/your/drone/dataset/image1.jpg',
    '/path/to/your/drone/dataset/image2.jpg',
  ],
  satellite: [
    '/path/to/your/satellite/dataset/image1.tiff',
    '/path/to/your/satellite/dataset/image2.tiff',
  ],
  coco: [
    '/path/to/your/coco/dataset/image1.jpg',
    '/path/to/your/coco/dataset/image2.jpg',
  ],
};

export interface SearchResult {
  id: string;
  url: string;
  source: 'drone' | 'satellite' | 'coco';
  similarity: number;
}

// Mock search function
export const mockSearch = async (prompt: string): Promise<SearchResult[]> => {
  await delay(1500); // Simulate API delay
  
  // In a real implementation, this would:
  // 1. Process the prompt using your ML model
  // 2. Search through your indexed datasets
  // 3. Return matching images with similarity scores
  
  return [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1508138221679-760a23a2285b',
      source: 'drone',
      similarity: 0.89
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999',
      source: 'satellite',
      similarity: 0.78
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1516900557549-41557d405adf',
      source: 'coco',
      similarity: 0.92
    },
  ];
};