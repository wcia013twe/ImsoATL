'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_CONFIG } from '@/lib/mapbox-config';

export default function USMapBackground() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283], // Center of USA
      zoom: 3.5,
      pitch: 45, // 3D tilt
      bearing: 0,
      interactive: false, // Disable user interaction
      attributionControl: false,
    });

    // Disable zoom controls
    map.current.scrollZoom.disable();
    map.current.boxZoom.disable();
    map.current.dragRotate.disable();
    map.current.dragPan.disable();
    map.current.keyboard.disable();
    map.current.doubleClickZoom.disable();
    map.current.touchZoomRotate.disable();

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Blur Overlay */}
      <div
        className="absolute inset-0 backdrop-blur-md bg-white/40"
        style={{ backdropFilter: 'blur(8px)' }}
      />
    </div>
  );
}
