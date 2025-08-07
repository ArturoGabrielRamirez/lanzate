
import { extractSubdomainFromHost } from '@/features/auth/utils';
import { createServerSideClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {

    const headersList = await headers()
    const host = headersList.get('host') || ''
    const subdomain = extractSubdomainFromHost(host)

    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: true, message: 'Email is required' },
                { status: 400 }
            );
        }

        const supabase = createServerSideClient();
        const baseUrl = `${subdomain ? `https://${subdomain}.lanzate.app` : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${baseUrl}/api/auth/check-email?email=${email}`,
        });

        if (error) {
            return NextResponse.json(
                { error: true, message: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            error: false,
            message: 'Recovery email resent successfully',
        });

    } catch (error) {
        return NextResponse.json(
            { error: true, message: 'Internal server error' },
            { status: 500 }
        );
    }
}