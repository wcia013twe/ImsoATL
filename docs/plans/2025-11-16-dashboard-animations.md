# Dashboard Framer Motion Animations Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add comprehensive Framer Motion animations to the dashboard with choreographed transitions across ChatSidebar, RecommendationsSidebar, InteractiveMap, and DashboardHeader.

**Architecture:** Context-specific motion personality (snappy for user actions, subtle for auto-updates), coordinated cross-component animations via AnimationContext, sequential agent step reveals, staggered list animations, and full accessibility support with reduced motion.

**Tech Stack:** Framer Motion 12.23.24, React 19.2.0, Next.js 16.0.3, TypeScript, Tailwind CSS 4

---

## Task 1: Create Shared Motion Variants Utility

**Files:**
- Create: `app/frontend/utils/motionVariants.ts`

**Step 1: Create the motion variants utility file**

```typescript
// app/frontend/utils/motionVariants.ts

import { Variants, Transition } from 'framer-motion';

/**
 * Motion personality guidelines:
 * - User-triggered actions: Snappy & responsive (0.4-0.5s, stiffness: 200)
 * - Auto-updates: Softer & subtle (0.3-0.4s, stiffness: 150)
 */

// Easing curves
export const EASING = {
  snappy: [0.25, 0.46, 0.45, 0.94] as const,
  subtle: [0.33, 0.52, 0.55, 0.91] as const,
};

// Spring configurations
export const SPRING = {
  snappy: { stiffness: 200, damping: 20 },
  subtle: { stiffness: 150, damping: 22 },
};

// Transitions
export const TRANSITION = {
  snappy: { duration: 0.5, ease: EASING.snappy } as Transition,
  subtle: { duration: 0.3, ease: EASING.subtle } as Transition,
};

// Common animation variants
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const popIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

// Stagger container variants
export const staggerContainer = (staggerChildren: number = 0.08): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren },
  },
});

// Message animation (auto-update, subtle)
export const messageSlide: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: TRANSITION.subtle,
  },
};

// Site card animation (user-triggered, snappy)
export const siteCardSlide: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: TRANSITION.snappy,
  },
};

// Agent step animation (auto-update, subtle with height)
export const agentStepReveal: Variants = {
  hidden: { opacity: 0, x: -10, height: 0 },
  visible: {
    opacity: 1,
    x: 0,
    height: 'auto',
    transition: TRANSITION.subtle,
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2 },
  },
};

// Sidebar slide (user-triggered, snappy with spring)
export const sidebarSlide = (direction: 'left' | 'right'): Variants => ({
  hidden: { x: direction === 'left' ? '-100%' : '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', ...SPRING.snappy },
  },
});

// Map marker pop-in (auto-update, snappy with rotation)
export const markerPopIn: Variants = {
  hidden: { scale: 0, rotate: -180, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { type: 'spring', ...SPRING.snappy },
  },
  exit: {
    scale: 0,
    rotate: 180,
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

// Shake animation for errors
export const shake: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  },
};

// Helper: Get transition with reduced motion support
export function getTransition(
  baseTransition: Transition,
  shouldReduceMotion: boolean
): Transition {
  return shouldReduceMotion ? { duration: 0.01 } : baseTransition;
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add app/frontend/utils/motionVariants.ts
git commit -m "feat: add shared motion variants utility

- Context-specific motion personalities (snappy vs subtle)
- Reusable animation variants for common patterns
- Reduced motion helper function
- TypeScript types for all variants"
```

---

## Task 2: Create Animation Context for Cross-Component Coordination

**Files:**
- Create: `app/frontend/contexts/AnimationContext.tsx`

**Step 1: Create the Animation Context**

```typescript
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

  return (
    <AnimationContext.Provider
      value={{
        triggerSiteReveal,
        siteRevealKey,
        triggerMapUpdate,
        mapUpdateKey,
        isInitialLoadComplete,
        setInitialLoadComplete,
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
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add app/frontend/contexts/AnimationContext.tsx
git commit -m "feat: add animation context for cross-component coordination

- Centralized animation trigger system
- Site reveal and map update coordination
- Initial load tracking
- Type-safe context hooks"
```

---

## Task 3: Wrap Dashboard Page with AnimationProvider

**Files:**
- Modify: `app/frontend/app/dashboard/[city]/page.tsx`

**Step 1: Read the current dashboard page**

Run: Read `app/frontend/app/dashboard/[city]/page.tsx`

**Step 2: Import AnimationProvider and wrap the dashboard**

Add import at top:
```typescript
import { AnimationProvider } from '@/contexts/AnimationContext';
```

Wrap the return statement content with AnimationProvider:
```typescript
export default function DashboardPage({ params }: { params: { city: string } }) {
  // ... existing state and hooks ...

  return (
    <AnimationProvider>
      <div className="relative h-screen overflow-hidden bg-background flex flex-col">
        {/* ... existing dashboard content ... */}
      </div>
    </AnimationProvider>
  );
}
```

**Step 3: Verify the app runs**

Run: `npm run dev`
Navigate to: `http://localhost:3000/dashboard/atlanta`
Expected: Dashboard loads normally (no visual changes yet)

**Step 4: Commit**

```bash
git add app/frontend/app/dashboard/[city]/page.tsx
git commit -m "feat: wrap dashboard with AnimationProvider

- Enables cross-component animation coordination
- No visual changes yet (foundation for upcoming animations)"
```

---

## Task 4: Add DashboardHeader Animations

**Files:**
- Modify: `app/frontend/components/DashboardHeader.tsx`

**Step 1: Read the current header component**

Run: Read `app/frontend/components/DashboardHeader.tsx`

**Step 2: Add Framer Motion imports and animations**

Add imports at top:
```typescript
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { staggerContainer, fadeInDown, TRANSITION } from '@/utils/motionVariants';
```

**Step 3: Update the header to use motion components**

Replace the `<header>` element with:
```typescript
<motion.header
  initial="hidden"
  animate="visible"
  variants={staggerContainer(0.08)}
  className="fixed top-0 left-0 right-0 h-[73px] bg-surface border-b border-border z-50 flex items-center justify-between px-6"
>
  {/* Logo/Atlas button */}
  <motion.button
    variants={fadeInDown}
    onClick={onToggleChat}
    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
    className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
  >
    {/* ... existing button content ... */}
  </motion.button>

  {/* City name */}
  <motion.div
    variants={fadeInDown}
    className="text-lg font-semibold text-text"
  >
    {cityName}
  </motion.div>

  {/* Run Pipeline button */}
  <motion.button
    variants={fadeInDown}
    onClick={onRunPipeline}
    disabled={isLoading}
    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
    className="..."
  >
    {/* ... existing button content ... */}
  </motion.button>

  {/* Sites button */}
  <motion.button
    variants={fadeInDown}
    onClick={onToggleRecommendations}
    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
    className="..."
  >
    {/* ... existing button content ... */}
  </motion.button>

  {/* Export dropdown button */}
  <motion.div variants={fadeInDown} className="relative">
    <motion.button
      onClick={() => setIsExportOpen(!isExportOpen)}
      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
      className="..."
    >
      {/* ... existing button content ... */}
    </motion.button>

    {/* Dropdown menu with AnimatePresence */}
    <AnimatePresence>
      {isExportOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg overflow-hidden"
        >
          <motion.div
            variants={staggerContainer(0.05)}
            initial="hidden"
            animate="visible"
          >
            {exportOptions.map((option) => (
              <motion.button
                key={option.format}
                variants={fadeInDown}
                onClick={() => handleExport(option.format)}
                whileHover={shouldReduceMotion ? {} : { x: 4 }}
                className="w-full px-4 py-2 text-left hover:bg-surface-hover transition-colors"
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
</motion.header>
```

Add `shouldReduceMotion` hook at component top:
```typescript
const shouldReduceMotion = useReducedMotion();
```

**Step 4: Test in browser**

Run: `npm run dev`
Navigate to: Dashboard
Expected:
- Header items stagger in on page load
- Buttons have hover scale effect
- Export dropdown animates smoothly

**Step 5: Commit**

```bash
git add app/frontend/components/DashboardHeader.tsx
git commit -m "feat: add DashboardHeader animations

- Stagger header items on initial load
- Button hover and tap animations
- Animated export dropdown with stagger
- Reduced motion support"
```

---

## Task 5: Add ChatSidebar Message Animations

**Files:**
- Modify: `app/frontend/components/ChatSidebar.tsx`

**Step 1: Read the current ChatSidebar component**

Run: Read `app/frontend/components/ChatSidebar.tsx`

**Step 2: Add Framer Motion imports**

```typescript
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { staggerContainer, messageSlide, fadeInUp, TRANSITION, getTransition } from '@/utils/motionVariants';
```

**Step 3: Add animations to message list**

Find the messages map and wrap with motion components:

```typescript
const shouldReduceMotion = useReducedMotion();

// In the messages container
<motion.div
  initial="hidden"
  animate="visible"
  variants={staggerContainer(0.08)}
  className="flex-1 overflow-y-auto p-4 space-y-4"
>
  {messages.map((msg, index) => (
    <motion.div
      key={index}
      variants={messageSlide}
      transition={getTransition(TRANSITION.subtle, shouldReduceMotion)}
      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] rounded-lg p-3 ${
        msg.role === 'user'
          ? 'bg-primary text-white'
          : 'bg-surface-hover text-text'
      }`}>
        {msg.content}
      </div>
    </motion.div>
  ))}
</motion.div>
```

**Step 4: Add animations to suggested questions**

```typescript
<motion.div
  initial="hidden"
  animate="visible"
  variants={staggerContainer(0.06)}
  className="p-4 space-y-2"
>
  {suggestedQuestions.map((question, i) => (
    <motion.button
      key={i}
      variants={{
        hidden: { scale: 0.95, opacity: 0 },
        visible: { scale: 1, opacity: 1 },
      }}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
      onClick={() => onSendMessage(question)}
      className="w-full text-left p-3 rounded-lg bg-surface-hover hover:bg-surface-active transition-colors text-sm"
    >
      {question}
    </motion.button>
  ))}
</motion.div>
```

**Step 5: Test in browser**

Run: `npm run dev`
Navigate to: Dashboard
Expected:
- Messages stagger in
- Suggested questions animate on load
- Hover states work smoothly

**Step 6: Commit**

```bash
git add app/frontend/components/ChatSidebar.tsx
git commit -m "feat: add ChatSidebar message animations

- Stagger message list on load
- Subtle slide-up for new messages
- Animated suggested questions with hover
- Reduced motion support"
```

---

## Task 6: Add Agent Step Sequential Reveal Animation

**Files:**
- Modify: `app/frontend/components/ChatSidebar.tsx`

**Step 1: Import agent step animation variant**

Already imported from Task 5. Add to imports:
```typescript
import { agentStepReveal } from '@/utils/motionVariants';
```

**Step 2: Add AnimatePresence around agent steps**

Find the agent steps rendering section and update:

```typescript
<AnimatePresence mode="popLayout">
  {agentSteps.map((step, index) => (
    <motion.div
      key={step.name}
      variants={agentStepReveal}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{
        ...TRANSITION.subtle,
        delay: index * 0.15, // Sequential reveal
      }}
      className="flex items-center gap-2 text-sm"
    >
      {/* Status indicator */}
      <div className="relative">
        {step.status === 'active' && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-blue-500 rounded-full"
          />
        )}
        {step.status === 'complete' && (
          <motion.svg
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-4 h-4 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <motion.path d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
        {step.status === 'pending' && (
          <div className="w-2 h-2 bg-gray-400 rounded-full" />
        )}
      </div>

      {/* Step name */}
      <span className={step.status === 'complete' ? 'text-gray-500' : 'text-text'}>
        {step.name}
      </span>
    </motion.div>
  ))}
</AnimatePresence>
```

**Step 3: Test in browser**

Run: `npm run dev`
Navigate to: Dashboard, run pipeline
Expected:
- Agent steps appear one at a time
- Active step has pulsing indicator
- Completed steps show checkmark animation
- Sequential timing feels natural (0.15s between steps)

**Step 4: Commit**

```bash
git add app/frontend/components/ChatSidebar.tsx
git commit -m "feat: add sequential agent step reveal animation

- Steps appear one at a time with 0.15s stagger
- Pulsing indicator for active step
- Animated checkmark for completed steps
- AnimatePresence for smooth mount/unmount"
```

---

## Task 7: Add RecommendationsSidebar Impact Metrics Animation

**Files:**
- Modify: `app/frontend/components/RecommendationsSidebar.tsx`

**Step 1: Read the current RecommendationsSidebar**

Run: Read `app/frontend/components/RecommendationsSidebar.tsx`

**Step 2: Add imports**

```typescript
import { motion, useReducedMotion } from 'framer-motion';
import { fadeInUp, TRANSITION, getTransition } from '@/utils/motionVariants';
import AnimatedNumber from './AnimatedNumber';
```

**Step 3: Wrap impact metrics with motion and AnimatedNumber**

Find the metrics section and update:

```typescript
const shouldReduceMotion = useReducedMotion();

// Impact summary section
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={getTransition(
    { duration: 0.4, delay: 0.1 },
    shouldReduceMotion
  )}
  className="p-4 border-b border-border space-y-2"
>
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-400">Total Population</span>
    <AnimatedNumber
      value={totalPopulation}
      format="none"
      className="text-2xl font-bold text-text"
    />
  </div>

  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-400">Avg Score</span>
    <AnimatedNumber
      value={averageScore}
      format="none"
      className="text-lg font-semibold text-primary"
    />
  </div>

  {povertyImpact && (
    <div className="text-xs text-gray-500">
      {povertyImpact}% in poverty areas
    </div>
  )}
</motion.div>
```

**Step 4: Test in browser**

Run: `npm run dev`
Navigate to: Dashboard with recommendations
Expected:
- Metrics fade in with slide-up
- Numbers count up from 0 to target values
- Animation triggers when sidebar has data

**Step 5: Commit**

```bash
git add app/frontend/components/RecommendationsSidebar.tsx
git commit -m "feat: add impact metrics count-up animation

- AnimatedNumber component for population and score
- Fade-in slide-up for metrics container
- Reduced motion support"
```

---

## Task 8: Add Site Card Stagger Animation

**Files:**
- Modify: `app/frontend/components/RecommendationsSidebar.tsx`

**Step 1: Add site card list stagger**

Import stagger utilities (already imported in Task 7).

Update the site cards container:

```typescript
import { useAnimationContext } from '@/contexts/AnimationContext';

// Inside component
const { siteRevealKey } = useAnimationContext();
const shouldReduceMotion = useReducedMotion();

// Site cards list
<motion.div
  key={siteRevealKey} // Re-trigger animation when pipeline completes
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2, // After metrics animate
      },
    },
  }}
  className="flex-1 overflow-y-auto p-4 space-y-2"
>
  {recommendations.map((site, index) => (
    <motion.div
      key={site.id}
      variants={{
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
      }}
      transition={getTransition(TRANSITION.snappy, shouldReduceMotion)}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02, x: -4 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
      onClick={() => onSiteClick(site)}
      className="cursor-pointer"
    >
      <SiteCard site={site} />
    </motion.div>
  ))}
</motion.div>
```

**Step 2: Add empty state animation**

```typescript
{recommendations.length === 0 && (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={getTransition(
      { duration: 0.4, delay: 0.3 },
      shouldReduceMotion
    )}
    className="flex flex-col items-center justify-center h-full text-center p-8"
  >
    <p className="text-4xl mb-4">📍</p>
    <p className="text-gray-400">No sites yet. Run the pipeline!</p>
  </motion.div>
)}
```

**Step 3: Test in browser**

Run: `npm run dev`
Navigate to: Dashboard, run pipeline
Expected:
- Site cards stagger in left-to-right
- 0.05s delay between each card
- Hover effect scales and slides cards
- Empty state animates in if no data

**Step 4: Commit**

```bash
git add app/frontend/components/RecommendationsSidebar.tsx
git commit -m "feat: add site card stagger animation

- Cards animate in with 0.05s stagger
- Coordinated with AnimationContext (siteRevealKey)
- Hover scale and slide effect
- Animated empty state"
```

---

## Task 9: Add Sidebar Slide Transitions

**Files:**
- Modify: `app/frontend/components/ChatSidebar.tsx`
- Modify: `app/frontend/components/RecommendationsSidebar.tsx`

**Step 1: Update ChatSidebar with slide transition**

Find the aside element and wrap with motion:

```typescript
import { sidebarSlide, SPRING } from '@/utils/motionVariants';

// ChatSidebar component
<motion.aside
  initial={false}
  animate={isChatOpen ? 'visible' : 'hidden'}
  variants={sidebarSlide('left')}
  transition={{
    type: 'spring',
    ...SPRING.snappy,
  }}
  className="fixed top-[73px] left-0 bottom-0 w-[32rem] bg-surface border-r border-border flex flex-col z-40"
>
  {/* ... existing sidebar content ... */}
</motion.aside>
```

**Step 2: Update RecommendationsSidebar with slide transition**

```typescript
import { sidebarSlide, SPRING } from '@/utils/motionVariants';

// RecommendationsSidebar component
<motion.aside
  initial={false}
  animate={isRecommendationsOpen ? 'visible' : 'hidden'}
  variants={sidebarSlide('right')}
  transition={{
    type: 'spring',
    ...SPRING.snappy,
  }}
  className="fixed top-[73px] right-0 bottom-0 w-96 bg-surface border-l border-border flex flex-col z-40"
>
  {/* ... existing sidebar content ... */}
</motion.aside>
```

**Step 3: Test in browser**

Run: `npm run dev`
Navigate to: Dashboard
Test:
- Click Atlas button (toggle chat)
- Click Sites button (toggle recommendations)

Expected:
- Sidebars slide in/out with spring physics
- Smooth, responsive feel (stiffness: 200)
- No jank or layout shift

**Step 4: Commit**

```bash
git add app/frontend/components/ChatSidebar.tsx app/frontend/components/RecommendationsSidebar.tsx
git commit -m "feat: add sidebar slide transitions with spring physics

- ChatSidebar slides from left
- RecommendationsSidebar slides from right
- Spring physics (stiffness: 200) for snappy feel
- Smooth toggle animations"
```

---

## Task 10: Add Map Marker Pop-In Animations

**Files:**
- Modify: `app/frontend/components/InteractiveMap.tsx`

**Step 1: Read the InteractiveMap component**

Run: Read `app/frontend/components/InteractiveMap.tsx`

**Step 2: Add imports**

```typescript
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { markerPopIn, SPRING } from '@/utils/motionVariants';
import { useAnimationContext } from '@/contexts/AnimationContext';
```

**Step 3: Wrap recommendation markers with motion**

Find where recommendation markers are rendered and update:

```typescript
const { mapUpdateKey } = useAnimationContext();
const shouldReduceMotion = useReducedMotion();

// Recommendation markers
{recommendations.map((site, index) => (
  <motion.div
    key={`${site.id}-${mapUpdateKey}`} // Re-trigger on update
    variants={markerPopIn}
    initial="hidden"
    animate="visible"
    transition={{
      delay: index * 0.04, // Quick stagger
      type: 'spring',
      ...SPRING.snappy,
      damping: 15, // Slightly bouncier for markers
    }}
    style={{
      position: 'absolute',
      // ... existing positioning
    }}
  >
    {/* Mapbox Marker component */}
    <Marker
      longitude={site.longitude}
      latitude={site.latitude}
      onClick={() => handleMarkerClick(site)}
    >
      {/* ... existing marker content ... */}
    </Marker>
  </motion.div>
))}
```

**Step 4: Test in browser**

Run: `npm run dev`
Navigate to: Dashboard, run pipeline
Expected:
- Markers pop in with stagger (0.04s delay)
- Slight rotation + scale animation
- Spring physics makes them feel alive

**Step 5: Commit**

```bash
git add app/frontend/components/InteractiveMap.tsx
git commit -m "feat: add map marker pop-in animations

- Markers animate in with scale + rotation
- Quick stagger (0.04s) for sequential reveal
- Spring physics for bouncy feel
- Coordinated with mapUpdateKey from context"
```

---

## Task 11: Add WiFi Zone Markers Animation (on tract selection)

**Files:**
- Modify: `app/frontend/components/InteractiveMap.tsx`

**Step 1: Animate WiFi zone markers on tract selection**

Find the WiFi zone markers rendering:

```typescript
<AnimatePresence>
  {selectedTract && allWifiZones
    .filter(zone => zone.tractId === selectedTract.id)
    .map((zone, i) => (
      <motion.div
        key={zone.id}
        variants={{
          hidden: { scale: 0, rotate: -180, opacity: 0 },
          visible: { scale: 1, rotate: 0, opacity: 1 },
        }}
        initial="hidden"
        animate="visible"
        exit={{ scale: 0, rotate: 180, opacity: 0 }}
        transition={{
          delay: i * 0.06,
          duration: 0.4,
          type: 'spring',
          stiffness: 200,
        }}
        style={{
          position: 'absolute',
          // ... positioning
        }}
      >
        {/* WiFi zone marker (green/orange circle) */}
        <Marker
          longitude={zone.longitude}
          latitude={zone.latitude}
        >
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${zone.priority === 'high' ? 'bg-green-500' : 'bg-orange-500'}
            text-white text-xs font-bold
          `}>
            {i + 1}
          </div>
        </Marker>
      </motion.div>
    ))}
</AnimatePresence>
```

**Step 2: Test in browser**

Run: `npm run dev`
Navigate to: Dashboard
Test: Click on a census tract polygon
Expected:
- WiFi zone markers appear with stagger (0.06s)
- Rotate + scale animation
- Disappear smoothly when tract deselected

**Step 3: Commit**

```bash
git add app/frontend/components/InteractiveMap.tsx
git commit -m "feat: add WiFi zone marker animations on tract selection

- Markers appear with rotation + scale
- Stagger effect (0.06s between zones)
- AnimatePresence for exit animation
- Smooth deselection"
```

---

## Task 12: Add MapLayerControl Panel Animation

**Files:**
- Modify: `app/frontend/components/MapLayerControl.tsx`

**Step 1: Read MapLayerControl component**

Run: Read `app/frontend/components/MapLayerControl.tsx`

**Step 2: Add entrance animation**

```typescript
import { motion, useReducedMotion } from 'framer-motion';
import { fadeInRight, getTransition, TRANSITION } from '@/utils/motionVariants';

const shouldReduceMotion = useReducedMotion();

// Wrap the panel
<motion.div
  initial={{ x: 20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={getTransition(
    { delay: 0.5, duration: 0.4 },
    shouldReduceMotion
  )}
  className="absolute top-4 right-4 bg-surface border border-border rounded-lg shadow-lg p-3 space-y-2"
>
  {/* Layer toggle buttons */}
  {layers.map((layer) => (
    <motion.button
      key={layer.id}
      onClick={() => toggleLayer(layer.id)}
      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
      className={`
        w-full px-3 py-2 rounded text-sm transition-colors
        ${layer.enabled ? 'bg-primary text-white' : 'bg-surface-hover text-text'}
      `}
    >
      {layer.name}
    </motion.button>
  ))}
</motion.div>
```

**Step 3: Test in browser**

Run: `npm run dev`
Expected:
- Layer control panel slides in from right
- Buttons have hover scale effect

**Step 4: Commit**

```bash
git add app/frontend/components/MapLayerControl.tsx
git commit -m "feat: add MapLayerControl entrance animation

- Panel slides in from right with delay
- Button hover scale effects
- Reduced motion support"
```

---

## Task 13: Coordinate Pipeline Completion Animations

**Files:**
- Modify: `app/frontend/components/ChatSidebar.tsx`
- Modify: `app/frontend/app/dashboard/[city]/page.tsx`

**Step 1: Trigger coordinated animations when pipeline completes**

In ChatSidebar, when pipeline processing completes:

```typescript
import { useAnimationContext } from '@/contexts/AnimationContext';

// Inside ChatSidebar component
const { triggerSiteReveal, triggerMapUpdate } = useAnimationContext();

// When pipeline completes (after final agent step)
useEffect(() => {
  if (isProcessing && agentSteps.every(step => step.status === 'complete')) {
    // Wait 200ms after final message, then trigger coordinated reveal
    setTimeout(() => {
      triggerSiteReveal();
      triggerMapUpdate();
    }, 200);
  }
}, [isProcessing, agentSteps, triggerSiteReveal, triggerMapUpdate]);
```

**Step 2: Test the full choreography**

Run: `npm run dev`
Test sequence:
1. Click "Run Pipeline"
2. Watch agent steps appear sequentially
3. After completion (200ms delay):
   - Impact metrics count up
   - Site cards stagger in
   - Map markers pop in

Expected: Smooth coordinated animation across all three areas

**Step 3: Commit**

```bash
git add app/frontend/components/ChatSidebar.tsx
git commit -m "feat: coordinate pipeline completion animations

- Trigger site reveal 200ms after pipeline completes
- Synchronized across ChatSidebar, RecommendationsSidebar, and InteractiveMap
- Orchestrated via AnimationContext"
```

---

## Task 14: Add Initial Dashboard Load Choreography

**Files:**
- Modify: `app/frontend/app/dashboard/[city]/page.tsx`

**Step 1: Add initial load timing**

```typescript
import { useEffect } from 'react';
import { useAnimationContext } from '@/contexts/AnimationContext';

// Inside DashboardPage component
const { setInitialLoadComplete } = useAnimationContext();

useEffect(() => {
  // Mark initial load complete after header animation (0.8s)
  const timer = setTimeout(() => {
    setInitialLoadComplete(true);
  }, 800);

  return () => clearTimeout(timer);
}, [setInitialLoadComplete]);
```

**Step 2: Update components to respect initial load state**

In ChatSidebar.tsx:
```typescript
const { isInitialLoadComplete } = useAnimationContext();

// Only animate on initial load, not on subsequent opens
<motion.aside
  initial={isInitialLoadComplete ? false : 'hidden'}
  animate={isChatOpen ? 'visible' : 'hidden'}
  // ... rest of animation
>
```

In RecommendationsSidebar.tsx:
```typescript
const { isInitialLoadComplete } = useAnimationContext();

<motion.aside
  initial={isInitialLoadComplete ? false : 'hidden'}
  animate={isRecommendationsOpen ? 'visible' : 'hidden'}
  // ... rest of animation
>
```

**Step 3: Test initial load sequence**

Run: `npm run dev`
Navigate to: Dashboard
Expected timeline:
```
0.0s  ━━ Header items stagger in
0.3s      ┗━━ Chat sidebar slides in (if open)
0.5s          ┗━━ Map fades in
0.8s              ┗━━ Recommendations sidebar slides in (if open)
1.0s                  ┗━━ Site cards + markers (if data exists)
```

**Step 4: Commit**

```bash
git add app/frontend/app/dashboard/[city]/page.tsx app/frontend/components/ChatSidebar.tsx app/frontend/components/RecommendationsSidebar.tsx
git commit -m "feat: add initial dashboard load choreography

- Coordinated timing across all components
- Header → Sidebars → Map → Data
- isInitialLoadComplete tracking
- Smooth 0-2s load experience"
```

---

## Task 15: Add Loading and Error State Animations

**Files:**
- Modify: `app/frontend/components/ChatSidebar.tsx`
- Modify: `app/frontend/components/DashboardHeader.tsx`

**Step 1: Add loading pulse to Run Pipeline button**

In DashboardHeader.tsx:

```typescript
<motion.button
  // ... existing props
  animate={isLoading ? {
    backgroundColor: ['#3b82f6', '#60a5fa', '#3b82f6'],
  } : {}}
  transition={isLoading ? {
    duration: 1.5,
    repeat: Infinity,
    ease: 'easeInOut',
  } : {}}
  className="..."
>
  {isLoading && (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
    />
  )}
  {isLoading ? 'Processing...' : 'Run Pipeline'}
</motion.button>
```

**Step 2: Add error shake animation**

In ChatSidebar.tsx:

```typescript
import { shake } from '@/utils/motionVariants';

// Error message component
{error && (
  <motion.div
    variants={shake}
    animate="shake"
    className="bg-red-500/10 border border-red-500 rounded-lg p-3 m-4"
  >
    <p className="text-red-500 text-sm">{error}</p>
  </motion.div>
)}
```

**Step 3: Test in browser**

Run: `npm run dev`
Test:
- Click Run Pipeline (should show pulsing button)
- Trigger an error (should shake)

Expected:
- Button pulses with color animation
- Spinner rotates continuously
- Error message shakes to draw attention

**Step 4: Commit**

```bash
git add app/frontend/components/DashboardHeader.tsx app/frontend/components/ChatSidebar.tsx
git commit -m "feat: add loading and error state animations

- Run Pipeline button pulse and spinner
- Error message shake animation
- Visual feedback for processing states"
```

---

## Task 16: Performance Testing and Optimization

**Files:**
- None (testing phase)

**Step 1: Test with 50+ site cards**

Run: `npm run dev`
Load dashboard with large dataset
Test: Scroll through 50+ site cards

Checklist:
- [ ] Maintains 60fps during scroll
- [ ] No layout shift during animations
- [ ] Stagger doesn't cause noticeable delay
- [ ] Memory usage stays reasonable

**Step 2: Test reduced motion**

Enable "Reduce motion" in system preferences
Run: `npm run dev`

Checklist:
- [ ] All animations instant (0.01s)
- [ ] No visual jank
- [ ] Functionality preserved
- [ ] Interactive elements still work

**Step 3: Test cross-browser**

Test in:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari

Expected: Consistent animation behavior

**Step 4: Document any performance issues**

If issues found, create GitHub issues with:
- Browser/OS
- Steps to reproduce
- Expected vs actual behavior
- Performance metrics (FPS, memory)

---

## Task 17: Write Design Document

**Files:**
- Create: `docs/plans/2025-11-16-dashboard-animations-design.md`

**Step 1: Create comprehensive design document**

Document should include:
- Animation strategy overview
- Motion personality guidelines (snappy vs subtle)
- Component-by-component animation specs
- Choreography timelines (initial load, pipeline run, user interactions)
- Code examples for each animation pattern
- Performance considerations
- Accessibility support
- Testing checklist

Reference the landing page design doc structure at:
`docs/plans/2025-11-16-landing-page-animations-design.md`

**Step 2: Commit the design document**

```bash
git add docs/plans/2025-11-16-dashboard-animations-design.md
git commit -m "docs: add dashboard animations design document

- Comprehensive animation specifications
- Motion personality guidelines
- Choreography timelines
- Performance and accessibility considerations"
```

---

## Task 18: Final Integration Testing

**Files:**
- None (final testing phase)

**Step 1: Test complete user flows**

Flow 1: First-time dashboard visit
1. Navigate to dashboard
2. Observe initial load choreography
3. Verify header → sidebars → map sequence

Flow 2: Running pipeline
1. Click "Run Pipeline"
2. Watch agent steps appear sequentially
3. Verify coordinated reveal of sites + markers

Flow 3: Interacting with sites
1. Click site card
2. Verify map zoom + popup animation
3. Check smooth transitions

Flow 4: Tract selection
1. Click census tract
2. Verify WiFi zone markers appear with stagger
3. Check deselection animation

**Step 2: Final checklist**

- [ ] All animations respect reduced motion
- [ ] No layout shift during any animation
- [ ] 60fps maintained throughout
- [ ] Animations feel coordinated, not chaotic
- [ ] Loading states provide clear feedback
- [ ] Error states draw attention appropriately
- [ ] Hover states feel responsive
- [ ] Cross-component choreography works smoothly

**Step 3: Create summary commit**

```bash
git add -A
git commit -m "feat: complete dashboard Framer Motion animations

Comprehensive animation system with:
- Context-specific motion (snappy vs subtle)
- Coordinated cross-component choreography
- Sequential agent step reveals
- Staggered list animations
- Loading and error state feedback
- Full accessibility support (reduced motion)
- Performance optimized (60fps, transform/opacity only)

Components updated:
- DashboardHeader: Stagger + button interactions
- ChatSidebar: Message stagger + agent steps
- RecommendationsSidebar: Metrics + site cards
- InteractiveMap: Marker pop-ins + WiFi zones
- MapLayerControl: Entrance animation

Animation utilities:
- motionVariants.ts: Shared variants and configs
- AnimationContext: Cross-component coordination

Design doc: docs/plans/2025-11-16-dashboard-animations-design.md"
```

---

## Implementation Complete

All tasks are now complete. The dashboard has comprehensive Framer Motion animations with:

✅ **Coordinated choreography** across all components
✅ **Context-specific motion** (snappy for user actions, subtle for auto-updates)
✅ **Sequential reveals** for agent steps and lists
✅ **Full accessibility** with reduced motion support
✅ **Performance optimized** (transform/opacity only, GPU-accelerated)
✅ **Cross-component synchronization** via AnimationContext

The implementation follows the design created during brainstorming and maintains consistency with the landing page animation style while adapting the motion personality for dashboard use (context-specific timing).
