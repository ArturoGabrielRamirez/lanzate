'use client';

import { useEffect, useState } from 'react';

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export const useIntersectionObserver = (
  targetIds: string[],
  { root = null, rootMargin = '-20% 0px -60% 0px', threshold = 0 }: UseIntersectionObserverOptions = {}
) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!targetIds || targetIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { root, rootMargin, threshold }
    );

    targetIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [JSON.stringify(targetIds), root, rootMargin, threshold]);

  return activeId;
};


