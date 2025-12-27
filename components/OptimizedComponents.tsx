import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// 🎯 COMPONENTE: AudioWave Optimizado
interface AudioWaveProps {
  color?: string;
  count?: number;
  height?: string;
}

export const AudioWave = memo<AudioWaveProps>(({ 
  color = "bg-primary", 
  count = 8, 
  height = "h-8" 
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className={`flex items-end gap-1 ${height}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full ${color}`}
          animate={prefersReducedMotion ? {} : { 
            height: ["20%", "100%", "40%", "80%", "20%"] 
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.08,
            repeatType: "mirror"
          }}
          style={{ willChange: 'height' }}
        />
      ))}
    </div>
  );
});
AudioWave.displayName = 'AudioWave';

// 🎯 COMPONENTE: Reveal Optimizado con Intersection Observer
interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const Reveal = memo<RevealProps>(({ children, delay = 0, className = '' }) => {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px", amount: 0.3 }}
      transition={{ 
        duration: 0.5, 
        delay, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
    >
      {children}
    </motion.div>
  );
});
Reveal.displayName = 'Reveal';

// 🎯 COMPONENTE: Image con lazy loading mejorado
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage = memo<OptimizedImageProps>(({ 
  src, 
  alt, 
  className = '', 
  priority = false 
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={{ contentVisibility: 'auto' }}
    />
  );
});
OptimizedImage.displayName = 'OptimizedImage';

// 🎯 UTILITY: Debounce para optimizar eventos
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 🎯 UTILITY: Throttle para scroll handlers
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = React.useRef(Date.now());

  return React.useCallback(
    ((...args) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    }) as T,
    [callback, delay]
  );
}