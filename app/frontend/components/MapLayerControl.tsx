'use client';

import { useState } from 'react';

type LayerControlProps = {
  layers: {
    id: string;
    label: string;
    color: string;
    description?: string;
  }[];
  activeLayers: string[];
  onToggle: (layerId: string) => void;
};

export default function MapLayerControl({
  layers,
  activeLayers,
  onToggle,
}: LayerControlProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="absolute top-4 right-4 bg-surface rounded-lg shadow-lg max-w-xs z-10 border border-border">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Map Layers</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-lg hover:bg-surface-hover transition-colors text-muted hover:text-foreground"
          title={isExpanded ? 'Hide map key' : 'Show map key'}
        >
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-4 space-y-2">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => onToggle(layer.id)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-surface-hover"
            >
              <div
                className="w-4 h-4 rounded shrink-0 border-2"
                style={{
                  backgroundColor: activeLayers.includes(layer.id) ? layer.color : 'transparent',
                  borderColor: layer.color,
                }}
              />
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-foreground">{layer.label}</div>
                {layer.description && (
                  <div className="text-xs text-muted">{layer.description}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
