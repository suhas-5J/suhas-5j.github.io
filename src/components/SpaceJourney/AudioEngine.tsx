import React, { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, type MotionValue } from 'framer-motion';

// Stable royalty-free placeholders
const SPACE_MUSIC = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3"; 
const SHIP_HUM = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";

export const AudioEngine: React.FC<{ isMuted: boolean; scrollVelocity: MotionValue<number> }> = ({ isMuted, scrollVelocity }) => {
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const humRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Initialize audio on first interaction to bypass browser blocks
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        // We just need the interaction, we don't necessarily play here
        // The second useEffect handles the actual play state
      }
    };

    window.addEventListener('scroll', handleFirstInteraction, { once: true });
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (!musicRef.current) {
      musicRef.current = new Audio(SPACE_MUSIC);
      musicRef.current.loop = true;
      musicRef.current.volume = 0; // Fade in
    }
    if (!humRef.current) {
      humRef.current = new Audio(SHIP_HUM);
      humRef.current.loop = true;
      humRef.current.volume = 0; // Fade in
    }

    if (isMuted || !hasInteracted) {
      musicRef.current.pause();
      humRef.current.pause();
    } else {
      musicRef.current.play().then(() => {
        musicRef.current!.volume = 0.2;
      }).catch(console.error);
      
      humRef.current.play().then(() => {
        humRef.current!.volume = 0.1;
      }).catch(console.error);
    }
  }, [isMuted, hasInteracted]);

  // Dynamic volume based on "speed" (scroll velocity)
  useMotionValueEvent(scrollVelocity, "change", (latest) => {
    if (humRef.current && !isMuted && hasInteracted) {
      const targetVolume = Math.min(0.4, 0.1 + (Math.abs(latest) * 2));
      humRef.current.volume = targetVolume;
      // Also slightly increase pitch for engine "rev" effect
      humRef.current.playbackRate = 1 + (Math.abs(latest) * 0.5);
    }
  });

  return null;
};
