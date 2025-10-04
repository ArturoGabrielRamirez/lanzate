"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { ArrowLeft, Calendar, Home, Store, User } from "lucide-react"
import { useLocale } from "next-intl"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

type Props = {
    children?: React.ReactNode
    showBackButton?: boolean
}

const FloatingDock = ({ showBackButton = false }: Props) => {

    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()

    const handleBack = () => {
        router.back()
    }

    return (
        <div className="fixed w-full bottom-0 px-8 z-50 flex justify-center items-center bg-background/85 backdrop-blur-[4px] rounded-lg py-4 shadow-2xl shadow-black drop-shadow-2xl md:hidden">
            {showBackButton && (
                <Button variant="ghost" size="icon" className="" onClick={handleBack}>
                    <ArrowLeft className="size-6 stroke-2" />
                </Button>
            )}
            {showBackButton && <div className="grow w-px h-10 bg-primary mx-4" />}
            <div className="flex items-center gap-4 relative z-10">

                <Link href="/dashboard">
                    <IconButton
                        size="lg"
                        icon={Home}
                        className={cn(pathname.includes(`/${locale}/dashboard`) && "scale-125", "transition-all duration-300")}
                        active={pathname.includes(`/${locale}/dashboard`)}
                    />
                </Link>
                <Link href="/stores">
                    <IconButton
                        size="lg"
                        icon={Store}
                        className={cn(pathname.includes(`/${locale}/stores`) && "scale-125", "transition-all duration-300")}
                        active={pathname.includes(`/${locale}/stores`)}
                    />
                </Link>
                <Link href="/sale" className={cn("rounded-full bg-card/20 aspect-square size-14 flex items-center justify-center border-primary border", pathname.includes(`/${locale}/sale`) && "bg-blue-90/20 animate-pulse")}>
                    <IconButton
                        icon={() => (
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-2" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M21 15h-2.5a1.503 1.503 0 0 0-1.5 1.5a1.503 1.503 0 0 0 1.5 1.5h1a1.503 1.503 0 0 1 1.5 1.5a1.503 1.503 0 0 1-1.5 1.5H17m2 0v1m0-8v1m-6 6H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2m12 3.12V9a2 2 0 0 0-2-2h-2"></path><path d="M16 10V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6m8 0H8m8 0h1m-9 0H7m1 4v.01M8 17v.01m4-3.02V14m0 3v.01"></path></g></svg>
                        )}
                        className={cn(pathname.includes(`/${locale}/sale`) && "", "transition-all duration-300 size-12 scale-150")}
                        active={pathname.includes(`/${locale}/sale`)}
                    />

                </Link>
                <Link href="/events">
                    <IconButton
                        size="lg"
                        icon={Calendar}
                        className={cn(pathname.includes(`/${locale}/events`) && "scale-125", "transition-all duration-300")}
                        active={pathname.includes(`/${locale}/events`)}
                    />
                </Link>
                <Link href="/account">
                    <IconButton
                        size="lg"
                        icon={User}
                        className={cn(pathname.includes(`/${locale}/account`) && "scale-125", "transition-all duration-300")}
                        active={pathname.includes(`/${locale}/account`)}
                    />
                </Link>
            </div>
        </div>
    )
}
export default FloatingDock