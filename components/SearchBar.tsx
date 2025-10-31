'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialQuery?: string;
  large?: boolean;
}

export default function SearchBar({ initialQuery = '', large = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative ${large ? 'max-w-2xl mx-auto' : ''}`}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try: 'romantic dinner with bay views under $100'"
          className={`w-full ${
            large
              ? 'h-16 text-lg pl-14 pr-4 rounded-2xl shadow-lg'
              : 'h-12 pl-12 pr-4 rounded-xl shadow-sm'
          } border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
        />
      </div>
    </form>
  );
}

