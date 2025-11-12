'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import ExperienceMap from '@/components/ExperienceMap';
import { MapPin, Clock, DollarSign, Heart, Calendar, ExternalLink, Navigation, Ticket } from 'lucide-react';
import { mockExperiences } from '@/lib/mockData';
import { useStore } from '@/lib/store';
import { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

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
    activities: 'Activities',
    entertainment: 'Entertainment',
    cultural: 'Cultural',
    free: 'Free Activities',
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

              {/* Highlights */}
              {experience.highlights && experience.highlights.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {experience.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm rounded-full bg-primary-100 text-primary-700 font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
                    {formatPrice(experience.priceLevel)}
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
                {experience.hours && (
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">Hours</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{experience.hours}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
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

            {/* Map Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <ExperienceMap
                  experiences={[experience]}
                  selectedExperienceId={experience.id}
                  height="400px"
                />
              </div>
              <div className="mt-4 flex gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(experience.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </a>
                <button
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(experience.address);
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Copy Address
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="space-y-3">
                {experience.bookingUrl ? (
                  <>
                    <a
                      href={experience.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Ticket className="h-5 w-5" />
                      Book Tickets / Reservations
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <div className="text-xs text-gray-600 text-center px-2">
                      Click to book tickets or make reservations on the official website
                    </div>
                  </>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-600 mb-2">No booking required</p>
                    <p className="text-xs text-gray-500">This experience doesn't require advance reservations</p>
                  </div>
                )}
                <Link
                  href={`/itinerary?add=${experience.id}`}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Add to Itinerary
                </Link>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(experience.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </a>
              </div>
            </div>

            {/* Related Experiences */}
            {mockExperiences.filter(e => 
              e.id !== experience.id && 
              (e.neighborhood === experience.neighborhood || e.type === experience.type)
            ).slice(0, 3).length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Nearby Experiences</h3>
                <div className="space-y-3">
                  {mockExperiences
                    .filter(e => 
                      e.id !== experience.id && 
                      (e.neighborhood === experience.neighborhood || e.type === experience.type)
                    )
                    .slice(0, 3)
                    .map((related) => (
                      <Link
                        key={related.id}
                        href={`/experience/${related.id}`}
                        className="block p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                      >
                        <h4 className="font-medium text-sm text-gray-900 mb-1">{related.name}</h4>
                        <p className="text-xs text-gray-600">{related.neighborhood}</p>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

