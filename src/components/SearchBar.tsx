import React, { useState } from 'react';
import { Search, Image as ImageIcon, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (prompt: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSearch(prompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="relative flex items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you're looking for..."
          className="w-full px-4 py-3 pl-12 text-lg rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          disabled={isLoading}
        />
        <Search className="absolute left-4 w-5 h-5 text-gray-400" />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="absolute right-3 px-4 py-1.5 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4" />
              <span>Search</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}