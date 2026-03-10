'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  active: boolean;
}

interface SpaceSceneProps {
  streak?: number;
  bgColor?: string;
  className?: string;
}

const LAYER_CONFIG = [
  { count: 200, speedBase: 0.2, sizeMin: 1, sizeMax: 2 },  // distant
  { count: 100, speedBase: 0.5, sizeMin: 2, sizeMax: 3 },  // medium
  { count: 50,  speedBase: 1.0, sizeMin: 3, sizeMax: 5 },  // near
];

export function SpaceScene({ streak = 0, bgColor = '#0F172A', className }: SpaceSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[][]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animFrameRef = useRef<number>(0);
  const lastShootRef = useRef<number>(0);

  const initStars = useCallback((width: number, height: number) => {
    starsRef.current = LAYER_CONFIG.map(({ count, speedBase, sizeMin, sizeMax }) =>
      Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: sizeMin + Math.random() * (sizeMax - sizeMin),
        speed: speedBase + Math.random() * speedBase * 0.5,
        opacity: 0.4 + Math.random() * 0.6,
      }))
    );
    shootingStarsRef.current = Array.from({ length: 3 }, () => ({
      x: -200,
      y: Math.random() * height * 0.6,
      length: 80 + Math.random() * 120,
      speed: 6 + Math.random() * 4,
      opacity: 0,
      active: false,
    }));
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const speedMultiplier = 1 + Math.min(streak * 0.1, 2);

    // Clear
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw stars by layer
    starsRef.current.forEach((layer) => {
      layer.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.fill();

        // Move star
        star.x -= star.speed * speedMultiplier;
        if (star.x < -star.size) {
          star.x = width + star.size;
          star.y = Math.random() * height;
        }
      });
    });

    // Shooting stars
    const now = Date.now();
    if (now - lastShootRef.current > 4000 + Math.random() * 6000) {
      lastShootRef.current = now;
      const idle = shootingStarsRef.current.find((s) => !s.active);
      if (idle) {
        idle.x = Math.random() * width * 0.5;
        idle.y = Math.random() * height * 0.4;
        idle.opacity = 1;
        idle.active = true;
      }
    }

    shootingStarsRef.current.forEach((s) => {
      if (!s.active) return;
      const gradient = ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y + s.length * 0.3);
      gradient.addColorStop(0, `rgba(255,255,255,0)`);
      gradient.addColorStop(1, `rgba(255,255,255,${s.opacity})`);
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + s.length, s.y + s.length * 0.3);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      s.x += s.speed * 2;
      s.y += s.speed * 0.6;
      s.opacity -= 0.02;
      if (s.opacity <= 0 || s.x > width) s.active = false;
    });

    animFrameRef.current = requestAnimationFrame(draw);
  }, [streak, bgColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initStars(canvas.width, canvas.height);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [draw, initStars]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}
