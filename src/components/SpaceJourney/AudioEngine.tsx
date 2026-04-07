import React, { useEffect, useRef, useState } from 'react';
import { type MotionValue } from 'framer-motion';

// Interstellar-inspired theme music
const SPACE_MUSIC = "/audio/interstellar-inspired-music.mp3";

export const AudioEngine: React.FC<{ isMuted: boolean; scrollVelocity: MotionValue<number> }> = ({ isMuted, scrollVelocity }) => {
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Initialize audio elements
    if (!musicRef.current) {
      musicRef.current = new Audio(SPACE_MUSIC);
      musicRef.current.loop = true;
      musicRef.current.volume = 0.4;
    }

    const startAudio = () => {
      if (musicRef.current && !isMuted && !hasInteracted) {
        musicRef.current.play()
          .then(() => {
            setHasInteracted(true);
            console.log("Audio started successfully via user interaction.");
          })
          .catch(err => console.warn("Audio play failed:", err));
      }
    };

    // Attempt immediate play (might work if user has visited before)
    musicRef.current.play()
      .then(() => setHasInteracted(true))
      .catch(() => {
        // Fallback: listen for any meaningful interaction
        window.addEventListener('click', startAudio, { once: true });
        window.addEventListener('keydown', startAudio, { once: true });
        window.addEventListener('touchstart', startAudio, { once: true });
        window.addEventListener('mousedown', startAudio, { once: true });
      });

    return () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('keydown', startAudio);
      window.removeEventListener('touchstart', startAudio);
      window.removeEventListener('mousedown', startAudio);
    };
  }, [isMuted, hasInteracted]);

  useEffect(() => {
    if (!musicRef.current) return;

    if (isMuted) {
      musicRef.current.pause();
    } else if (hasInteracted) {
      musicRef.current.play().catch(console.error);
    }
  }, [isMuted, hasInteracted]);

  return <></>;
};
