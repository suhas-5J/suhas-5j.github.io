import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const SwipeIndicator: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: [0, 0.5, 0], y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 pointer-events-none md:hidden flex flex-col items-center gap-2"
    >
      <span className="text-[8px] font-space tracking-[0.3em] text-white/40 uppercase">Swipe to Navigate</span>
      <ChevronDown className="w-4 h-4 text-white/20" />
    </motion.div>
  );
};
