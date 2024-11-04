import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchSectionProps {
  onSearch: (prompt: string) => void;
  loading: boolean;
}

export default function SearchSection({ onSearch, loading }: SearchSectionProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSearch(prompt.trim());
    }
  };

  return (
    <section className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you're looking for..."
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          disabled={loading}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </section>
  );
}