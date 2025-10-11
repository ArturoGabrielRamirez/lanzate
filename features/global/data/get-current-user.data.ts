'use server';

import { prisma } from '@/lib/prisma';
import { createServerSideClient } from '@/lib/supabase/server';


export async function getCurrentUserData() {

  const supabase = await createServerSideClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user?.email) {
    throw new Error('User not found');
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      email: user.email
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      avatar: true,
      Account: {
        select: {
          type: true
        }
      },
    },
  });

  if (!dbUser) {
    throw new Error('User not found');
  }

  const payload = {
    id: dbUser.id,
    email: dbUser.email,
    fullName: [dbUser.first_name, dbUser.last_name].join(' ') || dbUser.email || null,
    avatarUrl: dbUser.avatar ?? null,
    accountType: dbUser.Account?.[0]?.type ?? null,
  };

  return {
    message: 'User fetched successfully',
    payload
  };

}

