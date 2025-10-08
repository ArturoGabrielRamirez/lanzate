'use server';

import { actionWrapper } from '@/features/global/utils';
import { prisma } from '@/lib/prisma';
import { createServerSideClient } from '@/lib/supabase/server';

export interface CurrentUserInfo {
  id: number;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  accountType: string | null;
}

export async function getCurrentUserData() {
  return actionWrapper<CurrentUserInfo | null>(async () => {
    const supabase = createServerSideClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user?.email) {
      return { message: 'No authenticated user', payload: null, hasError: false };
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        avatar: true,
        Account: { select: { type: true } },
      },
    });

    if (!dbUser) {
      return { message: 'User not found', payload: null, hasError: false };
    }

    const payload: CurrentUserInfo = {
      id: dbUser.id,
      email: dbUser.email,
      fullName: [dbUser.first_name, dbUser.last_name].filter(Boolean).join(' ') || null,
      avatarUrl: dbUser.avatar ?? null,
      accountType: dbUser.Account?.[0]?.type ?? null,
    };

    return { message: 'User fetched', payload, hasError: false };
  });
}

