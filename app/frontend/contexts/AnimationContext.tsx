// app/frontend/contexts/AnimationContext.tsx
'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AnimationContextValue {
  // Trigger site reveal animation (when pipeline completes)
  triggerSiteReveal: () => void;
  siteRevealKey: number;

  // Trigger map update animation
  triggerMapUpdate: () => void;
  mapUpdateKey: number;

  // Track if initial load is complete
  isInitialLoadComplete: boolean;
  setInitialLoadComplete: (complete: boolean) => void;
}

const AnimationContext = createContext<AnimationContextValue | undefined>(undefined);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [siteRevealKey, setSiteRevealKey] = useState(0);
  const [mapUpdateKey, setMapUpdateKey] = useState(0);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  const triggerSiteReveal = useCallback(() => {
    setSiteRevealKey(prev => prev + 1);
  }, []);

  const triggerMapUpdate = useCallback(() => {
    setMapUpdateKey(prev => prev + 1);
  }, []);

  const handleSetInitialLoadComplete = useCallback((complete: boolean) => {
    setIsInitialLoadComplete(complete);
  }, []);

  return (
    <AnimationContext.Provider
      value={{
        triggerSiteReveal,
        siteRevealKey,
        triggerMapUpdate,
        mapUpdateKey,
        isInitialLoadComplete,
        setInitialLoadComplete: handleSetInitialLoadComplete,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimationContext() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within AnimationProvider');
  }
  return context;
}
