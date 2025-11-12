import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Experience {
  id: string;
  name: string;
  description: string;
  type: 'food' | 'outdoor' | 'arts' | 'nightlife' | 'shopping' | 'wellness' | 'sightseeing' | 'hidden' | 'family' | 'activities' | 'entertainment' | 'cultural' | 'free';
  category?: 'dining' | 'activities' | 'entertainment' | 'outdoor' | 'cultural' | 'free' | 'shopping' | 'nightlife';
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  priceLevel: 1 | 2 | 3 | 4;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime' | 'lunch';
  indoor: boolean;
  outdoor: boolean;
  kidFriendly: boolean;
  accessibility: boolean;
  imageUrl: string;
  bookingUrl?: string;
  duration: number; // in minutes
  rating?: number;
  hours?: string;
  highlights?: string[];
}

export interface ItineraryItem {
  id: string;
  experienceId: string;
  experience: Experience;
  startTime: string; // ISO time string
  order: number;
}

export interface Itinerary {
  id: string;
  name: string;
  occasion: string;
  budget?: string;
  partySize?: 'solo' | 'couple' | 'small-group' | 'large-group';
  duration: 'half-day' | 'full-day' | 'evening' | 'custom';
  items: ItineraryItem[];
  createdAt: string;
}

interface AppState {
  favorites: string[];
  itineraries: Itinerary[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addItinerary: (itinerary: Itinerary) => void;
  updateItinerary: (id: string, updates: Partial<Itinerary>) => void;
  deleteItinerary: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      favorites: [],
      itineraries: [],
      addFavorite: (id) =>
        set((state) => ({
          favorites: [...state.favorites, id],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f !== id),
        })),
      isFavorite: (id) => get().favorites.includes(id),
      addItinerary: (itinerary) =>
        set((state) => ({
          itineraries: [...state.itineraries, itinerary],
        })),
      updateItinerary: (id, updates) =>
        set((state) => ({
          itineraries: state.itineraries.map((it) =>
            it.id === id ? { ...it, ...updates } : it
          ),
        })),
      deleteItinerary: (id) =>
        set((state) => ({
          itineraries: state.itineraries.filter((it) => it.id !== id),
        })),
    }),
    {
      name: 'sf-experience-storage',
    }
  )
);

