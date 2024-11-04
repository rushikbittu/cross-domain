import { useState, useCallback } from 'react';
import { datasetLoader } from '../utils/datasetLoader';

export function useImageSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchImages = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await datasetLoader.searchImages(query);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during search');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    searchImages
  };
}