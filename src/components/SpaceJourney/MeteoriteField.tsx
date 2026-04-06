import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';

const NUM_METEORITES = 30;

interface MeteoriteProps {
  m: {
    x: number;
    y: number;
    size: number;
    rotateSpeed: number;
    delay: number;
  };
  progress: MotionValue<number>;
}

const Meteorite: React.FC<MeteoriteProps> = ({ m, progress }) => {
  const scale = useTransform(progress, [0 + m.delay, 0.4 + m.delay], [0, 20]);
  const opacity = useTransform(progress, [0 + m.delay, 0.2 + m.delay, 0.4 + m.delay], [0, 0.6, 0]);
  const rotate = useTransform(progress, [0, 1], [0, m.rotateSpeed]);

  return (
    <motion.div
      style={{ 
        scale, 
        opacity, 
        rotate,
        left: `${50 + m.x}%`,
        top: `${50 + m.y}%`,
        x: "-50%",
        y: "-50%"
      }}
      className="absolute"
    >
      <svg width={m.size} height={m.size} viewBox="0 0 100 100" className="fill-gray-700 stroke-gray-500 italic">
        <polygon points="20,10 80,20 90,70 40,90 10,60" />
      </svg>
    </motion.div>
  );
};

export const MeteoriteField: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const meteorites = useRef(
    Array.from({ length: NUM_METEORITES }).map(() => ({
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 100,
      size: Math.random() * 20 + 5,
      rotateSpeed: (Math.random() - 0.5) * 360,
      delay: Math.random() * 0.2
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {meteorites.map((m, i) => (
        <Meteorite key={i} m={m} progress={smoothProgress} />
      ))}
    </div>
  );
};
