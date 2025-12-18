'use client';

import { useMotionValueEvent, useScroll } from 'motion/react';
import { useState } from 'react';

export function useScrollThreshold(threshold: number = 100) {
    const { scrollY } = useScroll();
    const [isAboveThreshold, setIsAboveThreshold] = useState(false);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setIsAboveThreshold(latest > threshold);
    });

    return isAboveThreshold;
}
