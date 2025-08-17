"use client"

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import FooterSection from "@/src/components/footer";


function Footer() {

    const pathname = usePathname()
    const locale = useLocale()

    const isLandingPage = pathname === `/${locale}`

    if (!isLandingPage) {
        return null
    }

    return <FooterSection />
}
export default Footer