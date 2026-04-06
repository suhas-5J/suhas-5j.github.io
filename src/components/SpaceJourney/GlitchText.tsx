import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        triggerGlitch();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Base layer */}
      <span className="relative z-10">{text}</span>

      {/* Glitch layers */}
      {isGlitching && (
        <>
          <span className="absolute left-0 top-0 z-20 text-red-500 opacity-50 translate-x-[2px] translate-y-[-1px] mix-blend-screen animate-pulse italic">
            {text}
          </span>
          <span className="absolute left-0 top-0 z-30 text-blue-500 opacity-50 translate-x-[-2px] translate-y-[1px] mix-blend-screen animate-pulse italic">
            {text}
          </span>
        </>
      )}

      {/* Wind drift effect for letters */}
      <div className="absolute inset-0 pointer-events-none opacity-20 italic">
         <motion.div 
            animate={{ x: [0, 5, -5, 0], y: [0, -2, 2, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="blur-sm italic"
         >
            {text}
         </motion.div>
      </div>
    </div>
  );
};
