import { createServerSideClient } from "@/utils/supabase/server"
import { AccountDropdown, NotificationsIcon, ThemeToggle } from "@/features/header/components"
import Link from "next/link"
import { Rocket } from "lucide-react"

async function Header() {

    const supabase = await createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="flex items-center justify-between w-full bg-accent text-accent-foreground p-4 fixed top-0 left-0 right-0 z-50 md:relative">
            <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                <Rocket className="text-primary" />
                <h1>Lanzate</h1>
            </Link>
            <nav className="flex items-center gap-4">

                {!user && <Link href='/login' className='p-2 hover:underline hover:!text-primary'>Log In</Link>}
                {!user && <Link href='/signup' className='p-2 hover:underline hover:text-primary'>Sign Up</Link>}
                {user && <Link href='/stores' className='p-2 hover:underline hover:!text-primary'>Stores</Link>}
                <ThemeToggle />

                {user && <NotificationsIcon />}
                {user && <AccountDropdown />}
            </nav>
        </header>
    )
}

export default Header