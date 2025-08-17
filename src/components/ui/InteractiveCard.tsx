import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function InteractiveCard({ 
  children, 
  className = '', 
  glowColor = '#6366f1' 
}: InteractiveCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative group ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Glow effect */}
      <div 
        className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt rounded-xl blur"
        style={{
          background: `linear-gradient(45deg, ${glowColor}, #8b5cf6, ${glowColor})`,
        }}
      />
      
      {/* Card content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl">
        {children}
      </div>
    </motion.div>
  );
}