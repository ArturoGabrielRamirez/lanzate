import Link from "next/link"
import { Rocket } from "lucide-react"
import { createServerSideClient } from "@/utils/supabase/server"
import { AccountDropdown } from "@/features/header/components"
import CartIcon from "@/features/cart/components/cart-icon"

type Props = {
    title: string
}

async function Header({ title }: Props) {

    const supabase = createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="flex items-center justify-between w-full bg-accent text-accent-foreground p-4">
            <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                <Rocket className="text-primary" />
                <h1>{title}</h1>
            </Link>
            <div className="flex items-center gap-2">
                {!user && <Link href='/login' className='p-2 hover:underline hover:!text-primary'>Log In</Link>}
                {!user && <Link href='/signup' className='p-2 hover:underline hover:text-primary'>Sign Up</Link>}
                <CartIcon />
                {user && <AccountDropdown />}
            </div>
        </header>
    )
}

export default Header