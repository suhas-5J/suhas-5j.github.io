import React, { useEffect, useRef } from 'react';
import { useScroll, useSpring } from 'framer-motion';

interface Star {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  size: number;
  color: string;
}

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nebulaRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Warp effect based on scroll speed
  const warpScale = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: Star[] = [];
    const numStars = 1000;
    const speed = 0.5;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * width,
        prevZ: 0,
        size: Math.random() * 1.5,
        color: `rgba(255, 255, 255, ${0.3 + Math.random() * 0.7})`
      });
    }

    const update = () => {
      // Clear with very slight fade for "trail" effect
      ctx.fillStyle = 'rgba(3, 7, 18, 0.2)';
      ctx.fillRect(0, 0, width, height);

      const currentWarp = warpScale.get();
      ctx.save();
      ctx.translate(width / 2, height / 2);

      stars.forEach(star => {
        star.prevZ = star.z;
        star.z -= speed + (currentWarp * 15);

        if (star.z <= 0) {
          star.z = width;
          star.x = Math.random() * width - width / 2;
          star.y = Math.random() * height - height / 2;
          star.prevZ = star.z;
        }

        const sx = (star.x / star.z) * width;
        const sy = (star.y / star.z) * height;
        const px = (star.x / star.prevZ) * width;
        const py = (star.y / star.prevZ) * height;

        ctx.beginPath();
        ctx.strokeStyle = star.color;
        ctx.lineWidth = star.size * (1 - star.z / width);
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      });

      ctx.restore();
      requestAnimationFrame(update);
    };

    update();

    // Nebula Layer
    const nebCanvas = nebulaRef.current;
    if (nebCanvas) {
      nebCanvas.width = width;
      nebCanvas.height = height;
      const nebCtx = nebCanvas.getContext('2d');
      if (nebCtx) {
        let nebTime = 0;
        const drawNebula = () => {
          nebTime += 0.002;
          nebCtx.clearRect(0, 0, width, height);
          
          const gradient = nebCtx.createRadialGradient(
            width / 2 + Math.sin(nebTime) * 100,
            height / 2 + Math.cos(nebTime) * 100,
            0,
            width / 2,
            height / 2,
            width
          );
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.05)'); // Emerald hint
          gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.02)'); // Indigo hint
          gradient.addColorStop(1, 'transparent');
          
          nebCtx.fillStyle = gradient;
          nebCtx.fillRect(0, 0, width, height);
          requestAnimationFrame(drawNebula);
        };
        drawNebula();
      }
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      if (nebCanvas) {
        nebCanvas.width = width;
        nebCanvas.height = height;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [warpScale]);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
      <canvas ref={nebulaRef} className="fixed inset-0 z-1 pointer-events-none mix-blend-screen opacity-40" />
    </>
  );
};
