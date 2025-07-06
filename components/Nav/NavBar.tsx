
import Link from 'next/link'
import { type User } from '@supabase/supabase-js'
import Divider from '../Visuals/Divider'
import Title from '../../features/layout/components/title'


export default function NavBar({ user }: { user: User | null }) {
    return (
        <nav className='flex items-center justify-between h-full w-full px-2 text-white bg-gray-800'>
            <Link href='/' className='text-2xl font-bold'>
            <Title title='Lanzate' className='text-white' />
            </Link>
            <>
                {!user ? (
                    <div className='flex flex-row justify-between gap-4'>
                        <Link href='/login' className='p-2 hover:underline '>Log In</Link>
                        <Divider />
                        <Link href='/signup' className='p-2 hover:underline '>Sign Up</Link>
                    </div>
                ) : (
                    <div className='flex flex-row justify-between gap-4'>
                        <Link href='/account' className='p-2 hover:underline '>Account</Link>
                        <Divider />
                        <form action='/auth/signout' method='post' className=' p-2'>
                            <button className=' hover:underline hover:cursor-pointer ' type='submit'>
                                Sign out
                            </button>
                        </form>
                    </div>
                )}
            </>
        </nav>
    )
}