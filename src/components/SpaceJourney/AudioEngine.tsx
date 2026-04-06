import React, { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, type MotionValue } from 'framer-motion';

// Interstellar-inspired theme music
const SPACE_MUSIC = "/audio/interstellar-inspired-music.mp3";

export const AudioEngine: React.FC<{ isMuted: boolean; scrollVelocity: MotionValue<number> }> = ({ isMuted, scrollVelocity }) => {
  const musicRef = useRef<HTMLAudioElement | null>(null);
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

    if (isMuted || !hasInteracted) {
      musicRef.current.pause();
    } else {
      musicRef.current.play().then(() => {
        musicRef.current!.volume = 0.4;
      }).catch(console.error);
    }
  }, [isMuted, hasInteracted]);

  return null;
};
