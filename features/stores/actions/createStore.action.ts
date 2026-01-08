'use server';

import { revalidatePath } from 'next/cache';

import { getUserBySupabaseId } from '@/features/auth/data';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { createStoreSchema } from '@/features/stores/schemas/schemaFactory';
import { createStoreService } from '@/features/stores/services';
import { createClient } from '@/lib/supabase/server';

import type { Store } from '@prisma/client';

/**
 * Create Store Server Action
 *
 * Handles store creation with account-type-based limits.
 * Creates a store for the authenticated user, enforcing limits based on their subscription.
 *
 * Flow:
 * 1. Get current authenticated user
 * 2. Extract and validate form data with createStoreSchema
 * 3. Call createStoreService (enforces account limits: FREE=2, PRO=5, ENTERPRISE=unlimited)
 * 4. Revalidate dashboard and stores paths
 * 5. Return success response
 *
 * @param formData - Form data containing store creation fields (name, description, subdomain)
 * @returns ServerResponse with created store or error
 *
 * @example
 * ```tsx
 * import { createStoreAction } from '@/features/stores/actions/createStore.action';
 *
 * const formData = new FormData();
 * formData.append('name', 'My Store');
 * formData.append('subdomain', 'my-store');
 * formData.append('description', 'A great store');
 *
 * const result = await createStoreAction(formData);
 *
 * if (!result.hasError) {
 *   // Store created successfully
 *   redirect(`/store/${result.payload.subdomain}`);
 * }
 * ```
 */
export async function createStoreAction(formData: FormData) {
  return actionWrapper<Store>(async () => {
    // Create Supabase client
    const supabase = await createClient();

    // Get current authenticated user
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authUser) {
      throw new Error('User not authenticated');
    }

    // Fetch database user to get user ID
    const dbUser = await getUserBySupabaseId(authUser.id);

    // Extract data from FormData
    const name = formData.get('name') as string;
    const subdomain = formData.get('subdomain') as string;
    const description = formData.get('description') as string | undefined;

    // Create translation function that returns English messages
    // Validation errors will be caught by actionWrapper and formatted
    const t = (key: string) => {
      // Return English messages for server-side validation
      // Client-side forms will use proper i18n
      const messages: Record<string, string> = {
        'validation.store.name.required': 'Store name is required',
        'validation.store.name.min': 'Store name must be at least 1 character',
        'validation.store.name.max': 'Store name must not exceed 100 characters',
        'validation.store.subdomain.required': 'Subdomain is required',
        'validation.store.subdomain.format':
          'Subdomain must contain only lowercase letters, numbers, and hyphens',
        'validation.store.subdomain.min': 'Subdomain must be at least 3 characters',
        'validation.store.subdomain.max': 'Subdomain must not exceed 63 characters',
        'validation.store.description.max': 'Description must not exceed 500 characters',
      };
      return messages[key] || key;
    };

    // Validate input with schema
    const validatedData = await createStoreSchema(t).validate({
      name,
      subdomain,
      description: description || undefined,
    });

    // Create store via service layer (enforces account limits)
    // Service may throw errors for limit violations
    try {
      const store = await createStoreService(validatedData, dbUser.id);

      // Revalidate paths to ensure fresh data
      revalidatePath('/[locale]/dashboard');
      revalidatePath('/[locale]/stores');

      // Return success response
      return formatSuccess('Store created successfully', store);
    } catch (error) {
      // Handle service layer errors (limit violations)
      if (error instanceof Error) {
        // Translate error keys to user-friendly messages
        const errorMessages: Record<string, string> = {
          'errors.store.limitReached.free':
            'You have reached the maximum of 2 stores for your FREE account. Upgrade to PRO for up to 5 stores.',
          'errors.store.limitReached.pro':
            'You have reached the maximum of 5 stores for your PRO account. Upgrade to ENTERPRISE for unlimited stores.',
        };

        const translatedMessage = errorMessages[error.message] || error.message;
        throw new Error(translatedMessage);
      }
      throw error;
    }
  });
}
