'use client';

import { useState } from 'react';
import { content } from '@/lib/content';

export default function ExportTools() {
  const [selectedFormat, setSelectedFormat] = useState<string>('PDF Summary');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      alert(`Exporting as ${selectedFormat}...`);
    }, 1000);
  };

  return (
    <section className="w-full py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="civic-card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {content.export.heading}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {content.export.description}
          </p>

          <div className="grid grid-cols-2 gap-6">
            {/* Format Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Select Export Format
              </h3>
              <div className="space-y-2">
                {content.export.formats.map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className="w-full px-4 py-3 text-left rounded-lg border-2 transition-colors font-medium"
                    style={{
                      borderColor:
                        selectedFormat === format
                          ? 'var(--civic-blue-500)'
                          : '#E5E7EB',
                      backgroundColor:
                        selectedFormat === format
                          ? '#E8F4FF'
                          : 'white',
                      color:
                        selectedFormat === format
                          ? 'var(--civic-blue-500)'
                          : '#374151',
                    }}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Report Preview */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Report Will Include
              </h3>
              <ul className="space-y-2">
                {content.export.reportSections.map((section, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-civic-green mt-0.5">✓</span>
                    <span>{section}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Export Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              className="px-6 py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Preview Report
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-6 py-2 font-medium text-white rounded-lg transition-colors disabled:opacity-50"
              style={{
                backgroundColor: isExporting ? '#9CA3AF' : 'var(--civic-blue-500)',
              }}
            >
              {isExporting ? 'Exporting...' : `Export ${selectedFormat}`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
