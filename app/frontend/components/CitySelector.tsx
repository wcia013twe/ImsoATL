'use client';

import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { useRouter } from 'next/navigation';

// US States data
const states = [
  { id: 1, name: 'Alabama', slug: 'alabama', coords: [-86.9023, 32.3182], type: 'state' as const },
  { id: 2, name: 'Alaska', slug: 'alaska', coords: [-152.4044, 61.3707], type: 'state' as const },
  { id: 3, name: 'Arizona', slug: 'arizona', coords: [-111.0937, 33.7298], type: 'state' as const },
  { id: 4, name: 'Arkansas', slug: 'arkansas', coords: [-92.3731, 34.9697], type: 'state' as const },
  { id: 5, name: 'California', slug: 'california', coords: [-119.4179, 36.7783], type: 'state' as const },
  { id: 6, name: 'Colorado', slug: 'colorado', coords: [-105.7821, 39.5501], type: 'state' as const },
  { id: 7, name: 'Connecticut', slug: 'connecticut', coords: [-72.7554, 41.5978], type: 'state' as const },
  { id: 8, name: 'Delaware', slug: 'delaware', coords: [-75.5071, 39.3185], type: 'state' as const },
  { id: 9, name: 'Florida', slug: 'florida', coords: [-81.5158, 27.7663], type: 'state' as const },
  { id: 10, name: 'Georgia', slug: 'georgia', coords: [-83.5007, 32.9866], type: 'state' as const },
  { id: 11, name: 'Hawaii', slug: 'hawaii', coords: [-157.4983, 21.0943], type: 'state' as const },
  { id: 12, name: 'Idaho', slug: 'idaho', coords: [-114.4788, 44.2405], type: 'state' as const },
  { id: 13, name: 'Illinois', slug: 'illinois', coords: [-88.9937, 40.3495], type: 'state' as const },
  { id: 14, name: 'Indiana', slug: 'indiana', coords: [-86.2816, 39.8494], type: 'state' as const },
  { id: 15, name: 'Iowa', slug: 'iowa', coords: [-93.0977, 42.0115], type: 'state' as const },
  { id: 16, name: 'Kansas', slug: 'kansas', coords: [-96.7265, 38.5266], type: 'state' as const },
  { id: 17, name: 'Kentucky', slug: 'kentucky', coords: [-84.6701, 37.6681], type: 'state' as const },
  { id: 18, name: 'Louisiana', slug: 'louisiana', coords: [-91.8749, 31.1695], type: 'state' as const },
  { id: 19, name: 'Maine', slug: 'maine', coords: [-69.3819, 44.6939], type: 'state' as const },
  { id: 20, name: 'Maryland', slug: 'maryland', coords: [-76.6413, 39.0639], type: 'state' as const },
  { id: 21, name: 'Massachusetts', slug: 'massachusetts', coords: [-71.5301, 42.2302], type: 'state' as const },
  { id: 22, name: 'Michigan', slug: 'michigan', coords: [-84.5361, 43.3266], type: 'state' as const },
  { id: 23, name: 'Minnesota', slug: 'minnesota', coords: [-93.9196, 45.6945], type: 'state' as const },
  { id: 24, name: 'Mississippi', slug: 'mississippi', coords: [-89.6787, 32.7416], type: 'state' as const },
  { id: 25, name: 'Missouri', slug: 'missouri', coords: [-92.2896, 38.4561], type: 'state' as const },
  { id: 26, name: 'Montana', slug: 'montana', coords: [-110.3626, 46.9219], type: 'state' as const },
  { id: 27, name: 'Nebraska', slug: 'nebraska', coords: [-99.9018, 41.1254], type: 'state' as const },
  { id: 28, name: 'Nevada', slug: 'nevada', coords: [-117.0554, 38.3135], type: 'state' as const },
  { id: 29, name: 'New Hampshire', slug: 'new-hampshire', coords: [-71.5639, 43.4525], type: 'state' as const },
  { id: 30, name: 'New Jersey', slug: 'new-jersey', coords: [-74.5210, 40.2989], type: 'state' as const },
  { id: 31, name: 'New Mexico', slug: 'new-mexico', coords: [-106.2371, 34.8405], type: 'state' as const },
  { id: 32, name: 'New York', slug: 'new-york-state', coords: [-74.2179, 42.1657], type: 'state' as const },
  { id: 33, name: 'North Carolina', slug: 'north-carolina', coords: [-79.8431, 35.6301], type: 'state' as const },
  { id: 34, name: 'North Dakota', slug: 'north-dakota', coords: [-99.7840, 47.5289], type: 'state' as const },
  { id: 35, name: 'Ohio', slug: 'ohio', coords: [-82.7755, 40.3888], type: 'state' as const },
  { id: 36, name: 'Oklahoma', slug: 'oklahoma', coords: [-96.9289, 35.5653], type: 'state' as const },
  { id: 37, name: 'Oregon', slug: 'oregon', coords: [-122.0709, 44.5720], type: 'state' as const },
  { id: 38, name: 'Pennsylvania', slug: 'pennsylvania', coords: [-77.1945, 40.5908], type: 'state' as const },
  { id: 39, name: 'Rhode Island', slug: 'rhode-island', coords: [-71.5118, 41.6809], type: 'state' as const },
  { id: 40, name: 'South Carolina', slug: 'south-carolina', coords: [-80.9066, 33.8569], type: 'state' as const },
  { id: 41, name: 'South Dakota', slug: 'south-dakota', coords: [-99.4388, 44.2998], type: 'state' as const },
  { id: 42, name: 'Tennessee', slug: 'tennessee', coords: [-86.6923, 35.7478], type: 'state' as const },
  { id: 43, name: 'Texas', slug: 'texas', coords: [-97.5631, 31.0545], type: 'state' as const },
  { id: 44, name: 'Utah', slug: 'utah', coords: [-111.8910, 40.1500], type: 'state' as const },
  { id: 45, name: 'Vermont', slug: 'vermont', coords: [-72.7107, 44.0459], type: 'state' as const },
  { id: 46, name: 'Virginia', slug: 'virginia', coords: [-78.1690, 37.7693], type: 'state' as const },
  { id: 47, name: 'Washington', slug: 'washington', coords: [-121.4905, 47.4009], type: 'state' as const },
  { id: 48, name: 'West Virginia', slug: 'west-virginia', coords: [-80.9545, 38.4912], type: 'state' as const },
  { id: 49, name: 'Wisconsin', slug: 'wisconsin', coords: [-89.6165, 44.2685], type: 'state' as const },
  { id: 50, name: 'Wyoming', slug: 'wyoming', coords: [-107.3025, 42.7559], type: 'state' as const },
];

// Cities data
const cities = [
  { id: 51, name: 'Atlanta', state: 'Georgia', slug: 'atlanta', coords: [-84.388, 33.749], type: 'city' as const },
  { id: 52, name: 'Madison County', state: 'Florida', slug: 'madison-county-fl', coords: [-83.4446, 30.4694], type: 'city' as const },
  { id: 53, name: 'New York', state: 'New York', slug: 'new-york', coords: [-74.006, 40.7128], type: 'city' as const },
  { id: 54, name: 'Los Angeles', state: 'California', slug: 'los-angeles', coords: [-118.2437, 34.0522], type: 'city' as const },
  { id: 55, name: 'Chicago', state: 'Illinois', slug: 'chicago', coords: [-87.6298, 41.8781], type: 'city' as const },
  { id: 56, name: 'Houston', state: 'Texas', slug: 'houston', coords: [-95.3698, 29.7604], type: 'city' as const },
  { id: 57, name: 'Phoenix', state: 'Arizona', slug: 'phoenix', coords: [-112.074, 33.4484], type: 'city' as const },
  { id: 58, name: 'Philadelphia', state: 'Pennsylvania', slug: 'philadelphia', coords: [-75.1652, 39.9526], type: 'city' as const },
  { id: 59, name: 'San Antonio', state: 'Texas', slug: 'san-antonio', coords: [-98.4936, 29.4241], type: 'city' as const },
  { id: 60, name: 'San Diego', state: 'California', slug: 'san-diego', coords: [-117.1611, 32.7157], type: 'city' as const },
  { id: 61, name: 'Dallas', state: 'Texas', slug: 'dallas', coords: [-96.797, 32.7767], type: 'city' as const },
];

type StateOption = typeof states[0];
type CityOption = typeof cities[0];
type Location = StateOption | CityOption;

export default function CitySelector() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [query, setQuery] = useState('');

  // Combine states and cities into one searchable list
  const allLocations: Location[] = [...states, ...cities];

  const filteredLocations =
    query === ''
      ? allLocations
      : allLocations.filter((location) => {
          return location.name.toLowerCase().includes(query.toLowerCase());
        });

  const handleLocationSelect = (location: Location | null) => {
    setSelectedLocation(location);
  };

  const handleGoToDashboard = () => {
    if (selectedLocation) {
      // Store location data in localStorage for the dashboard
      localStorage.setItem('selectedCity', JSON.stringify(selectedLocation));
      // Navigate to dashboard
      router.push(`/dashboard/${selectedLocation.slug}`);
    }
  };

  const getDisplayName = (location: Location | null): string => {
    if (!location) return '';
    if (location.type === 'city') {
      return `${location.name}, ${(location as CityOption).state}`;
    }
    return location.name;
  };

  const getSubtext = (location: Location): string => {
    if (location.type === 'state') {
      return 'State';
    }
    return (location as CityOption).state;
  };

  return (
    <div className="space-y-4">
      <Combobox<Location> value={selectedLocation || undefined} onChange={handleLocationSelect}>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Search for your city or state
          </label>
          <Combobox.Input
            className="w-full rounded-xl border-2 border-gray-700 bg-gray-900/80 backdrop-blur-md py-4 pl-6 pr-12 text-lg font-medium text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="Type city or state name..."
            displayValue={(location: Location | null) => getDisplayName(location)}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-4 top-8">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Combobox.Button>

          <Combobox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-gray-900 backdrop-blur-md border border-gray-800 py-2 shadow-2xl focus:outline-none">
            {filteredLocations.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none px-6 py-3 text-gray-400">
                No locations found.
              </div>
            ) : (
              filteredLocations.map((location) => (
                <Combobox.Option
                  key={location.id}
                  value={location}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-3 pl-6 pr-4 transition-colors ${
                      active ? 'bg-blue-500/20 text-white' : 'text-gray-300'
                    }`
                  }
                >
                  {({ selected, active }) => (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`block font-medium ${selected ? 'font-semibold text-white' : ''}`}>
                          {location.name}
                        </span>
                        <span
                          className={`block text-sm ${
                            active ? 'text-blue-300' : 'text-gray-500'
                          }`}
                        >
                          {getSubtext(location)}
                        </span>
                      </div>
                      {selected && (
                        <svg
                          className="h-5 w-5 text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>

      {/* Go to Dashboard Button */}
      <button
        onClick={handleGoToDashboard}
        disabled={!selectedLocation}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg text-white transition-all duration-300 ${
          selectedLocation
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30'
            : 'bg-gray-800 opacity-50 cursor-not-allowed'
        }`}
      >
        {selectedLocation ? `Explore ${selectedLocation.name} →` : 'Select a location to continue'}
      </button>
    </div>
  );
}
