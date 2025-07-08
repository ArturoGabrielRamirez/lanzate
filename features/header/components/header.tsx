import { NotificationsIcon } from "@/features/header/components"
import { createClient } from "@/utils/supabase/server-props"
import Link from "next/link"
import ThemeToggle from "./theme-toggle"
import AccountDropdown from "./account-dropdown"
import { Rocket } from "lucide-react"

type Props = {}

async function Header({ }: Props) {

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="flex items-center justify-between w-full bg-accent text-accent-foreground p-4">
            <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                <Rocket className="text-primary" />
                <h1>Lanzate</h1>
            </Link>
            <nav className="flex items-center gap-4">

                {!user && <Link href='/login' className='p-2 hover:underline hover:!text-primary'>Log In</Link>}
                {!user && <Link href='/signup' className='p-2 hover:underline hover:text-primary'>Sign Up</Link>}
                
                <ThemeToggle />

                {user && <NotificationsIcon />}
                {user && <AccountDropdown />}
            </nav>
        </header>
    )
}

export default Header