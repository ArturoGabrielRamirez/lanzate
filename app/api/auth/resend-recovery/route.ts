import { createServerSideClient } from '@/utils/supabase/server';
import { extractSubdomainFromHost } from '@/features/auth/utils';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: true, message: 'Email is required' },
                { status: 400 }
            );
        }

        const headersList = await headers();
        const host = headersList.get('host') || '';
        const subdomain = extractSubdomainFromHost(host);
        
        const supabase = createServerSideClient();
        const baseUrl = `${subdomain ? `https://${subdomain}.lanzate.app` : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`;

        // Configurar el redirectTo para recovery
        const redirectTo = `${baseUrl}/auth/confirm?next=/update-password`;

        console.log('🔄 Attempting to send recovery email to:', email);
        console.log('📍 Recovery redirect URL:', redirectTo);

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectTo
        });

        if (error) {
            console.error('❌ Supabase recovery error:', error);
            
            if (error.message.includes('rate limit') || error.message.includes('too many')) {
                return NextResponse.json(
                    { error: true, message: 'Too many requests. Please wait 5 minutes before trying again.' },
                    { status: 429 }
                );
            }

            return NextResponse.json(
                { error: true, message: error.message },
                { status: 400 }
            );
        }

        console.log('✅ Recovery email sent successfully');
        
        return NextResponse.json({
            error: false,
            message: 'Recovery email sent successfully',
            data: {
                email: email,
                redirectTo: redirectTo
            }
        });

    } catch (error) {
        console.error('❌ Internal error in resend-recovery:', error);
        return NextResponse.json(
            { error: true, message: 'Internal server error' },
            { status: 500 }
        );
    }
}