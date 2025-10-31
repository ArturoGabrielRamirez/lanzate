import { BadgeAlert, Crown, Trophy, Home, Clock } from "lucide-react"
import Link from "next/link"

function TopCategoriesNavbar() {
    return (
        <div className="bg-primary/50 w-full">
            <div className="container mx-auto flex flex-wrap items-center">
                <Link href="/products" className="text-sm text-primary-foreground grow text-center py-2 hover:bg-primary transition-colors flex items-center gap-2 justify-center">
                    <Home className="size-4" />
                    <span className="hidden md:block">All</span>
                </Link>
                <div className="w-px h-4 bg-primary-foreground/20 mx" />
                <Link href="/products?new=true" className="text-sm text-primary-foreground grow text-center py-2 hover:bg-primary transition-colors flex items-center gap-2 justify-center">
                    <BadgeAlert className="size-4" />
                    <span className="hidden md:block">New</span>
                </Link>
                <div className="w-px h-4 bg-primary-foreground/20" />
                <Link href="/products?best-sellers=true" className="text-sm text-primary-foreground grow text-center py-2 hover:bg-primary transition-colors flex items-center gap-2 justify-center">
                    <Trophy className="size-4" />
                    <span className="hidden md:block">Best Sellers</span>
                </Link>
                <div className="w-px h-4 bg-primary-foreground/20" />
                <Link href="/products?featured=true" className="text-sm text-primary-foreground grow text-center py-2 hover:bg-primary transition-colors flex items-center gap-2 justify-center">
                    <Crown className="size-4" />
                    <span className="hidden md:block">Featured</span>
                </Link>
                <div className="w-px h-4 bg-primary-foreground/20" />
                <Link href="/products?coming-soon=true" className="text-sm text-primary-foreground grow text-center py-2 hover:bg-primary transition-colors flex items-center gap-2 justify-center">
                    <Clock className="size-4" />
                    <span className="hidden md:block">Coming Soon</span>
                </Link>
            </div>
        </div>
    )
}

export { TopCategoriesNavbar }