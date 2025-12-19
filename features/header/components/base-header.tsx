import type { BaseHeaderProps } from "@/features/header/types";
import { cn } from "@/lib/utils";

function BaseHeader({
  children,
  className,
  variant = "fixed",
}: BaseHeaderProps) {
  return (
    <header
      className={cn(
        "top-0 z-[2] w-full max-xl:bg-background max-xl:shadow-2xl",
        variant === "fixed" && "fixed md:absolute",
        variant === "absolute" && "absolute",
        variant === "sticky" && "sticky",
        className,
      )}
    >
      <div className="container mx-auto px-4 flex h-14 xl:h-20 items-center justify-between">
        {children}
      </div>
    </header>
  );
}

export { BaseHeader };
