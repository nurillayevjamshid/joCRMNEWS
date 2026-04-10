import { useState, useEffect, useRef } from 'react';

/**
 * Sonlarni animatsiya bilan hisoblash uchun hook
 * Masalan: 0 dan 124563 gacha silliq o'sish
 */
export function useCounterAnimation(
  end: number,
  duration: number = 1500,
  start: number = 0,
  enabled: boolean = true
) {
  const [value, setValue] = useState(enabled ? start : end);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setValue(end);
      return;
    }

    startTimeRef.current = 0;
    setValue(start);

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo funksiyasi — sekinlashuvchi animatsiya
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(start + (end - start) * eased);
      
      setValue(current);
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, start, enabled]);

  return value;
}

/**
 * Element ko'rinishida animatsiya uchun hook (intersection observer)
 */
export function useInView(threshold: number = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}
