'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function AuthRedirect() {
    const searchParams = useSearchParams()
    const subdomain = searchParams.get('subdomain')
    const path = searchParams.get('path')

    useEffect(() => {
        if (subdomain && path) {
            const targetURL = `https://${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lanzate.app'}${path}`

            setTimeout(() => {
                window.location.href = targetURL
            }, 100)
        }
    }, [subdomain, path])

    return (
        <div className="flex items-center justify-center min-h-screen relative">
            <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
                <p>Redirecting...</p>
            </div>
        </div>
    )
}