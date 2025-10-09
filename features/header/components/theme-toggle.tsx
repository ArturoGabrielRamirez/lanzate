'use client';

import { gsap } from 'gsap';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRef, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const iconRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [])

  const handleToggleClick = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    // GSAP rotation animation
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: 360,
        duration: 0.6,
        ease: 'back.inOut(1.5)',
        onComplete: () => {
          // Reset rotation for next click
          gsap.set(iconRef.current, { rotation: 0 });
        },
      });
    }
  };

  if (!isMounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleClick}
      aria-label="Toggle theme"
      className="relative"
    >
      <div ref={iconRef} className="w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </div>
    </Button>
  );
};

