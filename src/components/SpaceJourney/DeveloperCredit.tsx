import React, { useState, useEffect } from 'react';

const WORDS = [
  "Developed",
  "Engineered",
  "Architected",
  "Prompted",
  "Designed",
  "Crafted"
];

export const DeveloperCredit: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start glitch effect
      setIsGlitching(true);
      
      // Change the word right in the middle of the glitch
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % WORDS.length);
      }, 150); 
      
      // End glitch effect
      setTimeout(() => {
        setIsGlitching(false);
      }, 300); 
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentWord = WORDS[index];

  return (
    <div className="flex items-center justify-center gap-2 text-xs font-space text-white/40 tracking-widest uppercase italic">
      <div className="relative whitespace-nowrap">
        <span className={isGlitching ? "opacity-0" : "opacity-100"}>
          {currentWord}
        </span>
        
        {/* Glitch Layers */}
        {isGlitching && (
          <>
            <span className="absolute left-0 top-0 text-red-500 mix-blend-screen translate-x-[2px] animate-glitch">
              {currentWord}
            </span>
            <span className="absolute left-0 top-0 text-blue-500 mix-blend-screen -translate-x-[2px] animate-glitch" style={{ animationDelay: '0.1s' }}>
              {currentWord}
            </span>
          </>
        )}
      </div>
      
      <span>by</span>
      
      <a 
        href="https://github.com/VILJkid" 
        target="_blank" 
        className="text-xs font-space italic uppercase tracking-widest font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-[length:200%_auto] animate-[gradientFlow_3s_linear_infinite] text-transparent bg-clip-text hover:opacity-80 transition-all"
      >
        VILJkid
      </a>
    </div>
  );
};
