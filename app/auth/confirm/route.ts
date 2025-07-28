import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createServerSideClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'
    
    const baseUrl = process.env.NEXTAUTH_URL || `http://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    const redirectTo = new URL(next, baseUrl)

    if (token_hash && type) {
        const supabase = await createServerSideClient()

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })
        if (!error) {
            return NextResponse.redirect(redirectTo)
        }
    }

    const errorUrl = new URL('/error', baseUrl)
    return NextResponse.redirect(errorUrl)
}