import { createServerSideClient } from '@/utils/supabase/server';
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

        const supabase = createServerSideClient();

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        });

        if (error) {
            return NextResponse.json(
                { error: true, message: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json({
            error: false,
            message: 'Confirmation email resent successfully',
        });

    } catch (error) {
        return NextResponse.json(
            { error: true, message: 'Internal server error' },
            { status: 500 }
        );
    }
}