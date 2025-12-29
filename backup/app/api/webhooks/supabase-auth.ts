import { NextRequest, NextResponse } from 'next/server'

import { UpdateData } from '@/features/auth/types'
import { prisma } from "@/utils/prisma"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, record } = body;

        if (type !== 'INSERT' && type !== 'UPDATE') {
            return NextResponse.json({ status: 'ignored' });
        }

        if (!record.new_email && !record.email_change_confirm_status) {
            return NextResponse.json({ status: 'ignored' });
        }

        const supabaseUserId = record.id;
        const currentEmail = record.email;
        const newEmail = record.new_email;

        let localUser = await prisma.user.findUnique({
            where: {
                supabase_user_id: supabaseUserId
            }
        });

        if (!localUser) {
            localUser = await prisma.user.findUnique({
                where: { email: currentEmail }
            });

            if (localUser) {
                localUser = await prisma.user.update({
                    where: { id: localUser.id },
                    data: {
                        supabase_user_id: supabaseUserId,
                        updated_at: new Date()
                    }
                });
            }
        }

        if (!localUser) {
            console.warn('❌ User not found:', { supabaseUserId, currentEmail });
            return NextResponse.json({ status: 'user_not_found' });
        }

        const changeRequest = await prisma.email_change_requests.findFirst({
            where: {
                user_id: localUser.id,
                completed: false,
                expires_at: {
                    gt: new Date()
                }
            }
        });

        if (!changeRequest) {
            return NextResponse.json({ status: 'no_active_request' });
        }

        const now = new Date();
        const updateData: UpdateData = {};
        let shouldUpdate = false;

        if (newEmail && !changeRequest.old_email_confirmed) {
            updateData.old_email_confirmed = true;
            updateData.old_email_confirmed_at = now;
            shouldUpdate = true;
        }

        if (!newEmail && changeRequest.new_email && !changeRequest.completed) {
            updateData.new_email_confirmed = true;
            updateData.new_email_confirmed_at = now;
            updateData.completed = true;
            updateData.completed_at = now;
            shouldUpdate = true;

            await prisma.user.update({
                where: { id: localUser.id },
                data: {
                    email: changeRequest.new_email,
                    updated_at: new Date()
                }
            });
        }

        if (shouldUpdate) {
            const updatedRequest = await prisma.email_change_requests.update({
                where: { id: changeRequest.id },
                data: updateData
            });

            return NextResponse.json({
                status: 'updated',
                requestId: updatedRequest.id,
                changes: updateData
            });
        }

        return NextResponse.json({ status: 'no_changes' });

    } catch (error) {
        console.error('❌ Webhook error:', error);
        return NextResponse.json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}