'use client';

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
  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Map Layers</h3>
      <div className="space-y-2">
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => onToggle(layer.id)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-gray-50"
          >
            <div
              className="w-4 h-4 rounded shrink-0 border-2"
              style={{
                backgroundColor: activeLayers.includes(layer.id) ? layer.color : 'white',
                borderColor: layer.color,
              }}
            />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-gray-900">{layer.label}</div>
              {layer.description && (
                <div className="text-xs text-gray-500">{layer.description}</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
