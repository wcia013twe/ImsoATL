'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
  dashLength: number;
  dashGap: number;
  dashAnimateTime: number;
}

export default function Globe3D() {
  const [arcsData, setArcsData] = useState<ArcData[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const globeRef = useRef<any>(null);

  // Ensure client-side only rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate random arcs data
  useEffect(() => {
    if (!isMounted) return;

    const N = 30;
    const generatedArcs = [...Array(N).keys()].map(() => ({
      startLat: (Math.random() - 0.5) * 180,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 180,
      endLng: (Math.random() - 0.5) * 360,
      color: ['#10b981', '#10b981'] as [string, string], // All green arcs
      dashLength: Math.random(),
      dashGap: Math.random(),
      dashAnimateTime: Math.random() * 8000 + 2000
    }));
    setArcsData(generatedArcs);
  }, [isMounted]);

  // Auto-rotate globe
  useEffect(() => {
    if (!globeRef.current) return;

    // Enable auto-rotation
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#0a1628] overflow-hidden" />
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0a1628] overflow-hidden">
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '75%',
          transform: 'translate(-50%, -50%)',
          filter: 'brightness(1.8) contrast(1.3) saturate(1.4)',
        }}
      >
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundColor="rgba(100,100,100,50)"
          arcsData={arcsData}
          arcColor={'color'}
          arcDashLength={(d: any) => d.dashLength}
          arcDashGap={(d: any) => d.dashGap}
          arcDashAnimateTime={(d: any) => d.dashAnimateTime}
          arcStroke={0.5}
          atmosphereColor="#10b981"
          atmosphereAltitude={0.3}
          width={window.innerWidth * 2}
          height={window.innerHeight * 2}
        />
      </div>

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
