'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { createServerSideClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ServerResponse } from '@/features/global/types';

export const logoutAction = async (): Promise<ServerResponse<null>> => {
  return actionWrapper(async () => {
    const supabase = createServerSideClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        hasError: true,
        message: error.message || 'Failed to logout',
        payload: null,
      };
    }

    revalidatePath('/');

    return {
      hasError: false,
      message: 'Logged out successfully',
      payload: null,
    };
  });
};

