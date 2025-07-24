import { OctagonX } from 'lucide-react'
import Link from 'next/link'

export default function ErrorPage() {

    return (
        <section className='grow flex flex-col items-center justify-center gap-4'>
            <OctagonX className='text-destructive' size={50} />
            <div className='flex flex-col items-center justify-center gap-2'>
                <p className='text-4xl font-bold'>Oops...nothing to see here.</p>
                <p className='text-lg'>Something went wrong.</p>
            </div>
            <Link href='/' className='mt-6 text-blue-500 hover:underline'>
                Go back to Home
            </Link>
        </section>
    )
    
}