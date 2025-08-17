import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, duration = 2, className = '' }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = display.onChange((latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [display]);

  return (
    <motion.span 
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
}