'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
}

export default function Globe3D() {
  const [arcsData, setArcsData] = useState<ArcData[]>([]);

  // Generate random arcs data
  useEffect(() => {
    const N = 30;
    const generatedArcs = [...Array(N).keys()].map(() => ({
      startLat: (Math.random() - 0.5) * 180,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 180,
      endLng: (Math.random() - 0.5) * 360,
      color: ['#10b981', '#10b981'] as [string, string] // All green arcs
    }));
    setArcsData(generatedArcs);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0a1628] overflow-hidden">
      {typeof window !== 'undefined' && (
        <div
          className="absolute"
          style={{
            left: '50%',
            top: '75%',
            transform: 'translate(-50%, -50%)',
            filter: 'brightness(1.3) contrast(1.1)',
          }}
        >
          <Globe
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundColor="rgba(100,100,100,50)"
            arcsData={arcsData}
            arcColor={'color'}
            arcDashLength={() => Math.random()}
            arcDashGap={() => Math.random()}
            arcDashAnimateTime={() => Math.random() * 8000 + 2000}
            arcStroke={0.5}
            atmosphereColor="#10b981"
            atmosphereAltitude={0.3}
            width={typeof window !== 'undefined' ? window.innerWidth * 2 : 3840}
            height={typeof window !== 'undefined' ? window.innerHeight * 2 : 2160}
          />
        </div>
      )}

      {/* Enhanced glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 75%, rgba(16, 185, 129, 0.15) 0%, transparent 40%),
            radial-gradient(circle at center, transparent 40%, rgba(10, 22, 40, 0.7) 100%)
          `,
        }}
      />

      {/* Additional atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 75%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}
