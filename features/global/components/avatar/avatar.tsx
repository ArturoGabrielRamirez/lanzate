"use client"

import Image from "next/image"
import * as React from "react"

import { avatarVariants } from "@/features/global/components/avatar/avatar-variants"
import { Badge } from "@/features/global/components/badge/badge"
import { AvatarProps } from "@/features/global/types/avatar.types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { cn } from "@/features/shadcn/utils/cn"


const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, alt, fallback, size = "md", shape = "circle", status = "none", statusColor, tooltip, badge, ...props }, ref) => {
        const [hasError, setHasError] = React.useState(false)

        const avatarContent = (
            <div
                ref={ref}
                className={cn(avatarVariants({ size, shape, className }), "z-0")}
                {...props}
            >
                {/* Status Border Wrapper */}
                {status !== "none" && (
                    <div
                        className={cn(
                            "absolute z-10 -inset-1 border-2",
                            shape === "circle" ? "rounded-full" : "rounded-2xl",
                            status === "success" && "border-success",
                            status === "error" && "border-destructive"
                        )}
                        style={status === "custom" && statusColor ? { borderColor: statusColor } : undefined}
                    />
                )}

                {/* Main Avatar Content */}
                <div className={cn(
                    "relative z-20 flex h-full w-full items-center justify-center overflow-hidden bg-muted",
                    shape === "circle" ? "rounded-full" : "rounded-xl"
                )}>
                    {src && !hasError ? (
                        <Image
                            src={src}
                            alt={alt || "Avatar"}
                            fill
                            className="object-cover"
                            onError={() => setHasError(true)}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground font-medium uppercase select-none">
                            {fallback || alt?.charAt(0) || "?"}
                        </div>
                    )}
                </div>

                {/* Optional Badge */}
                {badge && (
                    <div className={cn(
                        "absolute z-30 -bottom-1 -right-1",
                        shape === "circle" && size === "sm" && "-bottom-0.5 -right-0.5"
                    )}>
                        <Badge
                            variant={badge.variant}
                            size={badge.size || "sm"}
                            shape={badge.shape || "circle"}
                            className={cn("border-2 border-background shadow-sm", badge.className)}
                        >
                            {badge.text}
                        </Badge>
                    </div>
                )}
            </div>
        )

        if (tooltip) {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {avatarContent}
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }

        return avatarContent
    }
)

Avatar.displayName = "Avatar"

export { Avatar }
