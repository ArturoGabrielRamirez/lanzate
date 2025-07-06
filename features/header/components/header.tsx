import { NotificationsIcon } from "@/features/header/components"
import { createClient } from "@/utils/supabase/server-props"
import Link from "next/link"

type Props = {}

async function Header({ }: Props) {

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="flex items-center justify-between w-full bg-secondary p-4">
            <Link href="/" className="text-2xl font-bold">
                <h1>Lanzate</h1>
            </Link>
            <nav className="flex items-center gap-4">

                {!user && <Link href='/login' className='p-2 hover:underline '>Log In</Link>}
                {!user && <Link href='/signup' className='p-2 hover:underline '>Sign Up</Link>}

                {user && <NotificationsIcon />}
                {user && <Link href='/account' className='p-2 hover:underline '>Account</Link>}
                {user && (
                    <form action='/auth/signout' method='post' className=' p-2'>
                        <button className=' hover:underline hover:cursor-pointer ' type='submit'>
                            Sign out
                        </button>
                    </form>
                )}
            </nav>
        </header>
    )
}

export default Header