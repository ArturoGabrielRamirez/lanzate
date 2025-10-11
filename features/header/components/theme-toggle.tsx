'use client';

import { gsap } from 'gsap';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRef, useEffect, useState } from 'react';

import { IconButton } from '@/features/global/components';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const iconRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [])

  const handleToggleClick = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: 360,
        duration: 0.6,
        ease: 'back.inOut(1.5)',
        onComplete: () => {
          gsap.set(iconRef.current, { rotation: 0 });
        },
      });
    }
  };

  if (!isMounted) return null;

  return (
    <IconButton
      onClick={handleToggleClick}
      aria-label="Toggle theme"
      className="relative"
      icon={(
        <div ref={iconRef} className="size-6 flex items-center justify-center">
          {theme === 'dark' ? (
            <Sun className="size-6" />
          ) : (
            <Moon className="size-6" />
          )}
        </div>
      )}
    />
  );
};

export { ThemeToggle };
