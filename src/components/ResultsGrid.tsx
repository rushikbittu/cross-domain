import React from 'react';
import { Loader } from 'lucide-react';

interface ResultsGridProps {
  results: string[];
  loading: boolean;
}

export default function ResultsGrid({ results, loading }: ResultsGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((imageUrl, index) => (
        <div
          key={index}
          className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <img
            src={imageUrl}
            alt={`Result ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}