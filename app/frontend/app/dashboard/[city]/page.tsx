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

// Mock recommendations for Madison County
const MOCK_MADISON_RECOMMENDATIONS: DeploymentPlan = {
  recommended_sites: [
    {
      name: "Madison County Courthouse Area",
      composite_score: 92.5,
      poverty_rate: 28.3,
      no_internet_pct: 35.2,
      recommendation_tier: "top_priority",
      tract_id: "12079001100"
    },
    {
      name: "Downtown Madison",
      composite_score: 88.7,
      poverty_rate: 24.1,
      no_internet_pct: 31.8,
      recommendation_tier: "top_priority",
      tract_id: "12079001200"
    },
    {
      name: "Lee Elementary School Area",
      composite_score: 85.2,
      poverty_rate: 32.5,
      no_internet_pct: 38.4,
      recommendation_tier: "high_priority",
      tract_id: "12079001300"
    },
    {
      name: "Greenville Community",
      composite_score: 82.1,
      poverty_rate: 26.9,
      no_internet_pct: 29.7,
      recommendation_tier: "high_priority",
      tract_id: "12079001400"
    },
    {
      name: "Pinetta Area",
      composite_score: 78.4,
      poverty_rate: 22.3,
      no_internet_pct: 27.1,
      recommendation_tier: "medium_priority",
      tract_id: "12079001500"
    }
  ],
  recommended_sites_count: 5,
  total_cost: 450000,
  total_reach: 12500,
  equity_score: 87.3,
  projected_impact: {
    total_population_served: 12500,
    households_without_internet_served: 4200,
    residents_in_poverty_served: 3500
  }
};

export default function DashboardPage({ params }: { params: { city: string } }) {
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<DeploymentPlan | null>(null);
  const mapRef = useRef<{
    showRecommendations: (plan: DeploymentPlan) => void;
    centerOnSite: (siteIndex: number) => void;
  } | null>(null);

  useEffect(() => {
    // Retrieve city data from localStorage
    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
      const city = JSON.parse(storedCity) as CityData;
      setCityData(city);

      // Load mock recommendations for Madison County
      if (city.slug === 'madison-county-fl') {
        setRecommendations(MOCK_MADISON_RECOMMENDATIONS);
      }
    }
  }, []);

  const handleRecommendationsReceived = (plan: DeploymentPlan) => {
    setRecommendations(plan);
    setIsRecommendationsOpen(true); // Auto-open recommendations sidebar
    // Notify map component to show recommendations
    if (mapRef.current && mapRef.current.showRecommendations) {
      mapRef.current.showRecommendations(plan);
    }
  };

  const handleSiteClick = (siteIndex: number) => {
    // Center map on the clicked site
    if (mapRef.current && mapRef.current.centerOnSite) {
      mapRef.current.centerOnSite(siteIndex);
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
      {/* Chat Sidebar (Left) */}
      <ChatSidebar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        cityName={cityData.name}
        onRecommendationsReceived={handleRecommendationsReceived}
      />

      {/* Recommendations Sidebar (Right) */}
      <RecommendationsSidebar
        isOpen={isRecommendationsOpen}
        onClose={() => setIsRecommendationsOpen(false)}
        deploymentPlan={recommendations}
        onSiteClick={handleSiteClick}
      />

      {/* Header - Fixed position, unaffected by sidebars */}
      <DashboardHeader
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onToggleRecommendations={() => setIsRecommendationsOpen(!isRecommendationsOpen)}
        cityName={cityData.name}
      />

      {/* Main Dashboard - shifts when sidebars are open */}
      <div
        className={`flex-1 transition-all duration-300 pt-[73px] ${
          isChatOpen ? 'ml-[32rem]' : 'ml-0'
        } ${
          isRecommendationsOpen ? 'mr-96' : 'mr-0'
        }`}
      >
        <div className="relative">
          {/* <PrioritySliders /> */}
          <InteractiveMap
            cityCenter={cityData.coords}
            cityName={cityData.name}
            citySlug={cityData.slug}
            recommendations={recommendations}
            mapRefProp={mapRef}
          />
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
}
