import React from 'react';
import { Search, Image } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <Search className="w-6 h-6 text-blue-600" />
            <Image className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Cross Domain Image Retrieval
          </h1>
        </div>
        <p className="mt-2 text-gray-600">
          Advanced AI-powered image search across drone and satellite imagery
        </p>
      </div>
    </header>
  );
}