'use client';

import Link from 'next/link';
import { Heart, MapPin, Calendar } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Header() {
  const favorites = useStore((state) => state.favorites);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-primary-600" />
          <span className="text-xl font-semibold text-gray-900">SF Experiences</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/search"
            className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
          >
            Discover
          </Link>
          <Link
            href="/itinerary"
            className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            Itinerary
          </Link>
          <Link
            href="/favorites"
            className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors flex items-center gap-1 relative"
          >
            <Heart className="h-4 w-4" />
            Favorites
            {favorites.length > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-secondary-500 text-white text-xs flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

