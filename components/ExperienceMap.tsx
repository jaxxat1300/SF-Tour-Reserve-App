'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Experience } from '@/lib/store';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExperienceMapProps {
  experiences: Experience[];
  selectedExperienceId?: string;
  onExperienceSelect?: (experience: Experience) => void;
  className?: string;
  height?: string;
}

export default function ExperienceMap({
  experiences,
  selectedExperienceId,
  onExperienceSelect,
  className,
  height = '600px',
}: ExperienceMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    
    if (!mapboxgl.accessToken) {
      setMapError('Mapbox token not configured. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your .env file.');
      return;
    }

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-122.4194, 37.7749], // San Francisco
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add geolocate control
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      });
      map.current.addControl(geolocate, 'top-right');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when experiences change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Create markers for each experience
    experiences.forEach((experience) => {
      const el = document.createElement('div');
      el.className = cn(
        'w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-110',
        selectedExperienceId === experience.id
          ? 'bg-secondary-500 scale-110'
          : 'bg-primary-500'
      );

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: true })
        .setHTML(`
          <div class="p-3 max-w-xs">
            <h3 class="font-semibold text-gray-900 mb-1">${experience.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${experience.neighborhood}</p>
            <p class="text-xs text-gray-500 line-clamp-2">${experience.description}</p>
          </div>
        `);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([experience.lng, experience.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click handler
      el.addEventListener('click', () => {
        if (onExperienceSelect) {
          onExperienceSelect(experience);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit bounds if we have experiences
    if (experiences.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      experiences.forEach((exp) => {
        bounds.extend([exp.lng, exp.lat]);
      });

      // Add padding for better view
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 14,
      });
    }
  }, [experiences, selectedExperienceId, onExperienceSelect]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (mapError) {
    return (
      <div className={cn('bg-gray-100 rounded-xl p-8 text-center', className)}>
        <p className="text-gray-600 mb-4">{mapError}</p>
        <p className="text-sm text-gray-500">
          You can still browse experiences using the list view.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative bg-gray-100 rounded-xl overflow-hidden border border-gray-200',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Fullscreen toggle */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-10 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <Minimize2 className="h-5 w-5 text-gray-700" />
        ) : (
          <Maximize2 className="h-5 w-5 text-gray-700" />
        )}
      </button>

      {/* Info overlay */}
      {experiences.length > 0 && (
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900">
            {experiences.length} {experiences.length === 1 ? 'location' : 'locations'}
          </p>
        </div>
      )}
    </div>
  );
}
