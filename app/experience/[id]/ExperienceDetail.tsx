'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import { MapPin, Clock, DollarSign, Heart, Calendar, ExternalLink } from 'lucide-react';
import { mockExperiences } from '@/lib/mockData';
import { useStore } from '@/lib/store';
import { useState } from 'react';
import Link from 'next/link';

export default function ExperienceDetail() {
  const params = useParams();
  const id = params.id as string;
  const experience = mockExperiences.find((exp) => exp.id === id);
  const { isFavorite, addFavorite, removeFavorite } = useStore();
  const favorite = isFavorite(id);

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Experience Not Found</h1>
          <Link href="/search" className="text-primary-600 hover:text-primary-700">
            Browse all experiences
          </Link>
        </div>
      </div>
    );
  }

  const priceLabels = ['$', '$$', '$$$', '$$$$'];

  const typeLabels: Record<typeof experience.type, string> = {
    food: 'Food & Dining',
    outdoor: 'Outdoor',
    arts: 'Arts & Culture',
    nightlife: 'Nightlife',
    shopping: 'Shopping',
    wellness: 'Wellness',
    sightseeing: 'Sightseeing',
    hidden: 'Hidden Gem',
    family: 'Family',
  };

  const handleFavorite = () => {
    if (favorite) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Image */}
        <div className="relative h-96 w-full rounded-2xl overflow-hidden mb-8">
          <Image
            src={experience.imageUrl}
            alt={experience.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <button
            onClick={handleFavorite}
            className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm shadow-lg transition-colors ${
              favorite
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className={`h-5 w-5 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {experience.name}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {experience.neighborhood}
                    </span>
                    {experience.rating && (
                      <span className="flex items-center gap-1">
                        ⭐ {experience.rating}
                      </span>
                    )}
                  </div>
                </div>
                <span className="inline-block px-3 py-1 text-sm font-medium rounded-lg bg-primary-100 text-primary-700">
                  {typeLabels[experience.type]}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {experience.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{experience.duration} min</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-medium">Price</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {priceLabels[experience.priceLevel - 1]}
                  </p>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Time of Day</div>
                  <p className="text-gray-900 font-semibold capitalize">
                    {experience.timeOfDay === 'anytime' ? 'Any Time' : experience.timeOfDay}
                  </p>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Accessibility</div>
                  <p className="text-gray-900 font-semibold">
                    {experience.accessibility ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
              <div className="flex flex-wrap gap-3">
                {experience.indoor && (
                  <span className="px-3 py-1 text-sm rounded-lg bg-gray-100 text-gray-700">
                    Indoor
                  </span>
                )}
                {experience.outdoor && (
                  <span className="px-3 py-1 text-sm rounded-lg bg-gray-100 text-gray-700">
                    Outdoor
                  </span>
                )}
                {experience.kidFriendly && (
                  <span className="px-3 py-1 text-sm rounded-lg bg-gray-100 text-gray-700">
                    Kid Friendly
                  </span>
                )}
                {experience.accessibility && (
                  <span className="px-3 py-1 text-sm rounded-lg bg-gray-100 text-gray-700">
                    Accessible
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-sm text-gray-600">{experience.address}</p>
              </div>

              <div className="space-y-3">
                {experience.bookingUrl ? (
                  <a
                    href={experience.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Book at {experience.name}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <button className="w-full px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                    Book at {experience.name}
                  </button>
                )}
                <Link
                  href={`/itinerary?add=${experience.id}`}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Add to Itinerary
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

