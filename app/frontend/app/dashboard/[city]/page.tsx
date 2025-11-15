'use client';

import { useEffect, useState, useRef } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import ChatSidebar from '@/components/ChatSidebar';
import PrioritySliders from '@/components/PrioritySliders';
import InteractiveMap from '@/components/InteractiveMap';
import RecommendationsSidebar from '@/components/RecommendationsSidebar';
import Footer from '@/components/Footer';
import type { DeploymentPlan } from '@/lib/types';

type CityData = {
  id: number;
  name: string;
  state: string;
  slug: string;
  coords: [number, number];
};

export default function DashboardPage({ params }: { params: { city: string } }) {
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<DeploymentPlan | null>(null);
  const mapRef = useRef<{ showRecommendations: (plan: DeploymentPlan) => void } | null>(null);

  useEffect(() => {
    // Retrieve city data from localStorage
    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
      const city = JSON.parse(storedCity) as CityData;
      setCityData(city);
    }
  }, []);

  const handleRecommendationsReceived = (plan: DeploymentPlan) => {
    setRecommendations(plan);
    // Notify map component to show recommendations
    if (mapRef.current && mapRef.current.showRecommendations) {
      mapRef.current.showRecommendations(plan);
    }
  };

  if (!cityData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        cityName={cityData.name}
        onRecommendationsReceived={handleRecommendationsReceived}
      />

      {/* Main Dashboard - shifts when chat is open */}
      <div className={`flex-1 transition-all duration-300 ${isChatOpen ? 'ml-[32rem]' : 'ml-0'}`}>
        <DashboardHeader
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          cityName={cityData.name}
        />

        <div className="relative">
          {/* <PrioritySliders /> */}
          <InteractiveMap
            cityCenter={cityData.coords}
            cityName={cityData.name}
            recommendations={recommendations}
          />
          {/* <RecommendationsSidebar />
          <Footer /> */}
        </div>
      </div>
    </div>
  );
}
