import Link from 'next/link'

export default function ErrorPage() {
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-gray-800'>
            <h1 className='text-4xl font-bold text-red-600'>Oops...nothing to see here.</h1>
            <p className='mt-4 text-lg text-gray-700'>Something went wrong.</p>
            <Link href='/' className='mt-6 text-blue-500 hover:underline'>
                Go back to Home
            </Link>
        </div>
    )
}