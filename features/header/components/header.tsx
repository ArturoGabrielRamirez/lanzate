import { WithClassName } from "@/features/global/types"
import { BrandLogo, HeaderNav, HeaderActions, MobileDrawer } from "@/features/header/components"
import { cn } from "@/lib/utils"

async function Header({ className }: WithClassName) {

    return (
        <header className={cn("fixed md:absolute top-0 z-[2] w-full max-xl:bg-background max-xl:shadow-2xl", className)}>
            <div className="container mx-auto px-4 flex h-14 xl:h-20 items-center justify-between">
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