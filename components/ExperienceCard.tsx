'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Clock, DollarSign } from 'lucide-react';
import { Experience } from '@/lib/store';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface ExperienceCardProps {
  experience: Experience;
  onSelect?: (experience: Experience) => void;
  showActions?: boolean;
}

export default function ExperienceCard({
  experience,
  onSelect,
  showActions = true,
}: ExperienceCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useStore();
  const favorite = isFavorite(experience.id);

  const priceLabels = ['$', '$$', '$$$', '$$$$'];

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFavorite(experience.id);
    } else {
      addFavorite(experience.id);
    }
  };

  const typeLabels: Record<Experience['type'], string> = {
    food: 'Food & Dining',
    outdoor: 'Outdoor',
    arts: 'Arts & Culture',
    nightlife: 'Nightlife',
    shopping: 'Shopping',
    wellness: 'Wellness',
    sightseeing: 'Sightseeing',
    hidden: 'Hidden Gem',
    family: 'Family',
    activities: 'Activities',
    entertainment: 'Entertainment',
    cultural: 'Cultural',
    free: 'Free Activities',
  };

  return (
    <Link href={`/experience/${experience.id}`}>
        <div
          className={cn(
            'group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer',
            'border border-gray-100'
          )}
        >
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={experience.imageUrl}
            alt={experience.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {showActions && (
            <button
              onClick={handleFavorite}
              className={cn(
                'absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm',
                'hover:bg-white transition-colors',
                favorite && 'text-red-500'
              )}
            >
              <Heart className={cn('h-4 w-4', favorite && 'fill-current')} />
            </button>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {experience.name}
            </h3>
            {experience.rating && (
              <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                ⭐ {experience.rating}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{experience.description}</p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {experience.neighborhood}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {experience.duration} min
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {priceLabels[experience.priceLevel - 1]}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-primary-100 text-primary-700">
              {typeLabels[experience.type]}
            </span>
            {onSelect && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect(experience);
                }}
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Add to Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

