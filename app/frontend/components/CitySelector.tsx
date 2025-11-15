'use client';

import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { useRouter } from 'next/navigation';

const cities = [
  { id: 1, name: 'Atlanta, GA', state: 'Georgia', slug: 'atlanta', coords: [-84.388, 33.749] },
  // ...existing cities...
  { id: 2, name: 'Madison County, FL', state: 'Florida', slug: 'madison-county-fl', coords: [-83.4446, 30.4694] },
  { id: 3, name: 'New York, NY', state: 'New York', slug: 'new-york', coords: [-74.006, 40.7128] },
  { id: 4, name: 'Los Angeles, CA', state: 'California', slug: 'los-angeles', coords: [-118.2437, 34.0522] },
  { id: 5, name: 'Chicago, IL', state: 'Illinois', slug: 'chicago', coords: [-87.6298, 41.8781] },
  { id: 6, name: 'Houston, TX', state: 'Texas', slug: 'houston', coords: [-95.3698, 29.7604] },
  { id: 7, name: 'Phoenix, AZ', state: 'Arizona', slug: 'phoenix', coords: [-112.074, 33.4484] },
  { id: 8, name: 'Philadelphia, PA', state: 'Pennsylvania', slug: 'philadelphia', coords: [-75.1652, 39.9526] },
  { id: 9, name: 'San Antonio, TX', state: 'Texas', slug: 'san-antonio', coords: [-98.4936, 29.4241] },
  { id: 10, name: 'San Diego, CA', state: 'California', slug: 'san-diego', coords: [-117.1611, 32.7157] },
  { id: 11, name: 'Dallas, TX', state: 'Texas', slug: 'dallas', coords: [-96.797, 32.7767] },
];

type City = typeof cities[0];

export default function CitySelector() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [query, setQuery] = useState('');

  const filteredCities =
    query === ''
      ? cities
      : cities.filter((city) => {
          return city.name.toLowerCase().includes(query.toLowerCase());
        });

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
  };

  const handleGoToDashboard = () => {
    if (selectedCity) {
      // Store city data in localStorage for the dashboard
      localStorage.setItem('selectedCity', JSON.stringify(selectedCity));
      // Navigate to dashboard
      router.push(`/dashboard/${selectedCity.slug}`);
    }
  };

  return (
    <div className="space-y-4">
      <Combobox value={selectedCity} onChange={handleCitySelect}>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Search for your city and enter
          </label>
          <Combobox.Input
            className="w-full rounded-xl border-2 border-gray-700 bg-gray-900/80 backdrop-blur-md py-4 pl-6 pr-12 text-lg font-medium text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="Type city name..."
            displayValue={(city: City | null) => city?.name ?? ''}
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
            {filteredCities.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none px-6 py-3 text-gray-400">
                No cities found.
              </div>
            ) : (
              filteredCities.map((city) => (
                <Combobox.Option
                  key={city.id}
                  value={city}
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
                          {city.name}
                        </span>
                        <span
                          className={`block text-sm ${
                            active ? 'text-blue-300' : 'text-gray-500'
                          }`}
                        >
                          {city.state}
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
        disabled={!selectedCity}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg text-white transition-all duration-300 ${
          selectedCity
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30'
            : 'bg-gray-800 opacity-50 cursor-not-allowed'
        }`}
      >
        {selectedCity ? `Explore ${selectedCity.name} →` : 'Select a city to continue'}
      </button>
    </div>
  );
}
