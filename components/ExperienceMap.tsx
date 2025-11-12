'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Experience } from '@/lib/store';
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ExperienceMapProps {
  experiences: Experience[];
  selectedExperienceId?: string;
  onExperienceSelect?: (experience: Experience) => void;
  className?: string;
  height?: string;
}

// Fallback map component when Mapbox token is not available
function FallbackMap({ 
  experiences, 
  selectedExperienceId, 
  onExperienceSelect 
}: { 
  experiences: Experience[]; 
  selectedExperienceId?: string; 
  onExperienceSelect?: (experience: Experience) => void;
}) {
  const router = useRouter();
  const [hoveredExperience, setHoveredExperience] = useState<string | null>(null);
  
  // SF bounds for the map
  const minLat = 37.7;
  const maxLat = 37.85;
  const minLng = -122.55;
  const maxLng = -122.35;

  const normalizeCoordinates = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    return { x, y };
  };

  const handleMarkerClick = (experience: Experience) => {
    if (onExperienceSelect) {
      onExperienceSelect(experience);
    } else {
      router.push(`/experience/${experience.id}`);
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl overflow-hidden">
      {/* Map background with grid */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-400" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Neighborhood labels */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { name: 'Golden Gate Park', x: 20, y: 60 },
          { name: 'Downtown', x: 65, y: 45 },
          { name: 'Mission', x: 55, y: 75 },
          { name: 'Marina', x: 35, y: 25 },
          { name: 'Presidio', x: 15, y: 30 },
        ].map((area) => (
          <div
            key={area.name}
            className="absolute text-xs font-medium text-gray-500 opacity-60"
            style={{ left: `${area.x}%`, top: `${area.y}%` }}
          >
            {area.name}
          </div>
        ))}
      </div>

      {/* Experience markers */}
      <div className="absolute inset-0">
        {experiences.map((experience) => {
          const { x, y } = normalizeCoordinates(experience.lat, experience.lng);
          const isSelected = selectedExperienceId === experience.id;
          const isHovered = hoveredExperience === experience.id;

          return (
            <div
              key={experience.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredExperience(experience.id)}
              onMouseLeave={() => setHoveredExperience(null)}
              onClick={() => handleMarkerClick(experience)}
            >
              {/* Marker */}
              <div
                className={cn(
                  'w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-200',
                  'hover:scale-125 hover:z-50',
                  isSelected
                    ? 'bg-secondary-500 scale-125 ring-4 ring-secondary-200'
                    : isHovered
                    ? 'bg-primary-500 scale-110'
                    : 'bg-primary-400'
                )}
              />
              
              {/* Popup on hover/select */}
              {(isSelected || isHovered) && (
                <div
                  className={cn(
                    'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2',
                    'bg-white rounded-lg shadow-xl p-3 min-w-[200px] max-w-[250px]',
                    'border border-gray-200 z-50 animate-in fade-in slide-in-from-bottom-2'
                  )}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {experience.imageUrl && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                        <img
                          src={experience.imageUrl}
                          alt={experience.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {experience.name}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">
                        {experience.neighborhood}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 line-clamp-2 mb-2">
                    {experience.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{formatPrice(experience.priceLevel)}</span>
                    <span>•</span>
                    <span>{experience.duration} min</span>
                  </div>
                  <Link
                    href={`/experience/${experience.id}`}
                    className="mt-2 block w-full text-center px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Details
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 z-10">
        <p className="text-sm font-medium text-gray-900">
          {experiences.length} {experiences.length === 1 ? 'location' : 'locations'}
        </p>
        <p className="text-xs text-gray-600 mt-1">Click markers to explore</p>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 z-10">
        <p className="text-xs font-semibold text-gray-900 mb-2">Interactive Map</p>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-400 border border-white" />
            <span>Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary-500 border border-white ring-2 ring-secondary-200" />
            <span>Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
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
  const popupsRef = useRef<mapboxgl.Popup[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [useMapbox, setUseMapbox] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Check for Mapbox token
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    
    if (!mapboxToken || mapboxToken === '') {
      setMapError(null); // Don't show error, just use fallback
      setUseMapbox(false);
      return;
    }

    try {
      // Initialize map
      mapboxgl.accessToken = mapboxToken;

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

        // Add geocoder for search (dynamically import if available)
        if (typeof window !== 'undefined') {
          import('@mapbox/mapbox-gl-geocoder').then((MapboxGeocoder) => {
            try {
              const geocoder = new MapboxGeocoder.default({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                marker: false,
                placeholder: 'Search San Francisco...',
                proximity: {
                  longitude: -122.4194,
                  latitude: 37.7749,
                },
                bbox: [-122.55, 37.7, -122.35, 37.85], // SF bounds
              });
              if (map.current) {
                map.current.addControl(geocoder, 'top-left');
              }
            } catch (e) {
              console.log('Geocoder initialization error:', e);
            }
          }).catch(() => {
            console.log('Geocoder not available');
          });
        }

        // Map click handler
        map.current.on('click', (e) => {
          // Clear selection when clicking on map
          if (onExperienceSelect) {
            // You could implement neighborhood filtering here
          }
        });
      }

      setUseMapbox(true);
      setMapError(null);
    } catch (error) {
      console.error('Mapbox initialization error:', error);
      setUseMapbox(false);
      setMapError(null);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [onExperienceSelect]);

  // Update markers when experiences change
  useEffect(() => {
    if (!map.current || !useMapbox) return;

    // Clear existing markers and popups
    markersRef.current.forEach((marker) => marker.remove());
    popupsRef.current.forEach((popup) => popup.remove());
    markersRef.current = [];
    popupsRef.current = [];

    // Create markers for each experience
    experiences.forEach((experience) => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = cn(
        'w-10 h-10 rounded-full border-3 border-white shadow-lg cursor-pointer transition-all duration-200',
        'hover:scale-125 hover:z-50',
        selectedExperienceId === experience.id
          ? 'bg-secondary-500 scale-125 ring-4 ring-secondary-200'
          : 'bg-primary-500 hover:bg-primary-600'
      );
      el.innerHTML = `
        <div class="w-full h-full rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
          </svg>
        </div>
      `;

      // Create rich popup content
      const popupContent = document.createElement('div');
      popupContent.className = 'p-0 max-w-xs';
      const priceDisplay = formatPrice(experience.priceLevel);
      popupContent.innerHTML = `
        <div class="p-4">
          ${experience.imageUrl ? `
            <div class="relative w-full h-32 rounded-lg overflow-hidden mb-3">
              <img src="${experience.imageUrl}" alt="${experience.name}" class="w-full h-full object-cover" />
            </div>
          ` : ''}
          <h3 class="font-semibold text-gray-900 mb-1 text-base">${experience.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${experience.neighborhood}</p>
          <p class="text-xs text-gray-700 line-clamp-2 mb-3">${experience.description}</p>
          <div class="flex items-center gap-3 text-xs text-gray-600 mb-3">
            <span>${priceDisplay}</span>
            <span>•</span>
            <span>${experience.duration} min</span>
            ${experience.rating ? `<span>•</span><span>⭐ ${experience.rating}</span>` : ''}
          </div>
          <div class="flex gap-2">
            <a href="/experience/${experience.id}" class="flex-1 px-3 py-2 text-xs font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-center">
              View Details
            </a>
            <a href="/itinerary?add=${experience.id}" class="px-3 py-2 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              Add
            </a>
          </div>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({ 
        offset: 25, 
        closeButton: true,
        closeOnClick: false,
        className: 'experience-popup'
      }).setDOMContent(popupContent);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([experience.lng, experience.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click handler for navigation
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onExperienceSelect) {
          onExperienceSelect(experience);
        } else {
          router.push(`/experience/${experience.id}`);
        }
      });

      // Add click handler to popup links
      popupContent.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      });

      // Open popup if selected
      if (selectedExperienceId === experience.id) {
        marker.togglePopup();
        map.current!.flyTo({
          center: [experience.lng, experience.lat],
          zoom: 14,
          duration: 1000,
        });
      }

      markersRef.current.push(marker);
      popupsRef.current.push(popup);
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
        duration: 1000,
      });
    }
  }, [experiences, selectedExperienceId, onExperienceSelect, useMapbox, router]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Use fallback map if Mapbox is not available
  if (!useMapbox) {
    return (
      <div
        className={cn(
          'relative bg-gray-100 rounded-xl overflow-hidden border border-gray-200',
          isFullscreen && 'fixed inset-0 z-50 rounded-none',
          className
        )}
        style={{ height: isFullscreen ? '100vh' : height }}
      >
        <FallbackMap
          experiences={experiences}
          selectedExperienceId={selectedExperienceId}
          onExperienceSelect={onExperienceSelect}
        />
        
        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-20 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-5 w-5 text-gray-700" />
          ) : (
            <Maximize2 className="h-5 w-5 text-gray-700" />
          )}
        </button>
      </div>
    );
  }

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
        className="absolute top-4 right-16 z-10 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
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
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900">
            {experiences.length} {experiences.length === 1 ? 'location' : 'locations'}
          </p>
          <p className="text-xs text-gray-600 mt-1">Click markers to explore</p>
        </div>
      )}
    </div>
  );
}
