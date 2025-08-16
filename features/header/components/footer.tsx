"use client"

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { SVGProps } from "react";
import { Facebook, InstagramIcon } from "lucide-react";
import { usePathname } from "next/navigation";
const XformerlyTwitter = (props: SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 1200 1227" {...props}><path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" /></svg>;


function Footer() {

    const t = useTranslations('home');
    const pathname = usePathname()
    const locale = useLocale()

    if(pathname.includes(`/${locale}/stores`) || pathname.includes(`/${locale}/dashboard`) || pathname.includes(`/${locale}/sale`) || pathname.includes(`/${locale}/events`) || pathname.includes(`/${locale}/account`)) {
        return null
    }

    return (
        <footer className="relative z-50">
            <div className="container px-4 pb-4 lg:pb-8 mx-auto sm:px-6 lg:px-8 lg:pt-0">

                <div className="flex flex-col items-center gap-4 pt-4 lg:pt-8 border-t border-gray-100 sm:flex sm:items-center sm:justify-between dark:border-gray-800 md:flex-row md:items-start">
                    <nav className="flex gap-2 lg:gap-6 flex-col text-center md:flex-row md:items-start text-xs md:text-sm">
                        <Link href="/terms-and-conditions" className="text-muted-foreground hover:text-primary">{t('footer.links.1')}</Link>
                        <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">{t('footer.links.2')}</Link>
                        <Link href="/cookies" className="text-muted-foreground hover:text-primary">{t('footer.links.3')}</Link>
                    </nav>

                    <nav className="flex items-center gap-6">
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                            <span className="sr-only">Facebook</span>
                            <Facebook className="size-4 md:size-5" />
                        </a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                            <span className="sr-only">Instagram</span>
                            <InstagramIcon className="size-4 md:size-5" />
                        </a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                            <span className="sr-only">X (Twitter)</span>
                            <XformerlyTwitter className="size-4 md:size-5 fill-muted-foreground hover:fill-primary" />
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    )
}
export default Footer