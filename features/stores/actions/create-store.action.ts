'use server';

import { revalidatePath } from 'next/cache';
import { getLocale } from 'next-intl/server';

import { getUserBySupabaseId } from '@/features/auth/data';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { STORE_ERROR_MESSAGES, STORE_SUCCESS_MESSAGES } from '@/features/stores/constants';
import { createStoreSchema } from '@/features/stores/schemas/schemaFactory';
import { createStoreService } from '@/features/stores/services';
import { redirect } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';

import type { Store } from '@prisma/client';

/**
 * Create Store Server Action
 *
 * Handles store creation with account-type-based limits.
 * Creates a store for the authenticated user, enforcing limits based on their subscription.
 *
 * Flow:
 * 1. Get current authenticated user from Supabase
 * 2. Fetch database user record by Supabase ID
 * 3. Extract and validate form data with createStoreSchema
 * 4. Call createStoreService (enforces account limits: FREE=2, PRO=5, ENTERPRISE=unlimited)
 * 5. Revalidate dashboard and stores paths
 * 6. Redirect to the new store page
 *
 * @param formData - Form data containing store creation fields (name, description, subdomain)
 * @returns ServerResponse with created store or error
 *
 * @example
 * ```tsx
 * const formData = new FormData();
 * formData.append('name', 'My Store');
 * formData.append('subdomain', 'my-store');
 * formData.append('description', 'A great store');
 *
 * const result = await createStoreAction(formData);
 *
 * if (!result.hasError) {
 *   // Store created successfully — redirect is handled by the action
 * }
 * ```
 */
export async function createStoreAction(formData: FormData) {
  let storeSubdomain: string | undefined;
  let locale: string | undefined;

  const result = await actionWrapper<Store>(async () => {
    locale = await getLocale();

    const supabase = await createClient();

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authUser) {
      throw new Error(STORE_ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    const dbUser = await getUserBySupabaseId(authUser.id);

    const name = formData.get('name') as string;
    const subdomain = formData.get('subdomain') as string;
    const description = formData.get('description') as string | undefined;

    // Validation messages for createStoreSchema — the schema requires a t() function
    // to build messages. We pass i18n keys directly since validation errors propagate
    // through actionWrapper.
    const t = (key: string) => key;

    const validatedData = await createStoreSchema(t).validate({
      name,
      subdomain,
      description: description || undefined,
    });

    const store = await createStoreService(validatedData, dbUser.id);

    revalidatePath('/[locale]/dashboard');
    revalidatePath('/[locale]/stores');

    storeSubdomain = store.subdomain;

    return formatSuccess(STORE_SUCCESS_MESSAGES.CREATED, store);
  });

  // redirect() throws a special Next.js error and must be called OUTSIDE of
  // actionWrapper so it is not caught and swallowed by the wrapper's try/catch.
  if (!result.hasError && storeSubdomain && locale) {
    redirect({ href: `/stores/${storeSubdomain}`, locale });
  }

  return result;
}
