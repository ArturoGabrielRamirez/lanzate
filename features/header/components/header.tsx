import { BrandLogo, HeaderNav, HeaderActions, MobileDrawer } from "@/features/header/components"
import { HeaderProps } from "@/features/header/types"
import { cn } from "@/lib/utils"


async function Header({ className }: HeaderProps) {

    return (
        <header className={cn("fixed md:absolute top-0 z-30 w-full text-primary-foreground", className)}>
            <div className="container mx-auto px-4 flex h-14 md:h-20 items-center justify-between">
                <BrandLogo />
                <HeaderNav />
                <div className='flex items-center'>
                    <HeaderActions />
                    <MobileDrawer />
                </div>
            </div>
        </header>
    )
}

export { Header }