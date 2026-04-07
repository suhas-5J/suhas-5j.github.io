import React, { useEffect, useRef, useState } from 'react';

export const ScrollSnapController: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const isLocked = useRef(false);
  const lastScrollTime = useRef(0);
  const touchStart = useRef(0);

  useEffect(() => {
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
      const duration = 1200; // Adjusted for better mobile responsiveness
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
          }, 150); 
        }
      };

      requestAnimationFrame(animateScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      if (isLocked.current || now - lastScrollTime.current < 800) return;
      
      if (Math.abs(e.deltaY) < 20) return;

      lastScrollTime.current = now;

      if (e.deltaY > 0) {
        scrollToSection(activeSection + 1);
      } else {
        scrollToSection(activeSection - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isLocked.current) return;
      const touchEnd = e.changedTouches[0].clientY;
      const diff = touchStart.current - touchEnd;

      if (Math.abs(diff) > 50) { // Threshold for swipe
        if (diff > 0) {
          scrollToSection(activeSection + 1);
        } else {
          scrollToSection(activeSection - 1);
        }
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

    // Update active section based on current scroll position
    const handleScrollSync = () => {
      if (isLocked.current) return;
      const scrollPos = window.scrollY;
      const dests = getDestinations();
      
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
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollSync);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollSync);
    };
  }, [activeSection]);

  return <></>; 
};
