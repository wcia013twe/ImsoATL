'use client';

import { useState } from 'react';
import { content, iconography } from '@/lib/content';

type PriorityValues = {
  equity: number;
  transit: number;
  population: number;
  coverage: number;
};

export default function PrioritySliders() {
  const [priorities, setPriorities] = useState<PriorityValues>({
    equity: 70,
    transit: 50,
    population: 50,
    coverage: 60,
  });

  const updatePriority = (id: keyof PriorityValues, value: number) => {
    setPriorities((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <section className="w-full py-8 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="civic-card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {content.priorities.heading}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {content.priorities.description}
          </p>

          <div className="space-y-6">
            {content.priorities.sliders.map((slider) => (
              <div key={slider.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{iconography[slider.icon as keyof typeof iconography]}</span>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        {slider.label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {slider.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-lg font-semibold" style={{ color: 'var(--civic-blue-500)' }}>
                    {priorities[slider.id as keyof PriorityValues]}%
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities[slider.id as keyof PriorityValues]}
                  onChange={(e) =>
                    updatePriority(slider.id as keyof PriorityValues, Number(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-civic"
                  style={{
                    accentColor: 'var(--civic-blue-500)',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
