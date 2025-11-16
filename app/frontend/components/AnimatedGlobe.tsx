'use client';

import { useEffect, useRef } from 'react';

interface Connection {
  from: { x: number; y: number };
  to: { x: number; y: number };
  progress: number;
  fromIndex: number;
  toIndex: number;
}

interface Dot {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  popProgress: number;
  active: boolean;
  activationTime: number;
}

export default function AnimatedGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const rotationRef = useRef(0);
  const dotsRef = useRef<Dot[]>([]);
  const connectionsRef = useRef<Connection[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.45;

    // Initialize dots
    const initializeDots = () => {
      const dots: Dot[] = [];
      const numDots = 25;

      for (let i = 0; i < numDots; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = centerX + radius * Math.sin(phi) * Math.cos(theta);
        const y = centerY + radius * Math.sin(phi) * Math.sin(theta);

        dots.push({
          x,
          y,
          scale: 0,
          opacity: 0,
          popProgress: 0,
          active: i === 0, // First dot starts active
          activationTime: i === 0 ? 0 : -1,
        });
      }

      return dots;
    };

    dotsRef.current = initializeDots();
    const networkStartTime = Date.now();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Rotate globe forwards
      rotationRef.current -= 0.002;

      // Draw globe atmospheric glow
      const atmosphericGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius * 1.5);
      atmosphericGlow.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      atmosphericGlow.addColorStop(0.4, 'rgba(16, 185, 129, 0.15)');
      atmosphericGlow.addColorStop(0.7, 'rgba(16, 185, 129, 0.08)');
      atmosphericGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = atmosphericGlow;
      ctx.fillRect(0, 0, width, height);

      // Draw continent-like glow patches
      const continentGlows = [
        { x: 0.2, y: 0.3, size: 0.25 },  // North America
        { x: -0.15, y: 0.25, size: 0.2 }, // Europe
        { x: 0.1, y: -0.2, size: 0.3 },  // Africa/South America
        { x: 0.4, y: 0.15, size: 0.22 }, // Asia
        { x: -0.35, y: -0.35, size: 0.18 }, // Australia
      ];

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotationRef.current);

      continentGlows.forEach(({ x, y, size }) => {
        const glowX = x * radius;
        const glowY = y * radius;
        const glowRadius = size * radius;

        const continentGlow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowRadius);
        continentGlow.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
        continentGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.2)');
        continentGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = continentGlow;
        ctx.beginPath();
        ctx.arc(glowX, glowY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // Draw globe outline with rotating effect
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotationRef.current);

      // Outer glow
      const outerGlow = ctx.createRadialGradient(0, 0, radius * 0.9, 0, 0, radius * 1.1);
      outerGlow.addColorStop(0, 'rgba(16, 185, 129, 0)');
      outerGlow.addColorStop(0.8, 'rgba(16, 185, 129, 0.3)');
      outerGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.1, 0, Math.PI * 2);
      ctx.fill();

      // Globe circle
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw latitude lines
      for (let i = 1; i < 5; i++) {
        const y = (radius * 2 * i) / 5 - radius;
        const lineRadius = Math.sqrt(radius * radius - y * y);

        ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 - i * 0.02})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, y, lineRadius, lineRadius * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw longitude lines
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * Math.abs(Math.cos(angle)), radius, angle, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      // Update and draw dots
      const currentTime = Date.now();
      dotsRef.current.forEach((dot, index) => {
        // Rotate dots with globe (forwards)
        const dx = dot.x - centerX;
        const dy = dot.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) - 0.002;

        dot.x = centerX + Math.cos(angle) * distance;
        dot.y = centerY + Math.sin(angle) * distance;

        if (dot.active) {
          // Pop animation for active dots
          dot.popProgress += 0.05;
          const popCycle = Math.sin(dot.popProgress) * 0.5 + 0.5;
          dot.scale = 0.8 + popCycle * 0.4;
          dot.opacity = 0.8 + popCycle * 0.2;

          // Draw active dot glow
          const dotGlow = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, 20 * dot.scale);
          dotGlow.addColorStop(0, `rgba(16, 185, 129, ${dot.opacity})`);
          dotGlow.addColorStop(0.5, `rgba(16, 185, 129, ${dot.opacity * 0.5})`);
          dotGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
          ctx.fillStyle = dotGlow;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 20 * dot.scale, 0, Math.PI * 2);
          ctx.fill();

          // Draw active dot
          ctx.fillStyle = `rgba(16, 185, 129, ${dot.opacity})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 5 * dot.scale, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Inactive dots are dim
          dot.scale = 0.3;
          dot.opacity = 0.2;

          // Draw inactive dot
          ctx.fillStyle = `rgba(100, 116, 139, ${dot.opacity})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Create new connections from active dots to nearby inactive dots
      const activeDots = dotsRef.current
        .map((dot, index) => ({ dot, index }))
        .filter(({ dot }) => dot.active);

      activeDots.forEach(({ dot: activeDot, index: activeIndex }) => {
        // Randomly create connections from this active dot
        if (Math.random() < 0.03) {
          // Find nearby inactive dots
          const inactiveDots = dotsRef.current
            .map((dot, index) => ({ dot, index }))
            .filter(({ dot, index }) => !dot.active && index !== activeIndex)
            .map(({ dot, index }) => {
              const dx = dot.x - activeDot.x;
              const dy = dot.y - activeDot.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              return { dot, index, distance };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5); // Get 5 closest dots

          if (inactiveDots.length > 0) {
            const target = inactiveDots[Math.floor(Math.random() * inactiveDots.length)];

            // Check if connection doesn't already exist
            const connectionExists = connectionsRef.current.some(
              (conn) => conn.fromIndex === activeIndex && conn.toIndex === target.index
            );

            if (!connectionExists) {
              connectionsRef.current.push({
                from: { x: activeDot.x, y: activeDot.y },
                to: { x: target.dot.x, y: target.dot.y },
                progress: 0,
                fromIndex: activeIndex,
                toIndex: target.index,
              });
            }
          }
        }
      });

      // Update and draw connections
      connectionsRef.current = connectionsRef.current.filter((connection) => {
        connection.progress += 0.015;

        if (connection.progress >= 1) {
          // Activate the target dot when connection completes
          const targetDot = dotsRef.current[connection.toIndex];
          if (!targetDot.active) {
            targetDot.active = true;
            targetDot.activationTime = currentTime;
          }
          return false;
        }

        const currentX = connection.from.x + (connection.to.x - connection.from.x) * connection.progress;
        const currentY = connection.from.y + (connection.to.y - connection.from.y) * connection.progress;

        // Draw connection line with gradient
        const gradient = ctx.createLinearGradient(
          connection.from.x,
          connection.from.y,
          currentX,
          currentY
        );
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
        gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.6)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.9)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(connection.from.x, connection.from.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw moving particle with glow
        const particleGlow = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 8);
        particleGlow.addColorStop(0, 'rgba(16, 185, 129, 1)');
        particleGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.6)');
        particleGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = particleGlow;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw particle core
        ctx.fillStyle = 'rgba(16, 185, 129, 1)';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
