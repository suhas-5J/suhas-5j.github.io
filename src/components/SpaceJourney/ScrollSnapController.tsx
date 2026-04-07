import React, { useEffect, useRef, useState } from 'react';

export const ScrollSnapController: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const isLocked = useRef(false);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    // Only enable on desktop/tablets (md breakpoint and up)
    if (window.innerWidth < 768) return;

    const getDestinations = () => {
      const vh = window.innerHeight;
      return [
        0,                      // Intro
        vh * 1.75,              // Planet 1
        vh * 4.25,              // Planet 2
        vh * 6.75,              // Planet 3
        vh * 9.25,              // Planet 4
        vh * 11.75,             // Planet 5
        vh * 13.5               // Final CTA
      ];
    };

    const scrollToSection = (index: number) => {
      if (isLocked.current) return;
      
      const dests = getDestinations();
      if (index < 0 || index >= dests.length) return;

      isLocked.current = true;
      setActiveSection(index);

      // Slower, smoother scroll
      const duration = 1500; // Increased from default for smoother experience
      const start = window.scrollY;
      const change = dests[index] - start;
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function: easeInOutCubic
        const ease = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, start + change * ease);

        if (elapsed < duration) {
          requestAnimationFrame(animateScroll);
        } else {
          setTimeout(() => {
            isLocked.current = false;
          }, 200); // Small buffer
        }
      };

      requestAnimationFrame(animateScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      // Increased cooldown and added higher threshold for jitter protection
      if (isLocked.current || now - lastScrollTime.current < 1000) return;
      
      // Ignore small movements
      if (Math.abs(e.deltaY) < 30) return;

      lastScrollTime.current = now;

      if (e.deltaY > 0) {
        scrollToSection(activeSection + 1);
      } else {
        scrollToSection(activeSection - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked.current) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        scrollToSection(activeSection + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToSection(activeSection - 1);
      }
    };

    // Update active section based on current scroll position if user manually scrolls or jumps
    const handleScrollSync = () => {
      if (isLocked.current) return;
      const vh = window.innerHeight;
      const scrollPos = window.scrollY;
      const dests = getDestinations();
      
      // Find closest destination
      let closestIndex = 0;
      let minDiff = Math.abs(scrollPos - dests[0]);
      
      dests.forEach((dest, i) => {
        const diff = Math.abs(scrollPos - dest);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      });
      
      if (closestIndex !== activeSection) {
        setActiveSection(closestIndex);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollSync);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollSync);
    };
  }, [activeSection]);

  return null; // Headless controller
};
