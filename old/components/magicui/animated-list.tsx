"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useMemo,
  useState,
} from "react";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring" as const, stiffness: 350, damping: 40 },
  };

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  delay?: number;
  externalIndex?: number; // New prop to control from outside
  maxVisible?: number; // Maximum items visible before clearing
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, externalIndex, maxVisible = 5, ...props }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children],
    );

    // Use external index if provided, otherwise use internal logic
    const currentIndex = externalIndex !== undefined ? externalIndex : index;

    useEffect(() => {
      // Only use internal timing if no external control
      if (externalIndex === undefined && index < childrenArray.length - 1) {
        const timeout = setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
        }, delay);

        return () => clearTimeout(timeout);
      }
    }, [index, delay, childrenArray.length, externalIndex]);

    const itemsToShow = useMemo(() => {
      if (currentIndex < 0) return []; // No items when index is negative
      
      // Reset when we reach maxVisible items
      const effectiveIndex = currentIndex % (maxVisible + 1);
      if (effectiveIndex === maxVisible) return []; // Clear at max
      
      const result = childrenArray.slice(0, effectiveIndex + 1).reverse();
      return result;
    }, [currentIndex, childrenArray, maxVisible]);

    return (
      <div
        className={cn(`flex flex-col items-center gap-4`, className)}
        {...props}
      >
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

AnimatedList.displayName = "AnimatedList";
