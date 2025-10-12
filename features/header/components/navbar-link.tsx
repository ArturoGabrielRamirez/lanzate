"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLocale } from "next-intl"

type Props = {
    href: string
    children: React.ReactNode
}
function NavbarLink({ href, children }: Props) {

    const pathname = usePathname()
    const locale = useLocale()
    const isActive = pathname === href || pathname === `/${locale}${href}`

    return (
        <Link href={href} className={cn('p-2 hover:underline hover:!text-primary', isActive && 'text-primary')}>{children}</Link>
    )
}
export { NavbarLink }