import React from 'react';
import { ExternalLink } from 'lucide-react';

interface Image {
  id: string;
  url: string;
  source: 'drone' | 'satellite' | 'generated';
  similarity: number;
}

interface ImageGridProps {
  images: Image[];
}

export default function ImageGrid({ images }: ImageGridProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
        >
          <img
            src={image.url}
            alt={`Result ${image.id}`}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center justify-between">
              <span className="text-white capitalize font-medium">
                {image.source}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">
                  {(image.similarity * 100).toFixed(1)}% match
                </span>
                <ExternalLink className="w-4 h-4 text-white opacity-75" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}