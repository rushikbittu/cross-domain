import React, { useState } from 'react';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import DatasetInfo from './components/DatasetInfo';
import ImageGrid from './components/ImageGrid';
import { mockSearch, SearchResult } from './utils/mockData';

function App() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (prompt: string) => {
    setLoading(true);
    try {
      const results = await mockSearch(prompt);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-12">
        <SearchSection onSearch={handleSearch} loading={loading} />
        <DatasetInfo />
        <ImageGrid images={searchResults} />
      </main>
    </div>
  );
}

export default App;