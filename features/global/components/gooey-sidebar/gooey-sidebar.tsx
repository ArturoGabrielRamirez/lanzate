"use client"

import { AnimatePresence, motion } from "framer-motion"
import * as React from "react"


import {
    gooeySidebarContainerVariants,
    gooeySidebarContentVariants,
    gooeySidebarTabListVariants,
    gooeySidebarTabVariants,
} from "@/features/global/components/gooey-sidebar/gooey-sidebar-variants"
import type { GooeySidebarProps } from "@/features/global/types/gooey-sidebar.types"
import { GooeyFilter } from "@/features/shadcn/components/ui/gooey-filter"
import { cn } from "@/features/shadcn/utils/cn"


const GooeySidebar = React.forwardRef<HTMLDivElement, GooeySidebarProps>(
    (
        {
            className,
            tabs,
            size = "loose",
            orientation = "vertical",
            defaultActiveTab = 0,
            activeTab: controlledActiveTab,
            onTabChange,
            gooeyStrength = 10,
            filterId: filterIdProp,
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId()
        const filterId = filterIdProp ?? `gooey-sidebar-${generatedId}`

        const [internalActiveTab, setInternalActiveTab] = React.useState(defaultActiveTab)
        const isControlled = controlledActiveTab !== undefined
        const activeTab = isControlled ? controlledActiveTab : internalActiveTab

        const handleTabChange = (index: number) => {
            if (!isControlled) {
                setInternalActiveTab(index)
            }
            onTabChange?.(index)
        }

        const contentAnimationAxis = orientation === "vertical" ? "x" : "y"
        const isVertical = orientation === "vertical"

        return (
            <div
                ref={ref}
                className={cn(gooeySidebarContainerVariants({ orientation }), "relative", className)}
                {...props}
            >
                <GooeyFilter id={filterId} strength={gooeyStrength} />

                {/* Gooey-filtered layer: tab indicators + content background merge together */}
                <div
                    className={cn(
                        "absolute inset-0 drop-shadow-2xl",
                        isVertical ? "flex flex-row" : "flex flex-col"
                    )}
                    style={{ filter: `url(#${filterId})` }}
                >
                    {/* Tab indicator slots */}
                    <div className={cn(gooeySidebarTabListVariants({ orientation }))}>
                        {tabs.map((_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    gooeySidebarTabVariants({ size, orientation }),
                                )}
                            >
                                {activeTab === index && (
                                    <motion.div
                                        layoutId={`gooey-active-tab-${filterId}`}
                                        className="absolute inset-0 bg-card"
                                        transition={{
                                            type: "spring",
                                            bounce: 0.0,
                                            duration: 0.4,
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Content background (same color as active tab, so they merge via gooey) */}
                    <div className={cn(gooeySidebarContentVariants({ orientation }), "bg-card")} />
                </div>

                {/* Interactive overlay (no filter, keeps text crisp) */}
                <div
                    className={cn(
                        "relative",
                        isVertical ? "flex flex-row" : "flex flex-col",
                        isVertical ? "w-full h-full" : "w-full h-full"
                    )}
                >
                    {/* Tab buttons */}
                    <div className={cn(gooeySidebarTabListVariants({ orientation }))}>
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleTabChange(index)}
                                className={cn(
                                    gooeySidebarTabVariants({ size, orientation }),
                                    activeTab === index
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground/80"
                                )}
                            >
                                <span className="shrink-0">{tab.icon}</span>
                                {size === "loose" && tab.label && (
                                    <span className="truncate">{tab.label}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content panel */}
                    <div className={cn(gooeySidebarContentVariants({ orientation }))}>
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={activeTab}
                                initial={{
                                    opacity: 0,
                                    [contentAnimationAxis]: 20,
                                    filter: "blur(8px)",
                                }}
                                animate={{
                                    opacity: 1,
                                    [contentAnimationAxis]: 0,
                                    filter: "blur(0px)",
                                }}
                                exit={{
                                    opacity: 0,
                                    [contentAnimationAxis]: -20,
                                    filter: "blur(8px)",
                                }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeOut",
                                }}
                                className="h-full"
                            >
                                {tabs[activeTab]?.content}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        )
    }
)
GooeySidebar.displayName = "GooeySidebar"

export { GooeySidebar, gooeySidebarContainerVariants }
