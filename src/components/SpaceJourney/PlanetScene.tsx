import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { GlitchText } from './GlitchText';
import { Briefcase, Calendar, Building, MapPin, Globe, ShieldCheck, TrendingUp } from 'lucide-react';

interface Experience {
  title: string;
  company: string;
  date: string;
  location: string;
  description: string;
  planetColor: string;
  planetTexture: string;
  atmosphereColor: string;
  atmosphereTexture: string;
  baseSpeed: string;
  cloudSpeed: string;
  cloudDirection: string;
  blendMode: string;
  order: number;
}

export const PlanetScene: React.FC<{ experience: Experience }> = ({ experience }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Premium weighted physics
  const springConfig = { stiffness: 40, damping: 20, mass: 1 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Zoom into the planet as we reach it
  const scale = useTransform(smoothProgress, [0, 0.45, 0.5, 0.55, 1], [0.05, 0.8, 1, 1.2, 5]);
  const opacity = useTransform(smoothProgress, [0, 0.35, 0.45, 0.55, 0.65, 1], [0, 0, 1, 1, 0, 0]);
  const contentY = useTransform(smoothProgress, [0, 0.45, 0.5, 0.55, 1], [200, 50, 0, -50, -200]);
  const atmosphereOpacity = useTransform(smoothProgress, [0.4, 0.5, 0.6], [0, 0.5, 0]);

  // Atmospheric entry "Speed-Mist" effect
  const mistOpacity = useTransform(smoothProgress, [0.4, 0.48, 0.52, 0.6], [0, 1, 1, 0]);
  const mistScale = useTransform(smoothProgress, [0.4, 0.5, 0.6], [0.8, 1.2, 1.5]);
  const backdropFilter = useTransform(smoothProgress, [0.4, 0.5, 0.6], ["contrast(1) blur(0px)", "contrast(1.5) blur(20px)", "contrast(1) blur(0px)"]);

  return (
    <div ref={containerRef} className="h-[250vh] relative flex items-center justify-center overflow-hidden">
      {/* The Planet Visual - High Detail */}
      <motion.div 
        style={{ scale, opacity }}
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-10"
      >
        <div 
          className="w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full relative overflow-hidden"
          style={{ 
            boxShadow: `0 0 150px ${experience.atmosphereColor}20`
          }}
        >
           {/* Planet Base Color & 3D Shading (Terminator Line) */}
           <div className="absolute inset-0 rounded-full" 
                style={{ 
                  background: `radial-gradient(circle at 30% 30%, ${experience.planetColor}, #010101 70%, #000 100%)`,
                  boxShadow: `inset -40px -40px 100px rgba(0,0,0,0.9), inset 10px 10px 30px rgba(255,255,255,0.1)`
                }} 
           />

           {/* Rotating Texture overlay */}
           <div className="absolute -inset-[50%] opacity-40 pointer-events-none" 
                style={{ 
                  backgroundImage: `url('${experience.planetTexture}')`,
                  mixBlendMode: experience.blendMode as any, 
                  backgroundSize: '400px 400px',
                  animation: `spin ${experience.baseSpeed} linear infinite`
                }} 
           />
           
           {/* Secondary Cloud / Atmosphere Swirl Layer */}
           <div className="absolute -inset-[50%] opacity-30 pointer-events-none" 
                style={{ 
                  backgroundImage: `url('${experience.atmosphereTexture}')`,
                  mixBlendMode: 'screen', 
                  backgroundSize: '300px 300px',
                  filter: 'invert(1) contrast(1.5)',
                  animation: `spin ${experience.cloudSpeed} linear infinite ${experience.cloudDirection}`
                }} 
           />
           
           {/* Atmospheric glow layer - Premium Gradient */}
           <motion.div 
             style={{ opacity: atmosphereOpacity }}
             className="absolute inset-0 bg-gradient-to-t from-white/[0.05] to-transparent blur-3xl pointer-events-none" 
           />
           
           {/* Surface Light / Rim Light */}
           <div className="absolute inset-0 border-[0.5px] border-white/10 rounded-full pointer-events-none" />
        </div>
      </motion.div>

      {/* Atmospheric Entry "Mist" Effect - Apple Style */}
      <motion.div 
        style={{ opacity: mistOpacity, scale: mistScale, backdropFilter }}
        className="fixed inset-0 pointer-events-none z-25 bg-white/[0.05] mix-blend-overlay"
      />

      {/* Work Experience Content - Premium Layout */}
      <motion.div 
        style={{ y: contentY, opacity }}
        className="relative z-30 max-w-4xl w-full px-8 flex flex-col items-center md:items-start"
      >
        <div className="w-full flex flex-col md:flex-row gap-12 items-end">
           <div className="flex-1 space-y-8">
               <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <span className="text-primary-finance font-bold uppercase tracking-[0.4em] text-[8px] md:text-[10px] font-space italic">
                       Identification: Orbit {experience.order}
                    </span>
                    <div className="h-[1px] flex-1 bg-white/10" />
                 </div>
                 <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold font-space leading-none tracking-tighter italic">
                    <GlitchText text={experience.title} />
                 </h2>
              </div>

              <div className="grid grid-cols-2 gap-8 md:gap-12 py-8 md:py-10 border-y border-white/5 italic">
                 <div className="flex flex-col gap-1 italic">
                    <span className="text-[8px] text-white/30 uppercase tracking-widest italic font-bold">Log Organization</span>
                    <span className="text-base md:text-lg font-space italic text-white/80">{experience.company}</span>
                 </div>
                 <div className="flex flex-col gap-1 italic">
                    <span className="text-[8px] text-white/30 uppercase tracking-widest italic font-bold">Stellar Period</span>
                    <span className="text-base md:text-lg font-space italic text-white/80">{experience.date}</span>
                 </div>
              </div>

              <div className="relative italic">
                 <p className="text-xl md:text-2xl lg:text-3xl text-white/60 leading-[1.4] font-light italic">
                    {experience.description}
                 </p>
              </div>
           </div>

           {/* Side Status Detail - High Tech */}
           <div className="hidden md:flex flex-col gap-8 w-48 border-l border-white/5 pl-8 italic">
              <div className="space-y-2 italic">
                 <Globe className="w-4 h-4 text-primary-finance/60 italic" />
                 <p className="text-[8px] uppercase tracking-widest text-white/30 italic font-bold">Position</p>
                 <p className="text-[10px] font-space text-white/60 italic">{experience.location}</p>
              </div>
              <div className="space-y-2 italic">
                 <ShieldCheck className="w-4 h-4 text-primary-finance/60 italic" />
                 <p className="text-[8px] uppercase tracking-widest text-white/30 italic font-bold">Clearance</p>
                 <p className="text-[10px] font-space text-white/60 italic uppercase tracking-tighter italic">Verified</p>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
