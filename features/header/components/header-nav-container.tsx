'use client';

import { useMotionValueEvent, useScroll } from "motion/react";
import * as motion from "motion/react-client";
import { useState, type ReactNode } from "react";

import { BrandLogo } from "@/features/header/components/brand-logo";
import { SettingsToolbar } from "@/features/header/components/settings-toolbar";
import { cn } from "@/lib/utils";

function HeaderNavContainer({ children }: { children: ReactNode }) {

    const { scrollY } = useScroll()
    const [shouldBlurBackground, setShouldBlurBackground] = useState(false)

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100) {
            setShouldBlurBackground(true)
        } else {
            setShouldBlurBackground(false)
        }
    })

    const headerLogoConfig = {
        initial: { opacity: 0, y: -100 },
        animate: { opacity: 1, y: 0 },
    }


    return (
        <nav className={cn("hidden xl:flex items-center fixed left-1/2 -translate-x-1/2 gap-4 transition-all", shouldBlurBackground && "backdrop-blur-sm bg-primary/50 border-t border-t-[color-mix(in_oklch,var(--primary),white_30%)] border-b border-b-[color-mix(in_oklch,var(--primary)_50%,black_5%)] rounded-full py-3 mt-4 px-6 shadow-2xl drop-shadow-2xl")}>
            {shouldBlurBackground && (
                <motion.div {...headerLogoConfig}>
                    <BrandLogo hasText={false} />
                </motion.div>
            )}
            {children}
            {shouldBlurBackground && (
                <motion.div {...headerLogoConfig}>
                    <SettingsToolbar />
                </motion.div>
            )}
        </nav>
    )
}

export { HeaderNavContainer };