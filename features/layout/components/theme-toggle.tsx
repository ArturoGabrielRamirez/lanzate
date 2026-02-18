'use client';

import { AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import * as motion from 'motion/react-client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from "@/features/global/components/button/button";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" aria-label="Toggle theme">
        <Sun />
      </Button>
    );
  }

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      tooltip={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            <Sun />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            transition={{ duration: 0.2 }}
          >
            <Moon />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}

export { ThemeToggle };