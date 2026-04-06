import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Navigation, Zap, Target, Radio, Activity, Compass } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { AudioEngine } from './AudioEngine';

export const CockpitHUD: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [showNitrous, setShowNitrous] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSystemOnline, setIsSystemOnline] = useState(false);

  const { scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 50, damping: 20 });

  const inertiaHeight = useTransform(smoothVelocity, [0, 2], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !isSystemOnline) {
        setIsSystemOnline(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSystemOnline]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const jumpToPlanet = (index: number) => {
    // The viewport is 100vh. Each planet is 250vh.
    // The intro section is 100vh.
    // To perfectly center the planet, we calculate the exact midpoint
    // of the Framer Motion "start end" to "end start" intersection.
    const vh = window.innerHeight;
    const destination = vh * (1.80 + 2.5 * index);

    window.scrollTo({
      top: destination,
      behavior: 'smooth'
    });
    setShowNitrous(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isSystemOnline ? 1 : 0 }}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{
        transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`
      }}
    >
      <AudioEngine isMuted={isMuted} scrollVelocity={smoothVelocity} />
      
      {/* HUD Frame - Extremely Thin & Clean */}
      <div className="absolute inset-4 md:inset-8 border-[0.5px] border-white/10 rounded-xl overflow-hidden pointer-events-none">
        {/* Booting Sequence Text */}
        <AnimatePresence>
          {isSystemOnline && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, times: [0, 0.5, 1] }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-finance font-space text-xs tracking-[1em] uppercase"
            >
              Neural Link Established
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Glass corners */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-[0.5px] border-l-[0.5px] border-primary-finance/40" />
        <div className="absolute top-0 right-0 w-32 h-32 border-t-[0.5px] border-r-[0.5px] border-primary-finance/40" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[0.5px] border-l-[0.5px] border-primary-finance/40" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[0.5px] border-r-[0.5px] border-primary-finance/40" />

        {/* Top Controls - Glassmorphism */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full pointer-events-auto">
          <div className="flex items-center gap-3 pr-6 border-r border-white/10">
            <Radio className="w-4 h-4 text-primary-finance animate-pulse" />
            <span className="text-[10px] font-space tracking-[0.2em] text-white/60 uppercase">System Active</span>
          </div>
          
          <div className="flex gap-4">
             <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            
            <button 
              onClick={() => setShowNitrous(!showNitrous)}
              className="flex items-center gap-2 px-4 py-1.5 bg-primary-finance/10 border border-primary-finance/30 text-primary-finance rounded-full hover:bg-primary-finance/20 transition-all text-[10px] uppercase font-bold tracking-widest"
            >
              <Zap className="w-3 h-3" />
              Warp Jump
            </button>
          </div>
        </div>

        {/* Side Telemetry - Clean Minimalist */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-12">
           <div className="flex flex-col gap-2">
              <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Inertia</span>
              <Activity className="w-5 h-5 text-primary-finance/60" />
              <div className="h-24 w-[1px] bg-white/10 relative">
                 <motion.div 
                   style={{ height: inertiaHeight }}
                   className="absolute top-0 w-full bg-primary-finance"
                 />
              </div>
           </div>
           <div className="flex flex-col gap-2">
              <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Orientation</span>
              <Compass className="w-5 h-5 text-primary-finance/60" />
           </div>
        </div>

        {/* Right Status Panel */}
        <AnimatePresence>
          {showNitrous && (
            <motion.div 
              initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
              className="absolute top-24 right-8 w-64 bg-black/60 backdrop-blur-2xl border border-white/10 p-6 pointer-events-auto rounded-lg shadow-2xl"
            >
              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Destinations</h4>
              <div className="space-y-4">
                {[
                  "Finance Alpha",
                  "Tech Beta",
                  "Edu Gamma",
                  "Social Delta",
                  "Orbit Final"
                ].map((name, i) => (
                  <button 
                    key={i}
                    onClick={() => jumpToPlanet(i)}
                    className="w-full text-left py-2 px-3 text-xs font-space hover:text-primary-finance transition-colors flex items-center gap-3 border-l-[0.5px] border-transparent hover:border-primary-finance"
                  >
                    <span className="text-[8px] opacity-30">0{i+1}</span>
                    {name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Readout - Integrated into the glass */}
        <div className="absolute bottom-8 left-12 right-12 flex justify-between items-end">
           <div className="flex gap-16">
              <div className="flex flex-col">
                 <span className="text-[8px] text-white/30 uppercase tracking-[0.3em] mb-1 font-bold">Current Sector</span>
                 <span className="text-sm font-space text-white/80">O-133 // DEEP SPACE</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-12">
                 <span className="text-[8px] text-white/30 uppercase tracking-[0.3em] mb-1 font-bold">Telemetry</span>
                 <span className="text-xs font-space text-white/60 tracking-tighter">HD: 142.32 | VT: 09.11 | RZ: 88.00</span>
              </div>
           </div>
           
           <div className="text-right flex flex-col items-end">
              <span className="text-[8px] text-white/30 uppercase tracking-[0.3em] mb-1 font-bold">Engine Status</span>
              <div className="flex gap-1">
                 {[...Array(12)].map((_, i) => (
                   <motion.div 
                     key={i}
                     animate={{ opacity: [0.2, 0.5, 0.2] }}
                     transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                     className="w-1 h-3 bg-primary-finance"
                   />
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Screen Dirt/Texture for Realism */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/dust.png')]" />
    </motion.div>
  );
};
