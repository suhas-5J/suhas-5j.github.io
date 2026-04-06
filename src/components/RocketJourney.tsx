import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Rocket, Sparkles, TrendingUp, BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';

const experiences = [
  {
    title: "Financial Foundations",
    company: "Finance Corp",
    date: "2018 - 2020",
    description: "Built complex financial models for private equity and risk management.",
    icon: TrendingUp,
    color: "#10b981", // Emerald
    planet: "Mercury"
  },
  {
    title: "The Transition",
    company: "EduTech Global",
    date: "2020 - 2022",
    description: "Bridged the gap between finance and education, developing tools for better learning.",
    icon: BookOpen,
    color: "#34d399", // Emerald Light
    planet: "Venus"
  },
  {
    title: "Modern Educator",
    company: "Self-Employed",
    date: "2022 - Present",
    description: "Guiding over 10k+ people on healthy living, social consciousness, and financial literacy.",
    icon: GraduationCap,
    color: "#fb923c", // Orange
    planet: "Earth"
  },
  {
    title: "The Knowledge Orbit",
    company: "Current Venture",
    date: "2024 - Future",
    description: "Building an interactive ecosystem for holistic personal development.",
    icon: Sparkles,
    color: "#f87171", // Reddish-orange
    planet: "Mars"
  }
];

export const RocketJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const rocketY = useTransform(smoothProgress, [0, 1], ["0vh", "70vh"]);
  const rocketRotate = useTransform(smoothProgress, [0, 1], [0, 0]);

  return (
    <section id="journey" ref={containerRef} className="relative py-32 bg-space-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold font-space mb-4 italic">The Journey</h2>
          <p className="text-gray-400 max-w-lg mx-auto italic">Traveling through the milestones of my career...</p>
        </div>

        <div className="relative max-w-4xl mx-auto min-h-[250vh]">
          {/* Central Path */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-finance via-primary-edu to-transparent -translate-x-1/2 opacity-20 pointer-events-none" />
          
          {/* The Rocket - Sticky version */}
          <div className="sticky top-[20vh] h-[80vh] pointer-events-none flex justify-center items-start z-40 hidden md:flex">
             <motion.div 
              style={{ y: rocketY, rotate: rocketRotate }}
              className="relative"
            >
              <Rocket className="w-12 h-12 text-primary-edu rotate-[-45deg] drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]" />
              {/* Flame effect */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 0.2, repeat: Infinity }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4 h-10 bg-gradient-to-t from-orange-500 via-yellow-500 to-transparent rounded-full blur-sm"
              />
            </motion.div>
          </div>

          {/* Experience Milestones */}
          <div className="absolute top-0 w-full space-y-64 pb-32">
            {experiences.map((exp, index) => (
              <div key={index} className={`flex items-center gap-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Content */}
                <motion.div 
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`w-1/2 p-8 rounded-2xl bg-space-card/80 backdrop-blur-sm border border-space-border hover:border-white/20 transition-all group hover:shadow-2xl hover:shadow-${exp.color}/10 italic`}
                >
                  <div className="flex items-center gap-4 mb-4 italic">
                    <div className="p-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors italic">
                      <exp.icon className="w-6 h-6 text-primary-finance italic" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-space italic">{exp.title}</h3>
                      <p className="text-sm text-gray-500 italic">{exp.company} • {exp.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 leading-relaxed italic">{exp.description}</p>
                </motion.div>

                {/* Planet Placeholder */}
                <div className="w-16 h-16 rounded-full bg-space-bg border-2 border-space-border relative z-10 flex items-center justify-center shrink-0">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 animate-pulse italic" />
                   <div className="absolute inset-[-12px] rounded-full border border-dashed border-white/10 animate-[spin_15s_linear_infinite] italic" />
                   <span className="absolute -bottom-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">{exp.planet}</span>
                </div>

                <div className="w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
