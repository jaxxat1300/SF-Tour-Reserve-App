'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import ExperienceCard from '@/components/ExperienceCard';
import FilterDrawer from '@/components/FilterDrawer';
import ExperienceMap from '@/components/ExperienceMap';
import { Filter, Map } from 'lucide-react';
import { mockExperiences } from '@/lib/mockData';
import { Experience } from '@/lib/store';

// Natural language search parser
function parseNaturalLanguageQuery(query: string) {
  const lowerQuery = query.toLowerCase();
  const parsed: {
    keywords?: string[];
    priceLevel?: number[];
    occasion?: string[];
    type?: string[];
  } = {};

  // Extract price mentions (e.g., "under $100", "cheap", "affordable")
  const priceMatches = lowerQuery.match(/(?:under|below|less than|max|up to)\s*\$?(\d+)/);
  if (priceMatches) {
    const maxPrice = parseInt(priceMatches[1]);
    if (maxPrice < 50) parsed.priceLevel = [1];
    else if (maxPrice < 100) parsed.priceLevel = [1, 2];
    else if (maxPrice < 200) parsed.priceLevel = [1, 2, 3];
    else parsed.priceLevel = [1, 2, 3, 4];
  }

  // Extract occasion mentions
  const occasionKeywords = {
    romantic: 'date-night',
    date: 'date-night',
    birthday: 'birthday',
    anniversary: 'anniversary',
    memorial: 'memorial',
    remembrance: 'memorial',
    family: 'family',
    kids: 'family',
    children: 'family',
    solo: 'solo',
    friends: 'friends',
  };
  for (const [keyword, occasion] of Object.entries(occasionKeywords)) {
    if (lowerQuery.includes(keyword)) {
      parsed.occasion = parsed.occasion || [];
      if (!parsed.occasion.includes(occasion)) {
        parsed.occasion.push(occasion);
      }
    }
  }

  // Extract experience type mentions
  const typeKeywords = {
    restaurant: 'food',
    dining: 'food',
    food: 'food',
    eat: 'food',
    park: 'outdoor',
    outdoor: 'outdoor',
    hike: 'outdoor',
    museum: 'arts',
    art: 'arts',
    culture: 'arts',
    bar: 'nightlife',
    lounge: 'nightlife',
    nightlife: 'nightlife',
    shop: 'shopping',
    shopping: 'shopping',
    spa: 'wellness',
    wellness: 'wellness',
    sightseeing: 'sightseeing',
    tour: 'sightseeing',
    hidden: 'hidden',
    gem: 'hidden',
  };
  for (const [keyword, type] of Object.entries(typeKeywords)) {
    if (lowerQuery.includes(keyword)) {
      parsed.type = parsed.type || [];
      if (!parsed.type.includes(type)) {
        parsed.type.push(type);
      }
    }
  }

  // Extract location/neighborhood mentions (bay views, waterfront, etc.)
  if (lowerQuery.includes('bay') || lowerQuery.includes('waterfront') || lowerQuery.includes('view')) {
    parsed.keywords = parsed.keywords || [];
    parsed.keywords.push('bay');
    parsed.keywords.push('view');
  }

  return parsed;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const occasion = searchParams.get('occasion') || '';
  const budgetParam = searchParams.get('budget') || '';
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<{
    type?: string[];
    priceLevel?: number[];
    neighborhood?: string[];
    timeOfDay?: string[];
    indoor?: boolean;
    outdoor?: boolean;
    kidFriendly?: boolean;
    accessibility?: boolean;
    occasion?: string[];
  }>({});
  const [showMap, setShowMap] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  // Initialize filters from URL params
  useEffect(() => {
    if (occasion) {
      setFilters((prev) => ({ ...prev, occasion: [occasion] }));
    }
    if (budgetParam) {
      const budgetLevel = parseInt(budgetParam);
      if (budgetLevel >= 1 && budgetLevel <= 4) {
        setFilters((prev) => ({ ...prev, priceLevel: [budgetLevel] }));
      }
    }
  }, [occasion, budgetParam]);

  const filteredExperiences = useMemo(() => {
    let results = [...mockExperiences];

    // Parse natural language query
    const parsedQuery = query ? parseNaturalLanguageQuery(query) : {};

    // Apply natural language parsed filters
    if (parsedQuery.priceLevel) {
      results = results.filter((exp) => parsedQuery.priceLevel!.includes(exp.priceLevel));
    }
    if (parsedQuery.type) {
      results = results.filter((exp) => parsedQuery.type!.includes(exp.type));
    }

    // Text search (keywords from natural language or direct match)
    if (query) {
      const lowerQuery = query.toLowerCase();
      const keywordMatch = results.filter(
        (exp) =>
          exp.name.toLowerCase().includes(lowerQuery) ||
          exp.description.toLowerCase().includes(lowerQuery) ||
          exp.neighborhood.toLowerCase().includes(lowerQuery)
      );
      
      // If we have parsed filters, keep those results, otherwise use keyword match
      if (!parsedQuery.priceLevel && !parsedQuery.type && !parsedQuery.occasion) {
        results = keywordMatch;
      } else {
        // Combine keyword match with parsed filters
        const keywordIds = new Set(keywordMatch.map((e) => e.id));
        results = results.filter((exp) => keywordIds.has(exp.id) || 
          exp.name.toLowerCase().includes(lowerQuery) ||
          exp.description.toLowerCase().includes(lowerQuery) ||
          exp.neighborhood.toLowerCase().includes(lowerQuery)
        );
      }
    }

    // Type filter
    if (filters.type && filters.type.length > 0) {
      results = results.filter((exp) => filters.type!.includes(exp.type));
    }

    // Price level filter
    if (filters.priceLevel && filters.priceLevel.length > 0) {
      results = results.filter((exp) =>
        filters.priceLevel!.includes(exp.priceLevel)
      );
    }

    // Neighborhood filter
    if (filters.neighborhood && filters.neighborhood.length > 0) {
      results = results.filter((exp) =>
        filters.neighborhood!.includes(exp.neighborhood)
      );
    }

    // Time of day filter
    if (filters.timeOfDay && filters.timeOfDay.length > 0) {
      results = results.filter((exp) =>
        filters.timeOfDay!.includes(exp.timeOfDay)
      );
    }

    // Indoor/outdoor filters
    if (filters.indoor === true) {
      results = results.filter((exp) => exp.indoor);
    }
    if (filters.outdoor === true) {
      results = results.filter((exp) => exp.outdoor);
    }

    // Kid friendly filter
    if (filters.kidFriendly === true) {
      results = results.filter((exp) => exp.kidFriendly);
    }

    // Accessibility filter
    if (filters.accessibility === true) {
      results = results.filter((exp) => exp.accessibility);
    }

    // Occasion filter
    if (filters.occasion && filters.occasion.length > 0) {
      // Filter experiences based on occasion appropriateness
      results = results.filter((exp) => {
        const occasionFilter = filters.occasion![0];
        
        // Map occasions to experience characteristics
        switch (occasionFilter) {
          case 'date-night':
            // Romantic, nice restaurants, evening activities
            return exp.type === 'food' && exp.priceLevel >= 2 ||
                   exp.type === 'nightlife' ||
                   (exp.type === 'outdoor' && exp.description.toLowerCase().includes('sunset'));
          case 'birthday':
            // Fun, celebratory experiences
            return exp.type === 'food' || exp.type === 'nightlife' || exp.type === 'arts' || exp.type === 'outdoor';
          case 'anniversary':
            // Romantic, special experiences
            return exp.priceLevel >= 2 && (exp.type === 'food' || exp.type === 'nightlife' || exp.type === 'arts');
          case 'memorial':
            // Peaceful, reflective experiences
            return exp.type === 'outdoor' || exp.type === 'arts' || 
                   (exp.description.toLowerCase().includes('peaceful') || 
                    exp.description.toLowerCase().includes('quiet') ||
                    exp.description.toLowerCase().includes('serene'));
          case 'family':
            // Kid-friendly experiences
            return exp.kidFriendly;
          case 'solo':
            // Accessible, safe, solo-friendly experiences
            return exp.accessibility && (exp.type === 'outdoor' || exp.type === 'arts' || exp.type === 'food');
          case 'friends':
            // Social, fun experiences
            return exp.type === 'nightlife' || exp.type === 'food' || exp.type === 'outdoor';
          default:
            return true;
        }
      });
    }

    return results;
  }, [query, filters]);

  const activeFilterCount = Object.values(filters).reduce((count, value) => {
    if (Array.isArray(value)) return count + value.length;
    if (value === true) return count + 1;
    return count;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Search Header */}
      <div className="sticky top-16 z-30 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <SearchBar initialQuery={query} />
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="relative px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowMap(!showMap)}
              className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
                showMap
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Map className="h-4 w-4" />
              <span className="text-sm font-medium">Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {filteredExperiences.length} Experience{filteredExperiences.length !== 1 ? 's' : ''} Found
          </h1>
          {query && (
            <p className="text-gray-600 mt-1">
              Results for &quot;{query}&quot;
            </p>
          )}
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-gray-600 mb-4">No experiences found</p>
            <p className="text-sm text-gray-500">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : showMap ? (
          <div className="space-y-6">
            <ExperienceMap
              experiences={filteredExperiences}
              selectedExperienceId={selectedExperience?.id}
              onExperienceSelect={setSelectedExperience}
              height="600px"
            />
            {selectedExperience && (
              <div className="mt-6">
                <ExperienceCard experience={selectedExperience} />
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        )}
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

