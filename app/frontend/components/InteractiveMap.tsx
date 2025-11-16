"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import { MAPBOX_CONFIG, MAP_LAYERS } from "@/lib/mapbox-config";
import MapLayerControl from "./MapLayerControl";
import type { DeploymentPlan } from "@/lib/types";
import { fetchBoundaryFromAPI, type Location } from "@/utils/boundariesApi";

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
  { id: "candidate-sites", label: "Candidate Sites", color: "#2691FF" },
];

export interface CandidateSite {
  name: string;
  coordinates: [number, number];
  reach?: number;
  equityScore?: number;
  [key: string]: any;
}

export default function InteractiveMap({
  cityCenter,
  cityName,
  location,
  candidateSites,
  recommendations,
  mapRefProp,
  tractGeometries,
  allWifiZones,
  onTractClick,
}: {
  cityCenter?: [number, number];
  cityName?: string;
  location?: Location;
  candidateSites?: CandidateSite[];
  recommendations?: DeploymentPlan | null;
  mapRefProp?: React.MutableRefObject<{
    showRecommendations: (plan: DeploymentPlan) => void;
    centerOnSite: (siteIndex: number) => void;
  } | null>;
  tractGeometries?: any; // GeoJSON FeatureCollection from pipeline
  allWifiZones?: Record<string, any[]>; // Map of geoid -> WiFi zones for all tracts
  onTractClick?: (tractId: string, tractData: any) => void;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeLayers, setActiveLayers] = useState<string[]>([
    "city-boundary",
  ]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [siteCoordinates, setSiteCoordinates] = useState<[number, number][]>([]);
  const [boundaryData, setBoundaryData] = useState<GeoJSON.Feature | null>(null);
  const [selectedTractId, setSelectedTractId] = useState<string | null>(null);
  const [selectedSiteCoords, setSelectedSiteCoords] = useState<[number, number] | null>(null);

  // Use provided city coordinates or default to Atlanta
  const mapCenter = cityCenter || [
    MAPBOX_CONFIG.atlantaCenter.lng,
    MAPBOX_CONFIG.atlantaCenter.lat,
  ];
  const mapZoom = cityCenter ? 11.5 : MAPBOX_CONFIG.atlantaCenter.zoom;

  // Fetch boundary data when location changes
  useEffect(() => {
    if (!location) {
      console.log('No location provided, skipping boundary fetch');
      return;
    }

    const loadBoundary = async () => {
      console.log('Fetching boundary for:', location);
      const boundary = await fetchBoundaryFromAPI(location);

      if (boundary) {
        console.log(`Successfully loaded boundary for ${location.name} (${location.type})`);
        setBoundaryData(boundary);
      } else {
        console.error(`Failed to load boundary for ${location.name}`);
      }
    };

    loadBoundary();
  }, [location]);

  // Expose methods via ref
  useEffect(() => {
    if (mapRefProp) {
      mapRefProp.current = {
        showRecommendations: (plan: DeploymentPlan) => {
          // Handle showing recommendations
          console.log('Show recommendations:', plan);
        },
        centerOnSite: (siteIndex: number) => {
          if (map.current && recommendations) {
            const site = recommendations.recommended_sites[siteIndex];
            const tractId = site.tract_id;

            // Select the tract to show polygon
            console.log('🎯 Selecting tract from sidebar click:', tractId);
            setSelectedTractId(tractId);

            // Set selected site coordinates for WiFi coverage circle
            if (siteCoordinates[siteIndex]) {
              setSelectedSiteCoords(siteCoordinates[siteIndex]);
            }

            // Try to find the tract geometry and zoom to it
            if (tractGeometries && tractGeometries.features) {
              const tractFeature = tractGeometries.features.find((f: any) =>
                f.properties?.geoid === tractId || f.properties?.GEOID === tractId
              );

              if (tractFeature && tractFeature.geometry) {
                try {
                  // Calculate bounds of the tract polygon using turf
                  const bbox = turf.bbox(tractFeature);
                  const bounds: [[number, number], [number, number]] = [
                    [bbox[0], bbox[1]],
                    [bbox[2], bbox[3]]
                  ];

                  // Fit map to tract bounds
                  map.current.fitBounds(bounds, {
                    padding: 100,
                    duration: 1000,
                    maxZoom: 13
                  });

                  console.log(`Zoomed to tract ${tractId} bounds`);
                } catch (error) {
                  console.error('Error calculating tract bounds:', error);
                  // Fallback to centroid if bounds calculation fails
                  if (siteCoordinates[siteIndex]) {
                    map.current.flyTo({
                      center: siteCoordinates[siteIndex],
                      zoom: 13,
                      duration: 1000
                    });
                  }
                }
              } else if (siteCoordinates[siteIndex]) {
                // Fallback to centroid if geometry not found
                map.current.flyTo({
                  center: siteCoordinates[siteIndex],
                  zoom: 13,
                  duration: 1000
                });
              }
            }

            // Show popup with site info after a short delay
            setTimeout(() => {
              if (!map.current || !siteCoordinates[siteIndex]) return;

              new mapboxgl.Popup()
                .setLngLat(siteCoordinates[siteIndex])
                .setHTML(
                  `
                  <div style="font-family: system-ui; padding: 4px;">
                    <strong style="color: #1f2937; font-size: 14px;">${site.name || `Site ${siteIndex + 1}`}</strong><br/>
                    <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                      <div><strong>Score:</strong> ${site.composite_score}/100</div>
                      <div><strong>Poverty Rate:</strong> ${site.poverty_rate.toFixed(2)}%</div>
                      <div><strong>No Internet:</strong> ${site.no_internet_pct.toFixed(2)}%</div>
                      <div><strong>Priority:</strong> ${site.recommendation_tier}</div>
                    </div>
                  </div>
                `
                )
                .addTo(map.current);
            }, 800);
          }
        }
      };
    }
  }, [mapRefProp, siteCoordinates, recommendations, tractGeometries]);

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

      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapCenter, mapZoom]);

  // Resize map when container size changes (e.g., when sidebars open/close)
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Use ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(() => {
      if (map.current) {
        // Small delay to ensure container has finished resizing
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
            console.log('Map resized due to container change');
          }
        }, 100);
      }
    });

    if (mapContainer.current) {
      resizeObserver.observe(mapContainer.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [mapLoaded]);

  // Add boundary to map when boundaryData is available
  useEffect(() => {
    if (!map.current || !mapLoaded || !boundaryData) return;

    console.log('Adding boundary to map:', boundaryData);

    // Remove existing boundary layer and source if present
    if (map.current.getLayer("city-boundary")) {
      map.current.removeLayer("city-boundary");
    }
    if (map.current.getSource("city-boundary")) {
      map.current.removeSource("city-boundary");
    }

    // Add boundary source
    map.current.addSource("city-boundary", {
      type: "geojson",
      data: {
        type: "FeatureCollection" as const,
        features: [boundaryData],
      },
    });

    // Add boundary layer
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

    // Calculate bounds from geometry using turf
    try {
      const bbox = turf.bbox(boundaryData);
      console.log('Calculated bounds from geometry:', bbox);

      // Convert bbox [minLng, minLat, maxLng, maxLat] to Mapbox format [[minLng, minLat], [maxLng, maxLat]]
      const bounds: [[number, number], [number, number]] = [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]]
      ];

      // Determine appropriate zoom based on location type
      const locationType = location?.type || 'city';
      const maxZoom = locationType === 'state' ? 8 : 13;

      console.log(`Fitting map to ${locationType} with maxZoom: ${maxZoom}`);
      map.current.fitBounds(bounds, {
        padding: 50,
        duration: 1000,
        maxZoom: maxZoom,
      });
    } catch (error) {
      console.error('Error calculating bounds:', error);
    }
  }, [boundaryData, mapLoaded, location]);

  // Update candidate sites when they change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing candidate sites layer and source if present
    if (map.current.getLayer("candidate-sites")) {
      map.current.removeLayer("candidate-sites");
    }
    if (map.current.getSource("candidate-sites")) {
      map.current.removeSource("candidate-sites");
    }

    // Add candidate sites if provided
    if (candidateSites && candidateSites.length > 0) {
      const candidateSitesGeoJSON = {
        type: "FeatureCollection" as const,
        features: candidateSites.map((site) => ({
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: site.coordinates,
          },
          properties: {
            ...site,
          },
        })),
      };

      map.current.addSource("candidate-sites", {
        type: "geojson",
        data: candidateSitesGeoJSON,
      });

      map.current.addLayer(MAP_LAYERS.candidateSites);

      // Add click handler for candidate sites
      map.current.on("click", "candidate-sites", (e) => {
        if (!map.current || !e.features || !e.features[0]) return;
        const feature = e.features[0];

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

      // Cursor handlers
      map.current.on("mouseenter", "candidate-sites", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "candidate-sites", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });

      console.log(`Added ${candidateSites.length} candidate sites to map`);
    }
  }, [candidateSites, mapLoaded]);

  // Display recommendations when received
  useEffect(() => {
    if (!map.current || !mapLoaded || !recommendations) return;

    console.log('Displaying recommendations on map:', {
      siteCount: recommendations.recommended_sites.length,
      hasCentroids: recommendations.recommended_sites.some(s => s.centroid)
    });

    // Store site coordinates for later reference
    const coordinates: [number, number][] = [];

    const recommendedFeatures = recommendations.recommended_sites.map(
      (site, index) => {
        // Use centroid from pipeline if available, otherwise use fallback
        let coords: [number, number];

        if (site.centroid && site.centroid.lng && site.centroid.lat) {
          // Use actual centroid from tract geometry
          coords = [site.centroid.lng, site.centroid.lat];
          if (index === 0) {
            console.log(`Using centroid for ${site.name}:`, coords);
          }
        } else {
          // Fallback to city center with offset (legacy behavior)
          const centerLng = cityCenter?.[0] || -84.388;
          const centerLat = cityCenter?.[1] || 33.749;
          coords = [
            centerLng + (index % 3 - 1) * 0.05,
            centerLat + (Math.floor(index / 3) - 1) * 0.05
          ];
          if (index === 0) {
            console.log(`Using fallback coordinates for ${site.name}:`, coords);
          }
        }

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
            tract_id: site.tract_id,
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

      // Add popup on click and zoom to tract polygon
      map.current.on("click", "ai-recommendations", (e) => {
        if (!map.current || !e.features || !e.features[0]) return;
        const feature = e.features[0];
        const props = feature.properties;
        const tractId = props?.tract_id;

        // Select the tract to show polygon
        if (tractId) {
          console.log('🎯 Selecting tract from marker click:', tractId);
          setSelectedTractId(tractId);

          // Set selected site coordinates for WiFi coverage circle
          setSelectedSiteCoords([e.lngLat.lng, e.lngLat.lat]);

          // Try to find the tract geometry and zoom to it
          if (tractGeometries && tractGeometries.features) {
            const tractFeature = tractGeometries.features.find((f: any) =>
              f.properties?.geoid === tractId || f.properties?.GEOID === tractId
            );

            if (tractFeature && tractFeature.geometry) {
              try {
                // Calculate bounds of the tract polygon
                const bbox = turf.bbox(tractFeature);
                const bounds: [[number, number], [number, number]] = [
                  [bbox[0], bbox[1]],
                  [bbox[2], bbox[3]]
                ];

                // Fit map to tract bounds
                map.current.fitBounds(bounds, {
                  padding: 100,
                  duration: 1000,
                  maxZoom: 13
                });

                console.log(`Zoomed to tract ${tractId} from marker click`);
              } catch (error) {
                console.error('Error calculating tract bounds:', error);
                // Fallback to point zoom
                map.current.flyTo({
                  center: e.lngLat,
                  zoom: 13,
                  duration: 1000,
                  essential: true
                });
              }
            } else {
              // Fallback if geometry not found
              map.current.flyTo({
                center: e.lngLat,
                zoom: 13,
                duration: 1000,
                essential: true
              });
            }
          } else {
            // Fallback if no geometries available
            map.current.flyTo({
              center: e.lngLat,
              zoom: 13,
              duration: 1000,
              essential: true
            });
          }
        }

        // Show popup after zoom animation
        setTimeout(() => {
          if (!map.current) return;
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
        }, 800);
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

  // Add tract polygon layers for click interaction
  useEffect(() => {
    if (!map.current || !mapLoaded || !tractGeometries) return;

    console.log('Adding tract geometries to map:', {
      featureCount: tractGeometries.features?.length
    });

    // Remove existing layers if present
    if (map.current.getLayer("tract-polygons-fill")) {
      map.current.removeLayer("tract-polygons-fill");
    }
    if (map.current.getLayer("tract-polygons-outline")) {
      map.current.removeLayer("tract-polygons-outline");
    }
    if (map.current.getLayer("selected-tract-fill")) {
      map.current.removeLayer("selected-tract-fill");
    }
    if (map.current.getLayer("selected-tract-outline")) {
      map.current.removeLayer("selected-tract-outline");
    }
    if (map.current.getSource("tract-polygons")) {
      map.current.removeSource("tract-polygons");
    }

    // Add source for tract polygons
    map.current.addSource("tract-polygons", {
      type: "geojson",
      data: tractGeometries,
    });

    // Add invisible fill layer for click detection
    map.current.addLayer({
      id: "tract-polygons-fill",
      type: "fill",
      source: "tract-polygons",
      paint: {
        "fill-opacity": 0, // Invisible unless selected
      },
    });

    // Add subtle outline for all tracts (always visible but subtle)
    map.current.addLayer({
      id: "tract-polygons-outline",
      type: "line",
      source: "tract-polygons",
      paint: {
        "line-color": "#94a3b8",
        "line-width": 1,
        "line-opacity": 0.3,
      },
    });

    // Add fill layer for selected tract
    map.current.addLayer({
      id: "selected-tract-fill",
      type: "fill",
      source: "tract-polygons",
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "coverage_percent"],
          0, "#DC2626",      // 0% coverage = Red
          25, "#F59E0B",     // 25% = Orange
          50, "#FCD34D",     // 50% = Yellow
          75, "#A3E635",     // 75% = Light green
          100, "#19B987"     // 100% = Green
        ],
        "fill-opacity": [
          "case",
          ["==", ["get", "geoid"], selectedTractId || ""],
          0.5,  // Show selected tract
          0     // Hide others
        ],
      },
    });

    // Add outline layer for selected tract
    map.current.addLayer({
      id: "selected-tract-outline",
      type: "line",
      source: "tract-polygons",
      paint: {
        "line-color": "#1e40af",
        "line-width": [
          "case",
          ["==", ["get", "geoid"], selectedTractId || ""],
          3,  // Thick outline for selected
          0   // No outline for others
        ],
        "line-opacity": 1,
      },
    });

    // Cursor pointer on hover
    map.current.on("mouseenter", "tract-polygons-fill", () => {
      if (map.current) map.current.getCanvas().style.cursor = "pointer";
    });

    map.current.on("mouseleave", "tract-polygons-fill", () => {
      if (map.current) map.current.getCanvas().style.cursor = "";
    });

    console.log('✓ Tract polygon layers added. Selected tract:', selectedTractId);
  }, [tractGeometries, mapLoaded, selectedTractId]);

  // Debug: Log when selectedTractId changes
  useEffect(() => {
    if (selectedTractId) {
      console.log('📍 Selected tract ID changed to:', selectedTractId);
    } else {
      console.log('📍 Tract deselected');
    }
  }, [selectedTractId]);

  // Add WiFi coverage circle (only shows for selected site)
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing coverage layer if present
    if (map.current.getLayer('wifi-coverage-circle')) {
      map.current.removeLayer('wifi-coverage-circle');
    }
    if (map.current.getSource('wifi-coverage-circle')) {
      map.current.removeSource('wifi-coverage-circle');
    }

    // Only show if a site is selected
    if (selectedSiteCoords) {
      console.log('🛜 Showing WiFi coverage circle at:', selectedSiteCoords);

      // Create circle GeoJSON
      const coverageGeoJSON = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: selectedSiteCoords,
            },
            properties: {},
          },
        ],
      };

      // Add source
      map.current.addSource('wifi-coverage-circle', {
        type: 'geojson',
        data: coverageGeoJSON,
      });

      // Add coverage circle layer (400m radius, typical WiFi range)
      map.current.addLayer({
        id: 'wifi-coverage-circle',
        type: 'circle',
        source: 'wifi-coverage-circle',
        paint: {
          'circle-radius': [
            'interpolate',
            ['exponential', 2],
            ['zoom'],
            8, 2,    // At zoom 8, 2px radius
            10, 8,   // At zoom 10, 8px radius
            12, 20,  // At zoom 12, 20px radius
            14, 50,  // At zoom 14, 50px radius (represents ~400m)
            16, 100, // At zoom 16, 100px radius
          ],
          'circle-color': '#10b981', // Green
          'circle-opacity': 0.15,
          'circle-stroke-color': '#10b981',
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.4,
        },
      }, 'ai-recommendations'); // Place below markers so markers stay on top

      console.log('✓ WiFi coverage circle added');
    }
  }, [selectedSiteCoords, mapLoaded]);

  // Add WiFi deployment zone markers (only for selected tract)
  useEffect(() => {
    if (!map.current || !mapLoaded || !allWifiZones) return;

    // Only show WiFi zones if a tract is selected
    if (!selectedTractId) {
      // Remove WiFi zones if no tract selected
      if (map.current.getLayer('wifi-zones')) {
        map.current.removeLayer('wifi-zones');
      }
      if (map.current.getLayer('wifi-zones-labels')) {
        map.current.removeLayer('wifi-zones-labels');
      }
      if (map.current.getSource('wifi-zones')) {
        map.current.removeSource('wifi-zones');
      }
      return;
    }

    // Get WiFi zones for the selected tract
    const wifiZones = allWifiZones[selectedTractId];
    if (!wifiZones || wifiZones.length === 0) {
      console.log('No WiFi zones for selected tract:', selectedTractId);
      return;
    }

    console.log('Adding WiFi deployment zones for tract', selectedTractId, ':', wifiZones.length);

    // Create GeoJSON features for WiFi zones
    const wifiZoneFeatures = wifiZones.map((zone) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [zone.lng, zone.lat],
      },
      properties: {
        zone_id: zone.zone_id,
        offset_km: zone.offset_from_centroid_km,
        within_bounds: zone.within_bounds,
        fallback: zone.fallback_to_centroid || false,
      },
    }));

    const wifiZonesGeoJSON = {
      type: 'FeatureCollection' as const,
      features: wifiZoneFeatures,
    };

    // Remove existing WiFi zones layer if present
    if (map.current.getLayer('wifi-zones')) {
      map.current.removeLayer('wifi-zones');
    }
    if (map.current.getLayer('wifi-zones-labels')) {
      map.current.removeLayer('wifi-zones-labels');
    }
    if (map.current.getSource('wifi-zones')) {
      map.current.removeSource('wifi-zones');
    }

    // Add WiFi zones source and layer
    map.current.addSource('wifi-zones', {
      type: 'geojson',
      data: wifiZonesGeoJSON,
    });

    // Add WiFi zone markers (green WiFi icons)
    map.current.addLayer({
      id: 'wifi-zones',
      type: 'circle',
      source: 'wifi-zones',
      paint: {
        'circle-radius': 12,
        'circle-color': [
          'case',
          ['get', 'fallback'],
          '#FFA500', // Orange for fallback zones
          '#10b981'  // Green for valid zones
        ],
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.9,
      },
    });

    // Add zone labels (1, 2, 3)
    map.current.addLayer({
      id: 'wifi-zones-labels',
      type: 'symbol',
      source: 'wifi-zones',
      layout: {
        'text-field': ['get', 'zone_id'],
        'text-size': 12,
        'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
      },
      paint: {
        'text-color': '#ffffff',
      },
    });

    // Add click handler for WiFi zones
    map.current.on('click', 'wifi-zones', (e) => {
      if (!e.features || !e.features[0] || !map.current) return;
      const props = e.features[0].properties;

      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `
          <div style="font-family: system-ui; padding: 8px;">
            <strong style="color: #1f2937; font-size: 14px;">WiFi Zone ${props?.zone_id}</strong><br/>
            <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
              <div><strong>Status:</strong> ${props?.within_bounds ? '✓ Optimally placed' : '⚠ Using centroid'}</div>
              <div><strong>Coverage:</strong> ~400m radius</div>
            </div>
          </div>
        `
        )
        .addTo(map.current);
    });

    // Add hover effect
    map.current.on('mouseenter', 'wifi-zones', () => {
      if (map.current) map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'wifi-zones', () => {
      if (map.current) map.current.getCanvas().style.cursor = '';
    });

    console.log('✓ WiFi zones added to map');
  }, [allWifiZones, selectedTractId, mapLoaded]);

  // Handle clicks on tract polygons
  useEffect(() => {
    if (!map.current || !mapLoaded || !tractGeometries) return;

    const handleTractClick = (e: any) => {
      if (!e.features || !e.features[0]) return;
      const feature = e.features[0];
      const tractId = feature.properties?.geoid || feature.properties?.GEOID;

      console.log('Tract clicked:', tractId);

      // Toggle selection
      if (selectedTractId === tractId) {
        setSelectedTractId(null); // Deselect if clicking same tract
      } else {
        setSelectedTractId(tractId); // Select new tract

        // Show popup with tract info
        const props = feature.properties;
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <div style="font-family: system-ui; padding: 8px; min-width: 200px;">
              <strong style="color: #1f2937; font-size: 14px;">Census Tract ${tractId}</strong>
              <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                <div style="margin: 4px 0;"><strong>Coverage:</strong> ${props?.coverage_percent?.toFixed(1) || 0}%</div>
                <div style="margin: 4px 0;"><strong>Population:</strong> ${props?.population?.toLocaleString() || 'N/A'}</div>
                <div style="margin: 4px 0;"><strong>Poverty Rate:</strong> ${props?.poverty_rate?.toFixed(1) || 0}%</div>
                <div style="margin: 4px 0;"><strong>Impact Score:</strong> ${props?.impact_score?.toFixed(1) || 'N/A'}</div>
                ${props?.deployment_rank ? `<div style="margin: 4px 0;"><strong>Rank:</strong> #${props.deployment_rank}</div>` : ''}
              </div>
            </div>
          `
          )
          .addTo(map.current!);
      }
    };

    map.current.on("click", "tract-polygons-fill", handleTractClick);

    return () => {
      if (map.current) {
        map.current.off("click", "tract-polygons-fill", handleTractClick);
      }
    };
  }, [mapLoaded, tractGeometries, selectedTractId]);

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
          <div className="mt-4 flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#2691FF]" />
              <span className="text-accent">Boundary</span>
            </div>
            {candidateSites && candidateSites.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#2691FF]" />
                <span className="text-accent">Candidate Sites</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
