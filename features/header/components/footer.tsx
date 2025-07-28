import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import * as motion from "motion/react-client"
import SectionTitle from "@/features/landing/components/section-title";
import Link from "next/link";
import EyeCatchingButton from "@/features/landing/components/eye-catching-button";
import type { SVGProps } from "react";
import { Facebook, InstagramIcon } from "lucide-react";
const XformerlyTwitter = (props: SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 1200 1227" {...props}><path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" /></svg>;


function Footer() {

    const t = useTranslations('home');

    return (
        <footer className="bg-background relative">
            <div className="mx-auto container px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-0">

                <div className="border-t border-gray-100 pt-8 sm:flex sm:items-center sm:justify-between dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center md:items-start">
                    <nav className="flex gap-6">
                        <Link href="/terms-and-conditions" className="text-muted-foreground text-sm hover:text-primary">Terms & Conditions</Link>
                        <Link href="/privacy-policy" className="text-muted-foreground text-sm hover:text-primary">Privacy Policy</Link>
                        <Link href="/cookies" className="text-muted-foreground text-sm hover:text-primary">Cookies</Link>
                    </nav>

                    <nav className="flex gap-6 items-center">
                        <a href="#" className="text-muted-foreground text-sm hover:text-primary">
                            <span className="sr-only">Facebook</span>
                            <Facebook />
                        </a>
                        <a href="#" className="text-muted-foreground text-sm hover:text-primary">
                            <span className="sr-only">Instagram</span>
                            <InstagramIcon />
                        </a>
                        <a href="#" className="text-muted-foreground text-sm hover:text-primary">
                            <span className="sr-only">X (Twitter)</span>
                            <XformerlyTwitter className="size-5 fill-muted-foreground hover:fill-primary" />
                        </a>
                    </nav>
                </div>
            </div>
            {/* <DotPattern
                width={30}
                height={30}
                className={cn(
                    "[mask-image:linear-gradient(to_top_right,white,transparent_70%,transparent)] ",
                )}
            /> */}
        </footer>
    )
}
export default Footer