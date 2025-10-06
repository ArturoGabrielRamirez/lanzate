'use client';

import { MutableRefObject, useEffect } from 'react';
import { gsap } from 'gsap';

interface GsapFadeInOptions {
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  opacity?: number;
  ease?: string;
}

export const useGsapFadeIn = (
  ref: MutableRefObject<HTMLElement | null>,
  {
    delay = 0,
    duration = 0.5,
    y = 0,
    x = 0,
    opacity = 0,
    ease = 'power3.out',
  }: GsapFadeInOptions = {}
) => {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity,
        y,
        x,
        duration,
        delay,
        ease,
      });
    }, ref);

    return () => ctx.revert();
  }, [ref, delay, duration, y, x, opacity, ease]);
};


