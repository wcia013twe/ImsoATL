/**
 * Mapbox Configuration
 * Layer definitions, styles, and data sources
 */

export const MAPBOX_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
  defaultStyle: 'mapbox://styles/mapbox/light-v11',
  atlantaCenter: {
    lng: -84.388,
    lat: 33.749,
    zoom: 10.5,
  },
};

export const MAP_LAYERS = {
  // Atlanta city boundary - just outlines, no fill
  atlantaBoundary: {
    id: 'atlanta-boundary',
    type: 'line' as const,
    source: 'atlanta-boundary',
    paint: {
      'line-color': '#2691FF',
      'line-width': 1.5,
      'line-opacity': 0.6,
    },
  },

  // Census heat map - poverty rate
  censusPoverty: {
    id: 'census-poverty',
    type: 'fill' as const,
    source: 'census-poverty',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'poverty_rate'],
        0, '#E8F8F3',
        10, '#A3E3CF',
        20, '#47C79F',
        30, '#19B987',
        40, '#0F6F51',
      ],
      'fill-opacity': 0.6,
    },
  },

  // Census heat map - internet access
  censusInternet: {
    id: 'census-internet',
    type: 'fill' as const,
    source: 'census-internet',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'no_internet_pct'],
        0, '#E8F4FF',
        10, '#A8D3FF',
        20, '#51A7FF',
        30, '#2691FF',
        40, '#0058B3',
      ],
      'fill-opacity': 0.6,
    },
  },

  // FCC broadband coverage
  fccBroadband: {
    id: 'fcc-broadband',
    type: 'fill' as const,
    source: 'fcc-broadband',
    paint: {
      'fill-color': [
        'match',
        ['get', 'has_coverage'],
        true, '#19B987',
        false, '#FFB84D',
        '#6B7280',
      ],
      'fill-opacity': 0.4,
    },
  },

  // Local assets - libraries
  libraries: {
    id: 'libraries',
    type: 'circle' as const,
    source: 'libraries',
    paint: {
      'circle-radius': 8,
      'circle-color': '#7C3AED',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#FFFFFF',
    },
  },

  // Local assets - community centers
  communityCenters: {
    id: 'community-centers',
    type: 'circle' as const,
    source: 'community-centers',
    paint: {
      'circle-radius': 8,
      'circle-color': '#DC2626',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#FFFFFF',
    },
  },

  // Local assets - transit stops
  transitStops: {
    id: 'transit-stops',
    type: 'circle' as const,
    source: 'transit-stops',
    paint: {
      'circle-radius': 6,
      'circle-color': '#7DBDFF',
      'circle-stroke-width': 1,
      'circle-stroke-color': '#FFFFFF',
    },
  },

  // Candidate WiFi sites
  candidateSites: {
    id: 'candidate-sites',
    type: 'circle' as const,
    source: 'candidate-sites',
    paint: {
      'circle-radius': 12,
      'circle-color': '#2691FF',
      'circle-stroke-width': 3,
      'circle-stroke-color': '#FFFFFF',
    },
  },

  // Existing WiFi coverage
  existingWifi: {
    id: 'existing-wifi',
    type: 'circle' as const,
    source: 'existing-wifi',
    paint: {
      'circle-radius': 10,
      'circle-color': '#6B7280',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#FFFFFF',
      'circle-opacity': 0.7,
    },
  },
};

export const LAYER_GROUPS = {
  'Census Data': ['census-poverty', 'census-internet'],
  'FCC Coverage': ['fcc-broadband'],
  'Local Assets': ['libraries', 'community-centers', 'transit-stops'],
  'WiFi Sites': ['candidate-sites', 'existing-wifi'],
  'Boundaries': ['atlanta-boundary'],
};
