'use client';

import Header from '@/components/Header';
import ExperienceCard from '@/components/ExperienceCard';
import { Heart } from 'lucide-react';
import { useStore } from '@/lib/store';
import { mockExperiences } from '@/lib/mockData';

export default function FavoritesPage() {
  const favorites = useStore((state) => state.favorites);
  const favoriteExperiences = mockExperiences.filter((exp) => favorites.includes(exp.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            Your Favorites
          </h1>
          <p className="text-gray-600">
            {favoriteExperiences.length} saved experience{favoriteExperiences.length !== 1 ? 's' : ''}
          </p>
        </div>

        {favoriteExperiences.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">
              Start exploring and save experiences you love
            </p>
            <a
              href="/search"
              className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Experiences
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteExperiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

