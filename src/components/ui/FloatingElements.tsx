import React from 'react';
import { motion } from 'framer-motion';
import { Code, Zap, Sparkles, Cpu, Globe, Rocket } from 'lucide-react';

const floatingIcons = [
  { Icon: Code, delay: 0, x: '10vw', y: '20vh' },
  { Icon: Zap, delay: 0.5, x: '80vw', y: '15vh' },
  { Icon: Sparkles, delay: 1, x: '15vw', y: '70vh' },
  { Icon: Cpu, delay: 1.5, x: '85vw', y: '75vh' },
  { Icon: Globe, delay: 2, x: '50vw', y: '10vh' },
  { Icon: Rocket, delay: 2.5, x: '70vw', y: '60vh' },
];

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute text-indigo-200 dark:text-indigo-800 opacity-20"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0.1, 0.3],
            scale: [0, 1.2, 0.8, 1],
            rotate: [0, 180, 360],
            y: [0, -20, 0, -10, 0]
          }}
          transition={{
            duration: 8,
            delay,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        >
          <Icon size={32} />
        </motion.div>
      ))}
    </div>
  );
}