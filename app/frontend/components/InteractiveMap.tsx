"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import { MAPBOX_CONFIG, MAP_LAYERS } from "@/lib/mapbox-config";
import MapLayerControl from "./MapLayerControl";
import type { DeploymentPlan } from "@/lib/types";

// Mock data sources - replace with real data in backend integration
const MOCK_DATA = {
  atlantaBoundary: {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        geometry: {
          type: "Polygon" as const,
          coordinates: [
            [
              [-84.55, 33.65],
              [-84.55, 33.89],
              [-84.29, 33.89],
              [-84.29, 33.65],
              [-84.55, 33.65],
            ],
          ],
        },
        properties: {},
      },
    ],
  },
  libraries: {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [-84.408, 33.749] },
        properties: { name: "Central Library", type: "library" },
      },
      {
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [-84.428, 33.738] },
        properties: { name: "Southwest Library", type: "library" },
      },
    ],
  },
  candidateSites: {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [-84.408, 33.755] },
        properties: { name: "Candidate Site 1", reach: 2200, equityScore: 9.2 },
      },
    ],
  },
};

const LAYER_CONFIG = [
  { id: "city-boundary", label: "City Boundary", color: "#2691FF" },
  {
    id: "census-poverty",
    label: "Poverty Rate",
    color: "#19B987",
    description: "Census tract poverty data",
  },
  {
    id: "census-internet",
    label: "Internet Access",
    color: "#2691FF",
    description: "Households without internet",
  },
  {
    id: "fcc-broadband",
    label: "FCC Coverage",
    color: "#FFB84D",
    description: "Federal broadband data",
  },
  { id: "libraries", label: "Libraries", color: "#7C3AED" },
  { id: "community-centers", label: "Community Centers", color: "#DC2626" },
  { id: "transit-stops", label: "Transit Stops", color: "#7DBDFF" },
  { id: "candidate-sites", label: "Candidate Sites", color: "#2691FF" },
  { id: "existing-wifi", label: "Existing WiFi", color: "#6B7280" },
];

export default function InteractiveMap({
  cityCenter,
  cityName,
  citySlug,
  recommendations,
  mapRefProp,
}: {
  cityCenter?: [number, number];
  cityName?: string;
  citySlug?: string;
  recommendations?: DeploymentPlan | null;
  mapRefProp?: React.MutableRefObject<{
    showRecommendations: (plan: DeploymentPlan) => void;
    centerOnSite: (siteIndex: number) => void;
  } | null>;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeLayers, setActiveLayers] = useState<string[]>([
    "city-boundary",
    "libraries",
    "candidate-sites",
  ]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [siteCoordinates, setSiteCoordinates] = useState<[number, number][]>([]);

  // Use provided city coordinates or default to Atlanta
  const mapCenter = cityCenter || [
    MAPBOX_CONFIG.atlantaCenter.lng,
    MAPBOX_CONFIG.atlantaCenter.lat,
  ];
  const mapZoom = cityCenter ? 11.5 : MAPBOX_CONFIG.atlantaCenter.zoom;
  const boundarySlug = citySlug || "atlanta";

  // Expose methods via ref
  useEffect(() => {
    if (mapRefProp) {
      mapRefProp.current = {
        showRecommendations: (plan: DeploymentPlan) => {
          // Handle showing recommendations
          console.log('Show recommendations:', plan);
        },
        centerOnSite: (siteIndex: number) => {
          if (siteCoordinates[siteIndex] && map.current && recommendations) {
            const coords = siteCoordinates[siteIndex];
            const site = recommendations.recommended_sites[siteIndex];

            // Fly to the site location
            map.current.flyTo({
              center: coords,
              zoom: 14,
              duration: 1000,
              essential: true
            });

            // Open popup after a short delay to ensure map has centered
            setTimeout(() => {
              if (!map.current) return;

              new mapboxgl.Popup()
                .setLngLat(coords)
                .setHTML(
                  `
                  <div style="font-family: system-ui; padding: 4px;">
                    <strong style="color: #1f2937; font-size: 14px;">${site.name || `Site ${siteIndex + 1}`}</strong><br/>
                    <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                      <div><strong>Score:</strong> ${site.composite_score}/100</div>
                      <div><strong>Poverty Rate:</strong> ${site.poverty_rate}%</div>
                      <div><strong>No Internet:</strong> ${site.no_internet_pct}%</div>
                      <div><strong>Priority:</strong> ${site.recommendation_tier}</div>
                    </div>
                  </div>
                `
                )
                .addTo(map.current);
            }, 500);
          }
        }
      };
    }
  }, [mapRefProp, siteCoordinates, recommendations]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.defaultStyle,
      center: mapCenter,
      zoom: mapZoom,
    });

    map.current.on("load", () => {
      if (!map.current) return;

      // Load pre-generated city boundary
      fetch(`/data/cities/${boundarySlug}.json`)
        .then((response) => response.json())
        .then((cityBoundary) => {
          if (!map.current) return;

          console.log(`Loaded pre-generated ${boundarySlug} boundary`);

          // Add city boundary source with pre-processed boundary
          map.current.addSource("city-boundary", {
            type: "geojson",
            data: {
              type: "FeatureCollection" as const,
              features: [cityBoundary],
            },
          });

          // Add the clean outer boundary layer
          map.current.addLayer({
            id: "city-boundary",
            type: "line",
            source: "city-boundary",
            paint: {
              "line-color": "#2691FF",
              "line-width": 3,
              "line-opacity": 0.8,
            },
          });

          // Auto-zoom map to fit city boundary perfectly
          const bounds = cityBoundary.properties.bounds;
          if (bounds && bounds.length === 2) {
            console.log(`Fitting map to ${boundarySlug} bounds:`, bounds);
            map.current.fitBounds(bounds, {
              padding: 50,
              duration: 1000,
              maxZoom: 11.5,
            });
          }

          console.log(`${boundarySlug} boundary displayed successfully`);
        })
        .catch((error) => {
          console.error(`Error loading ${boundarySlug} boundary:`, error);
          // Fallback to mock data if boundary file fails to load
          if (map.current) {
            map.current.addSource("city-boundary", {
              type: "geojson",
              data: MOCK_DATA.atlantaBoundary,
            });
            map.current.addLayer({
              id: "city-boundary",
              type: "line",
              source: "city-boundary",
              paint: {
                "line-color": "#2691FF",
                "line-width": 3,
                "line-opacity": 0.8,
              },
            });
          }
        });

      // Add other data sources
      map.current.addSource("libraries", {
        type: "geojson",
        data: MOCK_DATA.libraries,
      });

      map.current.addSource("candidate-sites", {
        type: "geojson",
        data: MOCK_DATA.candidateSites,
      });

      // Add other layers
      map.current.addLayer(MAP_LAYERS.libraries);
      map.current.addLayer(MAP_LAYERS.candidateSites);

      // Add click handlers for popups with centering
      map.current.on("click", "libraries", (e) => {
        if (!map.current || !e.features || !e.features[0]) return;
        const feature = e.features[0];

        // Center map on clicked point
        map.current.flyTo({
          center: e.lngLat,
          zoom: 14,
          duration: 1000,
          essential: true
        });

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `<strong>${feature.properties?.name}</strong><br/>Type: Library`
          )
          .addTo(map.current);
      });

      map.current.on("click", "candidate-sites", (e) => {
        if (!map.current || !e.features || !e.features[0]) return;
        const feature = e.features[0];

        // Center map on clicked point
        map.current.flyTo({
          center: e.lngLat,
          zoom: 14,
          duration: 1000,
          essential: true
        });

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <strong>${feature.properties?.name}</strong><br/>
            Reach: ${feature.properties?.reach} residents<br/>
            Equity Score: ${feature.properties?.equityScore}
          `
          )
          .addTo(map.current);
      });

      // Change cursor on hover
      map.current.on("mouseenter", "libraries", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "libraries", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });

      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapCenter, mapZoom]);

  // Display recommendations when received
  useEffect(() => {
    if (!map.current || !mapLoaded || !recommendations) return;

    // Convert recommendations to GeoJSON features
    // Use city center as base with offsets for different sites
    const centerLng = cityCenter?.[0] || -84.388;
    const centerLat = cityCenter?.[1] || 33.749;

    // Store site coordinates for later reference
    const coordinates: [number, number][] = [];

    const recommendedFeatures = recommendations.recommended_sites.map(
      (site, index) => {
        const coords: [number, number] = [
          centerLng + (index % 3 - 1) * 0.05,
          centerLat + (Math.floor(index / 3) - 1) * 0.05
        ];
        coordinates.push(coords);

        return {
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: coords,
          },
          properties: {
            name: site.name || `Site ${index + 1}`,
            composite_score: site.composite_score,
            poverty_rate: site.poverty_rate,
            no_internet_pct: site.no_internet_pct,
            recommendation_tier: site.recommendation_tier,
          },
        };
      }
    );

    // Update state with site coordinates
    setSiteCoordinates(coordinates);

    const recommendationsGeoJSON = {
      type: "FeatureCollection" as const,
      features: recommendedFeatures,
    };

    // Add or update recommendations layer
    if (map.current.getSource("ai-recommendations")) {
      (
        map.current.getSource("ai-recommendations") as mapboxgl.GeoJSONSource
      ).setData(recommendationsGeoJSON);
    } else {
      map.current.addSource("ai-recommendations", {
        type: "geojson",
        data: recommendationsGeoJSON,
      });

      map.current.addLayer({
        id: "ai-recommendations",
        type: "circle",
        source: "ai-recommendations",
        paint: {
          "circle-radius": 10,
          "circle-color": [
            "match",
            ["get", "recommendation_tier"],
            "top_priority",
            "#DC2626",
            "high_priority",
            "#F59E0B",
            "medium_priority",
            "#3B82F6",
            "#6B7280",
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      // Add popup on click and center map
      map.current.on("click", "ai-recommendations", (e) => {
        if (!map.current || !e.features || !e.features[0]) return;
        const feature = e.features[0];
        const props = feature.properties;

        // Center map on clicked point with smooth animation
        map.current.flyTo({
          center: e.lngLat,
          zoom: 14,
          duration: 1000,
          essential: true
        });

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <div style="font-family: system-ui; padding: 4px;">
              <strong style="color: #1f2937; font-size: 14px;">${props?.name}</strong><br/>
              <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                <div><strong>Score:</strong> ${props?.composite_score}/100</div>
                <div><strong>Poverty Rate:</strong> ${props?.poverty_rate}%</div>
                <div><strong>No Internet:</strong> ${props?.no_internet_pct}%</div>
                <div><strong>Priority:</strong> ${props?.recommendation_tier}</div>
              </div>
            </div>
          `
          )
          .addTo(map.current);
      });

      map.current.on("mouseenter", "ai-recommendations", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "ai-recommendations", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
    }

    // Enable the layer in active layers
    if (!activeLayers.includes("ai-recommendations")) {
      setActiveLayers((prev) => [...prev, "ai-recommendations"]);
    }
  }, [recommendations, mapLoaded]);

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
          "visibility",
          isActive ? "none" : "visible"
        );
      }

      return newLayers;
    });
  };

  return (
    <section className="w-full py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="civic-card relative">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {cityName ? `${cityName} WiFi Network Map` : "Interactive Site Map"}
          </h2>

          {/* Map Container */}
          <div
            className="relative w-full rounded-lg overflow-hidden"
            style={{ height: "600px" }}
          >
            <div
              ref={mapContainer}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
              }}
            />

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
              <h4 className="font-medium text-foreground mb-2">Census Data</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#19B987]" />
                  <span className="text-accent">High Poverty</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#2691FF]" />
                  <span className="text-accent">Low Internet Access</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Local Assets</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#7C3AED]" />
                  <span className="text-accent">Libraries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#DC2626]" />
                  <span className="text-accent">Community Centers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#7DBDFF]" />
                  <span className="text-accent">Transit Stops</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">WiFi Sites</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#2691FF]" />
                  <span className="text-accent">Candidate Sites</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#6B7280]" />
                  <span className="text-accent">Existing WiFi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
