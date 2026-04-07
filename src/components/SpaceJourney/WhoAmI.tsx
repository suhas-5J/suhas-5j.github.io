import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const WhoAmI: React.FC = () => {
  const { scrollYProgress } = useScroll({
    offset: ["start start", "center center"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });

  const opacity = useTransform(smoothProgress, [0, 0.4, 0.6], [1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.5], [1, 0.9]);
  const letterSpacing = useTransform(smoothProgress, [0, 0.5], ["0.1em", "0.5em"]);
  const blur = useTransform(smoothProgress, [0, 0.5], ["blur(0px)", "blur(10px)"]);
  const frameOpacity = useTransform(smoothProgress, [0.4, 0.8], [0, 0.05]);

  return (
    <div className="h-screen w-full flex items-center justify-center relative bg-black z-10 overflow-hidden">
      <motion.div 
        style={{ opacity, scale, filter: blur }}
        className="text-center px-4"
      >
        <motion.h1 
          style={{ letterSpacing }}
          className="text-4xl md:text-7xl lg:text-[7rem] font-space font-bold text-white uppercase italic"
        >
          Beyond The Numbers?
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mt-12 md:mt-20 text-sm md:text-lg font-space tracking-[0.3em] text-primary-finance uppercase italic max-w-2xl mx-auto leading-relaxed"
        >
          Please click anywhere or press a key to initialize audio & start experience
        </motion.div>
      </motion.div>

      {/* Deep Space Background Glow - Minimalist */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-finance/5 to-transparent opacity-20" />
      
      {/* HUD Frame Hints - Ultra Thin */}
      <motion.div 
        style={{ opacity: frameOpacity }}
        className="absolute inset-8 border-[0.5px] border-white/10 rounded-xl pointer-events-none" 
      />
    </div>
  );
};
