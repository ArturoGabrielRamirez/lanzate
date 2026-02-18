/**
 * Profile Header Bar Component (Server Component)
 *
 * Autonomous server component that fetches user data
 * and renders the profile header visual.
 * Used in the private header to display the profile banner.
 */

import { getProfileHeaderAction } from '@/features/profile/actions';
import { ProfileHeaderVisual } from '@/features/profile/components/profile-header-visual';

export async function ProfileHeaderBar() {
  const result = await getProfileHeaderAction();

  if (result.hasError || !result.payload) {
    return null;
  }

  return <ProfileHeaderVisual user={result.payload} />;
}
