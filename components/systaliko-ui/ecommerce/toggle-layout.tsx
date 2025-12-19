"use client";

import { List, LayoutGrid } from "lucide-react";
import { HTMLMotionProps, LayoutGroup, motion } from "motion/react";
import React from "react";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/features/shadcn/components/ui/toggle-group";
import { cn } from "@/features/shadcn/lib/utils";
import { Button } from "@/features/shadcn/components/ui/button";

const layout_config = {
  list: {
    mode: "list",
    className: "flex flex-col rounded-lg overflow-hidden",
    label: "List view",
  },
  auto: {
    mode: "auto",
    className:
      "grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4",
    label: "Grid view",
  },
};
const animation_variants = {
  container: {
    list: { transition: { staggerChildren: 0.02 } },
    auto: { transition: { staggerChildren: 0.1 } },
  },
  card: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
};
interface ToggleLayoutContextValue {
  modeIndex: number;
  setModeIndex: React.Dispatch<React.SetStateAction<number>>;
}
const ToggleLayoutContext = React.createContext<
  ToggleLayoutContextValue | undefined
>(undefined);
export function useToggleLayoutContext() {
  const context = React.useContext(ToggleLayoutContext);
  if (context === undefined) {
    throw new Error(
      "useToggleLayoutContext must be used within a ToggleLayoutProvider",
    );
  }
  return context;
}
export function ToggleLayout({
  children,
  ...props
}: React.ComponentProps<typeof LayoutGroup>) {
  const [modeIndex, setModeIndex] = React.useState<number>(0);

  return (
    <ToggleLayoutContext.Provider value={{ modeIndex, setModeIndex }}>
      <LayoutGroup {...props}>{children}</LayoutGroup>
    </ToggleLayoutContext.Provider>
  );
}
export function ToggleLayoutContainer({
  className,
  ...props
}: HTMLMotionProps<"div">) {
  const { modeIndex } = useToggleLayoutContext();
  const layout_config_values = [...Object.values(layout_config)];

  const currentConfig = layout_config_values[modeIndex];

  return (
    <motion.div
      layout
      variants={animation_variants.container}
      initial="hidden"
      animate={currentConfig.mode}
      className={cn(currentConfig.className, className)}
      {...props}
    />
  );
}

export function SelectLayoutGroup({ className }: { className?: string }) {
  const { modeIndex, setModeIndex } = useToggleLayoutContext();
  const layout_config_values = Object.values(layout_config);

  // Convert modeIndex to mode string for ToggleGroup
  const currentMode = layout_config_values[modeIndex]?.mode || "list";

  // Handle value change from ToggleGroup
  const handleValueChange = (value: string) => {
    if (value) {
      const newIndex = layout_config_values.findIndex(
        (config) => config.mode === value,
      );
      if (newIndex !== -1) {
        setModeIndex(newIndex);
      }
    }
  };

  return (
    <ToggleGroup
      type="single"
      value={currentMode}
      onValueChange={handleValueChange}
      className={cn("w-fit", className)}
    >
      <ToggleGroupItem value="list" aria-label="List view" asChild>
        <Button size="icon" variant="outline">
          <List className="h-4 w-4" />
        </Button>
      </ToggleGroupItem>
      <ToggleGroupItem value="auto" aria-label="Grid view" asChild>
        <Button size="icon" variant="outline">
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function ToggleLayoutCell({ ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      layout
      variants={animation_variants.card}
      initial="hidden"
      animate="visible"
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      exit="hidden"
      {...props}
    />
  );
}
