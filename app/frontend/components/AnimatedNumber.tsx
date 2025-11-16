'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  format?: 'K+' | '%' | '$M' | 'none';
  className?: string;
}

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

export default function AnimatedNumber({ value, format = 'none', className = '' }: AnimatedNumberProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => formatNumber(Math.round(latest), format));
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, {
        duration: 1.5,
        ease: 'easeOut',
      });

      return controls.stop;
    }
  }, [inView, value, count]);

  return (
    <motion.div ref={ref} className={className}>
      {rounded}
    </motion.div>
  );
}
