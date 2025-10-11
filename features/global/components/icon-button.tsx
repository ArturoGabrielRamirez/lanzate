"use client";

import { Button } from "@/components/ui/button";
import type { IconButtonProps } from "@/features/global/types";
import { cn } from "@/lib/utils";

function IconButton({ icon, onClick, className, ...props }: IconButtonProps) {

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
    }

    return (
        <Button onClick={handleClick} variant="ghost" size="icon-lg" className={cn(className)} {...props}>
            {icon}
        </Button>
    )
}

export { IconButton };