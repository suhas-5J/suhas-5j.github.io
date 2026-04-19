import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Zap, Radio, Activity, Compass, Menu, X, Navigation, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { AudioEngine } from './AudioEngine';

export const CockpitHUD: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [showMenu, setShowMenu] = useState(false);
  const [isCareerExpanded, setIsCareerExpanded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSystemOnline, setIsSystemOnline] = useState(false);
  const [isHudVisible, setIsHudVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const { scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 50, damping: 20 });

  const inertiaHeight = useTransform(smoothVelocity, [-0.5, 0, 0, 0.5], ["100%", "0%", "0%", "100%"]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Fast, reliable, no-cors ping to Cloudflare to check internet
        await fetch('https://1.1.1.1/cdn-cgi/trace', { mode: 'no-cors', cache: 'no-store' });
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    // Check immediately on mount
    checkConnection();

    // Check every 10 seconds
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      
      const pastIntro = scrollY > 100;
      const beforeEnd = scrollY < (vh * 15.0); // Last section is at 15.5 vh
      
      if (pastIntro && beforeEnd) {
        setIsHudVisible(true);
        if (!isSystemOnline) setIsSystemOnline(true);
      } else {
        setIsHudVisible(false);
      }
    };
    
    handleScroll();
    
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
    // If not on home page, return to home page first
    if (window.location.pathname !== '/') {
      window.location.href = `/?jump=${index}`;
      return;
    }

    const vh = window.innerHeight;
    const destinations = [
      0,                      // Intro
      vh * 1.75,              // Planet 1
      vh * 4.25,              // Planet 2
      vh * 6.75,              // Planet 3
      vh * 9.25,              // Planet 4
      vh * 11.75,             // Planet 5
      vh * 13.5,              // Upcoming / Projects & Journal
      vh * 14.5,              // Let's Connect
      vh * 15.5               // Developer Credit
    ];

    const destination = destinations[index];

    if (destination !== undefined) {
      window.scrollTo({
        top: destination,
        behavior: 'smooth'
      });
    }
    setShowMenu(false);
  };

  const isHomePage = typeof window !== 'undefined' && window.location.pathname === '/';


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isHudVisible ? 1 : 0 }}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{
        transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`
      }}
    >
      <AudioEngine isMuted={isMuted} volume={volume} scrollVelocity={smoothVelocity} />
      
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
              <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-white/5">
                <div className="flex items-center justify-between">
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
                
                <div className="flex items-center gap-3 w-full">
                   <span className="text-[8px] text-white/40 uppercase tracking-widest w-8">VOL</span>
                   <input 
                     type="range" 
                     min="0" 
                     max="1" 
                     step="0.01" 
                     value={isMuted ? 0 : volume} 
                     onChange={(e) => {
                       const newVol = parseFloat(e.target.value);
                       setVolume(newVol);
                       if (newVol > 0 && isMuted) setIsMuted(false);
                       if (newVol === 0 && !isMuted) setIsMuted(true);
                     }}
                     className="flex-1 h-1 rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary-finance [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                     style={{
                       background: `linear-gradient(to right, #10b981 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%)`
                     }}
                   />
                </div>
              </div>

              {/* Return to Cockpit (if not on home page) */}
              {!isHomePage && (
                <div className="mb-6 pb-6 border-b border-white/5">
                  <a 
                    href="/"
                    className="w-full text-left py-3 px-4 text-xs font-space bg-primary-finance/20 hover:bg-primary-finance/30 text-primary-finance transition-colors rounded-lg flex items-center gap-3 border border-primary-finance/30"
                  >
                    <Navigation className="w-4 h-4" />
                    Return to Cockpit
                  </a>
                </div>
              )}

              {/* Jump Points */}
              <div>
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-primary-finance" /> Destinations
                </h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => jumpToPlanet(0)}
                    className="w-full text-left py-3 px-4 text-xs font-space bg-white/5 hover:bg-primary-finance/10 text-white/80 hover:text-primary-finance transition-colors rounded-lg flex items-center justify-between border border-transparent hover:border-primary-finance/30"
                  >
                    <span className="whitespace-normal leading-tight uppercase tracking-widest">Intro</span>
                  </button>
                  
                  {/* Career Accordion */}
                  <div className="rounded-lg bg-white/5 border border-white/5 overflow-hidden transition-all">
                    <button 
                      onClick={() => setIsCareerExpanded(!isCareerExpanded)}
                      className="w-full text-left py-3 px-4 text-xs font-space hover:bg-white/5 text-white/80 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="whitespace-normal leading-tight uppercase tracking-widest font-bold">Career Phases</span>
                      {isCareerExpanded ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
                    </button>
                    
                    <AnimatePresence>
                      {isCareerExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-black/40"
                        >
                          <div className="flex flex-col py-2">
                            {[
                              { label: "Phase 1 - Marketing Trainee", idx: 1 },
                              { label: "Phase 2 - Finance Intern", idx: 2 },
                              { label: "Phase 3 - Modeling Intern", idx: 3 },
                              { label: "Phase 4 - Accounts Exec", idx: 4 },
                              { label: "Phase 5 - Associate Finance", idx: 5 }
                            ].map((item) => (
                              <button 
                                key={item.idx}
                                onClick={() => jumpToPlanet(item.idx)}
                                className="w-full text-left py-2.5 px-6 text-[10px] md:text-xs font-space hover:bg-primary-finance/10 text-white/60 hover:text-primary-finance transition-colors flex items-center justify-between border-l-2 border-transparent hover:border-primary-finance/50"
                              >
                                <span className="whitespace-normal leading-tight">{item.label}</span>
                                <span className="text-[8px] opacity-40 font-bold ml-2 shrink-0">0{item.idx}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button 
                    onClick={() => jumpToPlanet(6)}
                    className="w-full text-left py-3 px-4 text-xs font-space bg-white/5 hover:bg-primary-finance/10 text-white/80 hover:text-primary-finance transition-colors rounded-lg flex items-center justify-between border border-transparent hover:border-primary-finance/30"
                  >
                    <span className="whitespace-normal leading-tight uppercase tracking-widest">Upcoming...</span>
                  </button>

                  <button 
                    onClick={() => jumpToPlanet(7)}
                    className="w-full text-left py-3 px-4 text-xs font-space bg-white/5 hover:bg-primary-finance/10 text-white/80 hover:text-primary-finance transition-colors rounded-lg flex items-center justify-between border border-transparent hover:border-primary-finance/30"
                  >
                    <span className="whitespace-normal leading-tight uppercase tracking-widest">Let's Connect</span>
                  </button>

                  <button 
                    onClick={() => jumpToPlanet(8)}
                    className="w-full text-left py-3 px-4 text-xs font-space bg-white/5 hover:bg-primary-finance/10 text-white/80 hover:text-primary-finance transition-colors rounded-lg flex items-center justify-between border border-transparent hover:border-primary-finance/30"
                  >
                    <span className="whitespace-normal leading-tight uppercase tracking-widest">Credits</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Side Telemetry - Clean Minimalist (Hidden on smaller screens) */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-12">
           <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Inertia</span>
              <Activity className="w-6 h-6 text-primary-finance/60" />
              <div className="h-32 w-[1px] bg-white/10 relative ml-3">
                 <motion.div 
                   style={{ height: inertiaHeight }}
                   className="absolute top-0 w-full bg-primary-finance"
                 />
              </div>
           </div>
           <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Orientation</span>
              <Compass className="w-6 h-6 text-primary-finance/60" />
           </div>
        </div>

        {/* Bottom Readout - Hidden on mobile for less clutter */}
        <div className="absolute bottom-8 left-8 right-8 md:left-12 md:right-12 hidden md:flex justify-between items-end">
           <div className="flex gap-16">
              <div className="flex flex-col">
                 <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-1 font-bold">Captain</span>
                 <span className="text-base font-space text-white/80">SUHAS JAWALE</span>
              </div>
           </div>
           
           <div className="text-right flex flex-col items-end">
              <span className={`text-[10px] uppercase tracking-[0.3em] mb-2 font-bold ${isOnline ? 'text-white/30' : 'text-red-500 animate-pulse'}`}>
                 {isOnline ? 'Engine Status' : 'SYSTEM ERROR'}
              </span>
              <div className="flex gap-1">
                 {[...Array(12)].map((_, i) => (
                   <motion.div 
                     key={i}
                     animate={{ opacity: isOnline ? [0.2, 0.5, 0.2] : [0.8, 0.2, 0.8] }}
                     transition={{ 
                       duration: isOnline ? 1.5 : 0.5, 
                       repeat: Infinity, 
                       delay: isOnline ? i * 0.1 : 0 
                     }}
                     className={`w-1 h-4 ${isOnline ? 'bg-primary-finance' : 'bg-red-500'}`}
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
