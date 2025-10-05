'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const HeaderActions = () => {
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!actionsRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(actionsRef.current, {
        opacity: 0,
        x: 20,
        duration: 0.5,
        delay: 0.8, // Delay increased to wait for header and nav animations
        ease: 'power3.out',
      });
    }, actionsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={actionsRef} className="hidden md:flex items-center gap-3">
      <Button asChild>
        <Link href="/login">Acceder</Link>
      </Button>
    </div>
  );
};
