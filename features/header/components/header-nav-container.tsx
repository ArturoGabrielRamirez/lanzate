'use client';

import { cn } from "@/lib/utils";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState, type ReactNode } from "react";
import { HeaderLogo } from "@/features/header/components/header-logo";
import * as motion from "motion/react-client";
import { SettingsToolbar } from "@/features/header/components/settings-toolbar";

function HeaderNavContainer({ children }: { children: ReactNode }) {
    
    const { scrollY } = useScroll()
    const [shouldBlurBackground, setShouldBlurBackground] = useState(false)

    useMotionValueEvent(scrollY, "change", (latest) => {
        const windowHeight = window.innerHeight
        if (latest > windowHeight) {
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
        <nav className={cn("hidden xl:flex items-center fixed left-1/2 -translate-x-1/2 gap-8 transition-all", shouldBlurBackground && "backdrop-blur-sm bg-primary/50 rounded-full py-3 mt-4 px-6")}>
            {shouldBlurBackground && (
                <motion.div {...headerLogoConfig}>
                    <HeaderLogo hasText={false} />
                </motion.div>
            )}
            {children}
            {shouldBlurBackground && (
                <motion.div {...headerLogoConfig}>
                    <SettingsToolbar/>
                </motion.div>
            )}
        </nav>
    )
}

export { HeaderNavContainer };