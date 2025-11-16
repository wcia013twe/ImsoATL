# Landing Page Framer Motion Animations Design

**Date:** 2025-11-16
**Component:** `app/frontend/components/LandingPage.tsx`
**Objective:** Add dynamic, engaging Framer Motion animations with count-up stats and scroll-triggered effects

## Animation Strategy

### Style Characteristics
- **Personality:** Snappy & Responsive
- **Timing:** 0.4-0.5s duration for most animations
- **Easing:** `[0.25, 0.46, 0.45, 0.94]` (smooth ease-out)
- **Springs:** `stiffness: 200, damping: 20`
- **Stagger Delay:** 0.15s between sequential elements

### Trigger Approach (Hybrid)
**On Page Load (0-2s):**
- Globe background
- Header badge
- Main heading
- City selector

**On Scroll Into View:**
- Impact stats (with count-up animation)
- Description text
- Mission statement

## Component-by-Component Animation Spec

### 1. Globe Background
**Timing:** 0-0.8s on load
**Animation:**
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 0.3, scale: 1 }}
  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
  className="absolute inset-0 w-full h-full opacity-30"
>
  <AnimatedGlobe />
</motion.div>
```

**Effect:** Starts slightly zoomed out and transparent, smoothly scales and fades to final state (0.3 opacity)

---

### 2. Dark Gradient Overlay
**Optional Polish:**
```tsx
<motion.div
  animate={{ opacity: [0.5, 0.6, 0.5] }}
  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-transparent to-gray-950/50 z-[5]"
/>
```

**Effect:** Subtle breathing effect (very gentle pulse) - adds life without distraction

---

### 3. Header Badge ("All Together Linked • ATL")
**Timing:** 0.3s delay after page load
**Animation:**
```tsx
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3, duration: 0.4 }}
  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gray-900/60 backdrop-blur-sm border border-gray-800"
>
  {/* badge content */}
</motion.div>
```

**Effect:** Slides down from top with fade-in

---

### 4. Main Heading
**Timing:** 0.5s delay after page load
**Animation:**
```tsx
<motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 0.5 }}
  className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight"
>
  Connecting Every Community
  <br />
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-emerald-400">
    One WiFi Network at a Time
  </span>
</motion.h1>
```

**Effect:** Fades in with subtle upward movement, gradient text becomes focal point

---

### 5. City Selector
**Timing:** 0.8s delay after page load
**Animation:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.8, duration: 0.5 }}
  className="max-w-xl mx-auto"
>
  <CitySelector />
</motion.div>
```

**Effect:** Slides up with larger offset (30px) - emphasizes key interactive element

---

### 6. Impact Stats Cards (with Count-Up)
**Timing:** Scroll-triggered when entering viewport
**Stagger:** 0.15s delay between each card (left to right)

#### Card Container Animation:
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.5, delay: index * 0.15 }}
  whileHover={{ scale: 1.02, y: -4 }}
  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-md border border-gray-800/50 p-8 hover:border-blue-500/50 transition-all duration-300"
>
  {/* card content */}
</motion.div>
```

**Viewport Config:**
- `once: true` - Animates only first time (no re-trigger)
- `margin: "-100px"` - Triggers slightly before entering viewport
- `index * 0.15` - Creates stagger effect (0s, 0.15s, 0.3s)

**Hover State:**
- Subtle lift (y: -4) and scale (1.02)
- Spring physics: `stiffness: 200, damping: 20`

#### Count-Up Number Animation:
```tsx
// Custom component for animated numbers
function AnimatedNumber({ value, format }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => {
    // Apply formatting (K, M, %) based on format prop
    return formatNumber(Math.round(latest), format);
  });
  const { ref, inView } = useInView({ once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      animate(count, value, { duration: 1.5, ease: "easeOut" });
    }
  }, [inView, value, count]);

  return <motion.div ref={ref}>{rounded}</motion.div>;
}
```

**Implementation Details:**
- Numbers count from 0 to target over 1.5s
- Starts when card enters view
- Handles formatting:
  - `135000` → "135K+"
  - `60` → "60%"
  - `2800000` → "$2.8M"
- Uses `useTransform` for smooth integer values

**Stats to Animate:**
1. **135K+** (value: 135000, format: "K+")
2. **60%** (value: 60, format: "%")
3. **$2.8M** (value: 2800000, format: "$M")

---

### 7. Description Text
**Timing:** Scroll-triggered
**Animation:**
```tsx
<motion.p
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ delay: 0.2, duration: 0.5 }}
  className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
>
  AI-powered platform helping city officials plan and deploy public WiFi networks
  that maximize equity, minimize cost, and transform communities.
</motion.p>
```

**Effect:** Appears after stats have animated in, subtle upward movement

---

### 8. Mission Statement
**Timing:** Scroll-triggered (final element)
**Animation:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ delay: 0.3, duration: 0.5 }}
  className="text-center max-w-3xl mx-auto pt-8 border-t border-gray-800/50"
>
  <p className="text-base text-gray-400 leading-relaxed">
    <span className="font-semibold text-white">All Together Linked.</span> Because when communities are connected,
    possibilities are limitless. From remote work to online education, telehealth to civic engagement—public WiFi transforms lives.
  </p>
</motion.div>
```

**Effect:** Final narrative element, reinforces story flow

---

## Technical Implementation

### Dependencies
```json
{
  "framer-motion": "^11.0.0"
}
```

### Utilities Needed

#### 1. Number Formatter
```tsx
function formatNumber(value: number, format: string): string {
  switch (format) {
    case 'K+':
      return `${Math.round(value / 1000)}K+`;
    case '%':
      return `${value}%`;
    case '$M':
      return `$${(value / 1000000).toFixed(1)}M`;
    default:
      return value.toString();
  }
}
```

#### 2. Reduced Motion Support
```tsx
import { useReducedMotion } from 'framer-motion';

function LandingPage() {
  const shouldReduceMotion = useReducedMotion();

  const getTransition = (baseTransition) => {
    if (shouldReduceMotion) {
      return { duration: 0.01 }; // Nearly instant
    }
    return baseTransition;
  };

  // Use in animations
}
```

### Component Structure
```
LandingPage.tsx (main component)
├── AnimatedGlobe (existing)
├── CitySelector (existing)
└── AnimatedNumber (new utility component)
```

---

## Accessibility

### Reduced Motion
- Check `prefers-reduced-motion` media query
- Fallback to instant transitions (0.01s duration)
- Maintain all functionality with minimal animation

### Implementation:
```tsx
const shouldReduceMotion = useReducedMotion();

// Apply to all motion components
transition={shouldReduceMotion ? { duration: 0.01 } : { duration: 0.5 }}
```

### Focus Management
- Animations don't interfere with keyboard navigation
- All interactive elements remain focusable during animation
- No animation on focus states (maintain instant feedback)

---

## Performance Considerations

### Optimization Strategies
1. **GPU Acceleration:** Use `transform` and `opacity` only (avoid layout properties)
2. **Once Viewport:** Set `viewport.once: true` on scroll animations
3. **Will-Change:** Applied automatically by Framer Motion
4. **Lazy Loading:** AnimatedGlobe already handles 3D rendering optimization

### Animation Performance Audit
- Total animations on load: 4 (Globe, Badge, Heading, Selector)
- Max concurrent scroll animations: 5 (3 stats + description + mission)
- All animations use transform/opacity (no layout thrashing)

---

## Testing Checklist

- [ ] Install framer-motion dependency
- [ ] Verify globe animation doesn't conflict with existing AnimatedGlobe
- [ ] Test count-up animations trigger correctly on scroll
- [ ] Verify stagger timing (cards should feel sequential but not slow)
- [ ] Test reduced motion fallback
- [ ] Test on mobile (ensure animations work with touch scroll)
- [ ] Verify performance (60fps target)
- [ ] Test with slow network (animations should still feel smooth)
- [ ] Verify accessibility (keyboard navigation, screen readers)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

---

## Animation Timeline Summary

```
PAGE LOAD:
0.0s  ━━ Globe starts (fade + scale)
0.3s      ┗━━ Badge slides down
0.5s          ┗━━ Heading fades up
0.8s              ┗━━ City selector slides up
[animations complete by 1.6s]

SCROLL TO STATS:
0.0s  ━━ Card 1 (slides up + count starts)
0.15s     ┗━━ Card 2 (slides up + count starts)
0.3s          ┗━━ Card 3 (slides up + count starts)
[counts finish by 1.8s after trigger]

SCROLL TO BOTTOM:
0.0s  ━━ Description fades up
0.1s      ┗━━ Mission statement fades up
```

---

## Future Enhancements (Optional)

1. **Parallax Effect:** Globe moves slightly slower than scroll
2. **Magnetic Cursor:** Stats cards subtly follow cursor on hover
3. **Gradient Animation:** Animated gradient on heading text
4. **Particle Effects:** Subtle particles around stats on hover
5. **Loading States:** Animate city selector dropdown opening

These can be added incrementally after core animations are validated.
