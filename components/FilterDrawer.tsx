'use client';

import { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    type?: string[];
    priceLevel?: number[];
    neighborhood?: string[];
    timeOfDay?: string[];
    indoor?: boolean;
    outdoor?: boolean;
    kidFriendly?: boolean;
    accessibility?: boolean;
    occasion?: string[];
  };
  onFiltersChange: (filters: FilterDrawerProps['filters']) => void;
}

const experienceTypes = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'arts', label: 'Arts & Culture' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'sightseeing', label: 'Sightseeing' },
  { value: 'hidden', label: 'Hidden Gems' },
  { value: 'family', label: 'Family' },
];

const neighborhoods = [
  'Nob Hill', 'Presidio', 'SoMa', 'Embarcadero', 'Mission District',
  'Richmond', 'Financial District', 'Marina', 'Fisherman\'s Wharf',
  'Telegraph Hill', 'Hayes Valley',
];

const timeOptions = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'anytime', label: 'Anytime' },
];

const occasions = [
  { value: 'general', label: 'General' },
  { value: 'date-night', label: 'Date Night' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'memorial', label: 'Memorial/Remembrance' },
  { value: 'family', label: 'Family Outing' },
  { value: 'solo', label: 'Solo Adventure' },
  { value: 'friends', label: 'Friends Gathering' },
];

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}: FilterDrawerProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const updateFilter = (key: keyof typeof localFilters, value: any) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  const toggleArrayFilter = (key: 'type' | 'priceLevel' | 'neighborhood' | 'timeOfDay' | 'occasion', value: string) => {
    const current = (localFilters[key] || []) as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const clearFilters = () => {
    const cleared = {
      type: undefined,
      priceLevel: undefined,
      neighborhood: undefined,
      timeOfDay: undefined,
      occasion: undefined,
      indoor: undefined,
      outdoor: undefined,
      kidFriendly: undefined,
      accessibility: undefined,
    };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  const hasActiveFilters = Object.values(localFilters).some((v) => 
    Array.isArray(v) ? v.length > 0 : v !== undefined
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Experience Type */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Experience Type</h3>
              <div className="space-y-2">
                {experienceTypes.map((type) => (
                  <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.type?.includes(type.value)}
                      onChange={() => toggleArrayFilter('type', type.value)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Level */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.priceLevel?.includes(level)}
                      onChange={() => toggleArrayFilter('priceLevel', level.toString())}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{'$'.repeat(level)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Neighborhood */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Neighborhood</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {neighborhoods.map((neighborhood) => (
                  <label key={neighborhood} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.neighborhood?.includes(neighborhood)}
                      onChange={() => toggleArrayFilter('neighborhood', neighborhood)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{neighborhood}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Time of Day */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Time of Day</h3>
              <div className="space-y-2">
                {timeOptions.map((time) => (
                  <label key={time.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.timeOfDay?.includes(time.value)}
                      onChange={() => toggleArrayFilter('timeOfDay', time.value)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{time.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Occasion</h3>
              <div className="space-y-2">
                {occasions.map((occasion) => (
                  <label key={occasion.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.occasion?.includes(occasion.value)}
                      onChange={() => toggleArrayFilter('occasion', occasion.value)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{occasion.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Features</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.indoor || false}
                    onChange={(e) => updateFilter('indoor', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Indoor</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.outdoor || false}
                    onChange={(e) => updateFilter('outdoor', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Outdoor</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.kidFriendly || false}
                    onChange={(e) => updateFilter('kidFriendly', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Kid Friendly</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.accessibility || false}
                    onChange={(e) => updateFilter('accessibility', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Accessible</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t space-y-3">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full px-4 py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

