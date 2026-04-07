import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Zap, Radio, Activity, Compass, Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { AudioEngine } from './AudioEngine';

export const CockpitHUD: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
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
    const vh = window.innerHeight;
    const destination = vh * (1.80 + 2.5 * index);

    window.scrollTo({
      top: destination,
      behavior: 'smooth'
    });
    setShowMenu(false);
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
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-finance font-space text-xs tracking-[1em] uppercase text-center"
            >
              Neural Link Established
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Glass corners (Hidden on mobile for cleaner look) */}
        <div className="hidden md:block absolute top-0 left-0 w-32 h-32 border-t-[0.5px] border-l-[0.5px] border-primary-finance/40" />
        <div className="hidden md:block absolute top-0 right-0 w-32 h-32 border-t-[0.5px] border-r-[0.5px] border-primary-finance/40" />
        <div className="hidden md:block absolute bottom-0 left-0 w-32 h-32 border-b-[0.5px] border-l-[0.5px] border-primary-finance/40" />
        <div className="hidden md:block absolute bottom-0 right-0 w-32 h-32 border-b-[0.5px] border-r-[0.5px] border-primary-finance/40" />

        {/* Top-Right Command Toggle */}
        <div className="absolute top-6 right-6 md:top-8 md:right-8 pointer-events-auto">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 hover:border-primary-finance/50 rounded-full text-white/60 hover:text-white transition-all shadow-lg"
          >
            {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Command Center Dropdown */}
        <AnimatePresence>
          {showMenu && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
              className="absolute top-20 right-6 md:top-24 md:right-8 w-[85vw] max-w-sm md:w-[30rem] bg-black/80 backdrop-blur-3xl border border-white/10 p-6 pointer-events-auto rounded-2xl shadow-2xl shadow-primary-finance/5"
            >
              {/* Audio Controls */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-primary-finance animate-pulse" />
                  <span className="text-[10px] font-space tracking-[0.2em] text-white/60 uppercase">AUDIO</span>
                </div>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/80 transition-colors"
                  title={isMuted ? "Unmute Audio" : "Mute Audio"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Jump Points */}
              <div>
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-primary-finance" /> Destinations
                </h4>
                <div className="space-y-2">
                  {[
                    "Phase 1 - Marketing Executive Trainee",
                    "Phase 2 - Finance Intern",
                    "Phase 3 - Financial Modelling Analyst Intern",
                    "Phase 4 - Accounts, Audit & Finance Executive",
                    "Phase 5 - Associate Finance"
                  ].map((name, i) => (
                    <button 
                      key={i}
                      onClick={() => jumpToPlanet(i)}
                      className="w-full text-left py-3 px-4 text-xs font-space bg-white/5 hover:bg-primary-finance/10 text-white/80 hover:text-primary-finance transition-colors rounded-lg flex items-center justify-between border border-transparent hover:border-primary-finance/30"
                    >
                      <span className="whitespace-normal leading-tight">{name}</span>
                      <span className="text-[8px] opacity-40 font-bold ml-2 shrink-0">0{i+1}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Side Telemetry - Clean Minimalist (Hidden on smaller screens) */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-12">
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

        {/* Bottom Readout - Hidden on mobile for less clutter */}
        <div className="absolute bottom-8 left-8 right-8 md:left-12 md:right-12 hidden md:flex justify-between items-end">
           <div className="flex gap-16">
              <div className="flex flex-col">
                 <span className="text-[8px] text-white/30 uppercase tracking-[0.3em] mb-1 font-bold">Captain</span>
                 <span className="text-sm font-space text-white/80">SUHAS JAWALE</span>
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
