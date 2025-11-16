'use client';

import { useEffect, useState, useRef } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import ChatSidebar from '@/components/ChatSidebar';
import PrioritySliders from '@/components/PrioritySliders';
import InteractiveMap from '@/components/InteractiveMap';
import RecommendationsSidebar from '@/components/RecommendationsSidebar';
import Footer from '@/components/Footer';
import LoadingState from '@/components/LoadingState';
import { AnimationProvider, useAnimationContext } from '@/contexts/AnimationContext';
import type { DeploymentPlan } from '@/lib/types';
import type { Location } from '@/utils/boundariesApi';
import { transformPipelineToDeploymentPlan, isPipelineResponse } from '@/utils/pipelineTransform';

type CityData = Location;

// Mock recommendations for Madison County

function DashboardContent({ params }: { params: { city: string } }) {
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<DeploymentPlan | null>(null);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [tractGeometries, setTractGeometries] = useState<any>(null);
  const [allWifiZones, setAllWifiZones] = useState<Record<string, any[]>>({});
  const [chatPrompt, setChatPrompt] = useState<string>('');
  const mapRef = useRef<{
    showRecommendations: (plan: DeploymentPlan) => void;
    centerOnSite: (siteIndex: number) => void;
  } | null>(null);
  const { setInitialLoadComplete } = useAnimationContext();

  useEffect(() => {
    // Retrieve city data from localStorage
    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
      const city = JSON.parse(storedCity) as CityData;
      setCityData(city);

      // Mark initial load as complete for animation choreography
      setTimeout(() => {
        setInitialLoadComplete(true);
      }, 300);

      // Load mock recommendations for Madison County
      // if (city.slug === 'madison-county-fl') {
      //   setRecommendations(MOCK_MADISON_RECOMMENDATIONS);
      // }
    }
  }, [setInitialLoadComplete]);

  const handleRecommendationsReceived = (
    plan: DeploymentPlan,
    tractGeometries?: any,
    allWifiZones?: any
  ) => {
    setRecommendations(plan);
    setIsRecommendationsOpen(true); // Auto-open recommendations sidebar

    // Store tract geometries and WiFi zones if provided
    if (tractGeometries) {
      console.log('Setting tract geometries from chat:', tractGeometries.features?.length);
      setTractGeometries(tractGeometries);
    }
    if (allWifiZones) {
      console.log('Setting WiFi zones from chat:', Object.keys(allWifiZones).length);
      setAllWifiZones(allWifiZones);
    }

    // Notify map component to show recommendations
    if (mapRef.current && mapRef.current.showRecommendations) {
      mapRef.current.showRecommendations(plan);
    }
  };

  const handleSiteClick = (siteIndex: number) => {
    console.log('handleSiteClick called with index:', siteIndex, 'mapRef.current:', mapRef.current);
    // Center map on the clicked site
    if (mapRef.current && mapRef.current.centerOnSite) {
      console.log('Calling centerOnSite...');
      mapRef.current.centerOnSite(siteIndex);
    } else {
      console.warn('mapRef.current or centerOnSite not available');
    }
  };

  const handleTractClick = (tractId: string, tractData: any) => {
    console.log('Tract clicked in dashboard:', tractId, tractData);

    // Generate prompt for the chatbox
    const prompt = `Summarize Census Tract ${tractId}`;
    setChatPrompt(prompt);

    // Open chat sidebar if it's closed
    if (!isChatOpen) {
      setIsChatOpen(true);
    }
  };

  const handleSiteAskAI = (siteData: any, promptType: 'site' | 'tract' | 'wifi_zone') => {
    let prompt = '';

    switch (promptType) {
      case 'site':
        prompt = `Tell me more about ${siteData.siteName || 'this deployment site'}. Why was it ranked with a score of ${siteData.compositeScore}/100? What makes it a ${siteData.tier} priority? With a ${siteData.povertyRate}% poverty rate and ${siteData.noInternetPct}% of households without internet, what impact could WiFi deployment have here?`;
        break;
      case 'tract':
        prompt = `Analyze Census Tract ${siteData.geoid}. With a ${siteData.povertyRate?.toFixed(1) || 0}% poverty rate, ${siteData.coveragePercent?.toFixed(1) || 0}% WiFi coverage, and ${siteData.population?.toLocaleString() || 'N/A'} residents, what are the key opportunities and challenges for WiFi deployment in this area?`;
        break;
      case 'wifi_zone':
        prompt = `Explain the WiFi deployment zone ${siteData.zoneId} placement strategy. Why was this location ${siteData.withinBounds ? 'optimally chosen' : 'using a centroid fallback'}? What coverage and impact can we expect from this zone?`;
        break;
    }

    setChatPrompt(prompt);

    // Open chat sidebar if closed
    if (!isChatOpen) {
      setIsChatOpen(true);
    }
  };

  const handleRunPipeline = async () => {
    if (!cityData) return;

    setIsRunningPipeline(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      console.log('Running pipeline for:', {
        name: cityData.name,
        type: cityData.type,
        state: cityData.state,
        slug: cityData.slug,
      });

      const response = await fetch(`${API_BASE_URL}/api/deployment/run-pipeline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: cityData.name,
          type: cityData.type,
          state: cityData.state,
          slug: cityData.slug,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Pipeline execution failed');
      }

      const data = await response.json();
      console.log('Pipeline results:', JSON.stringify(data, null, 2));

      // Transform pipeline data to deployment plan format
      if (isPipelineResponse(data)) {
        const deploymentPlan = transformPipelineToDeploymentPlan(data);
        console.log('Transformed deployment plan:', deploymentPlan);

        // Store tract geometries for map
        if (data.data.geometries) {
          console.log('Storing tract geometries for map:', data.data.geometries.features?.length);
          setTractGeometries(data.data.geometries);
        }

        // Store all WiFi deployment zones (map of geoid -> zones)
        if (data.data.all_wifi_zones) {
          console.log('Storing WiFi zones for all tracts:', Object.keys(data.data.all_wifi_zones).length);
          setAllWifiZones(data.data.all_wifi_zones);
        }

        // Update recommendations and open sidebar
        handleRecommendationsReceived(deploymentPlan);

        // alert(`Pipeline completed successfully! Found ${data.data?.total_tracts || 0} deployment sites. Check the Sites panel for details.`);
      } else {
        throw new Error('Invalid pipeline response format');
      }
    } catch (error) {
      console.error('Error running pipeline:', error);
      alert(`Failed to run pipeline: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunningPipeline(false);
    }
  };

  if (!cityData) {
    return <LoadingState message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Chat Sidebar (Left) */}
      <ChatSidebar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        cityName={cityData.name}
        onRecommendationsReceived={handleRecommendationsReceived}
        suggestedPrompt={chatPrompt}
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
        location={cityData}
        onRunPipeline={handleRunPipeline}
        isRunningPipeline={isRunningPipeline}
      />

      {/* Main Dashboard - shifts when sidebars are open */}
      <div
        className={`flex-1 transition-all duration-300 pt-[73px] ${isChatOpen ? 'ml-[32rem]' : 'ml-0'} ${isRecommendationsOpen ? 'mr-96' : 'mr-0'}`}
      >
        <div className="relative py-5">
          {/* <PrioritySliders /> */}
          <InteractiveMap
            cityCenter={cityData.coords}
            cityName={cityData.name}
            location={cityData}
            recommendations={recommendations}
            mapRefProp={mapRef}
            tractGeometries={tractGeometries}
            allWifiZones={allWifiZones}
            onTractClick={handleTractClick}
            onSiteAskAI={handleSiteAskAI}
          />
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage({ params }: { params: { city: string } }) {
  return (
    <AnimationProvider>
      <DashboardContent params={params} />
    </AnimationProvider>
  );
}
