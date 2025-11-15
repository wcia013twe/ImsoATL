'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_CONFIG, MAP_LAYERS } from '@/lib/mapbox-config';
import MapLayerControl from './MapLayerControl';

// Mock data sources - replace with real data in backend integration
const MOCK_DATA = {
  atlantaBoundary: {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[
            [-84.55, 33.65],
            [-84.55, 33.89],
            [-84.29, 33.89],
            [-84.29, 33.65],
            [-84.55, 33.65],
          ]],
        },
        properties: {},
      },
    ],
  },
  libraries: {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [-84.408, 33.749] },
        properties: { name: 'Central Library', type: 'library' },
      },
      {
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [-84.428, 33.738] },
        properties: { name: 'Southwest Library', type: 'library' },
      },
    ],
  },
  candidateSites: {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [-84.408, 33.755] },
        properties: { name: 'Candidate Site 1', reach: 2200, equityScore: 9.2 },
      },
    ],
  },
};

const LAYER_CONFIG = [
  { id: 'atlanta-boundary', label: 'Atlanta Boundary', color: '#2691FF' },
  { id: 'census-poverty', label: 'Poverty Rate', color: '#19B987', description: 'Census tract poverty data' },
  { id: 'census-internet', label: 'Internet Access', color: '#2691FF', description: 'Households without internet' },
  { id: 'fcc-broadband', label: 'FCC Coverage', color: '#FFB84D', description: 'Federal broadband data' },
  { id: 'libraries', label: 'Libraries', color: '#7C3AED' },
  { id: 'community-centers', label: 'Community Centers', color: '#DC2626' },
  { id: 'transit-stops', label: 'Transit Stops', color: '#7DBDFF' },
  { id: 'candidate-sites', label: 'Candidate Sites', color: '#2691FF' },
  { id: 'existing-wifi', label: 'Existing WiFi', color: '#6B7280' },
];

export default function InteractiveMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeLayers, setActiveLayers] = useState<string[]>([
    'atlanta-boundary',
    'libraries',
    'candidate-sites',
  ]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.defaultStyle,
      center: [MAPBOX_CONFIG.atlantaCenter.lng, MAPBOX_CONFIG.atlantaCenter.lat],
      zoom: MAPBOX_CONFIG.atlantaCenter.zoom,
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add data sources
      map.current.addSource('atlanta-boundary', {
        type: 'geojson',
        data: MOCK_DATA.atlantaBoundary,
      });

      map.current.addSource('libraries', {
        type: 'geojson',
        data: MOCK_DATA.libraries,
      });

      map.current.addSource('candidate-sites', {
        type: 'geojson',
        data: MOCK_DATA.candidateSites,
      });

      // Add layers
      map.current.addLayer(MAP_LAYERS.atlantaBoundary);
      map.current.addLayer(MAP_LAYERS.libraries);
      map.current.addLayer(MAP_LAYERS.candidateSites);

      // Add click handlers for popups
      map.current.on('click', 'libraries', (e) => {
        if (!map.current || !e.features || !e.features[0]) return;
        const feature = e.features[0];
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`<strong>${feature.properties?.name}</strong><br/>Type: Library`)
          .addTo(map.current);
      });

      map.current.on('click', 'candidate-sites', (e) => {
        if (!map.current || !e.features || !e.features[0]) return;
        const feature = e.features[0];
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <strong>${feature.properties?.name}</strong><br/>
            Reach: ${feature.properties?.reach} residents<br/>
            Equity Score: ${feature.properties?.equityScore}
          `)
          .addTo(map.current);
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'libraries', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'libraries', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });

      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Toggle layer visibility
  const toggleLayer = (layerId: string) => {
    if (!map.current || !mapLoaded) return;

    setActiveLayers((prev) => {
      const isActive = prev.includes(layerId);
      const newLayers = isActive
        ? prev.filter((id) => id !== layerId)
        : [...prev, layerId];

      // Update map layer visibility
      if (map.current?.getLayer(layerId)) {
        map.current.setLayoutProperty(
          layerId,
          'visibility',
          isActive ? 'none' : 'visible'
        );
      }

      return newLayers;
    });
  };

  return (
    <section className="w-full py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="civic-card relative">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Interactive Site Map
          </h2>

          {/* Map Container */}
          <div className="relative w-full rounded-lg overflow-hidden" style={{ height: '600px' }}>
            <div ref={mapContainer} className="w-full h-full" />

            {/* Layer Control */}
            <MapLayerControl
              layers={LAYER_CONFIG}
              activeLayers={activeLayers}
              onToggle={toggleLayer}
            />

            {/* API Key Warning */}
            {!MAPBOX_CONFIG.accessToken && (
              <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg max-w-md text-center">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Mapbox API Key Required
                  </p>
                  <p className="text-xs text-gray-600">
                    Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Map Legend */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Census Data</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#19B987]" />
                  <span className="text-gray-700">High Poverty</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#2691FF]" />
                  <span className="text-gray-700">Low Internet Access</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Local Assets</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#7C3AED]" />
                  <span className="text-gray-700">Libraries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#DC2626]" />
                  <span className="text-gray-700">Community Centers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#7DBDFF]" />
                  <span className="text-gray-700">Transit Stops</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">WiFi Sites</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#2691FF]" />
                  <span className="text-gray-700">Candidate Sites</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#6B7280]" />
                  <span className="text-gray-700">Existing WiFi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
