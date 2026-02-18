/**
 * Profile Header Visual Component
 *
 * Visual adapter that maps a UserWithStores record to EntityBanner props.
 * Receives user data via props (no data fetching).
 * Used by ProfileHeaderBar which handles data fetching.
 */

"use client";

import { User as UserIcon } from 'lucide-react';

import { Badge } from '@/features/global/components/badge/badge';
import { EntityBanner } from '@/features/global/components/entity-banner/entity-banner';
import { Text } from '@/features/global/components/typography/text/text';
import { Title } from '@/features/global/components/typography/title/title';
import { ProfileHeaderToolbar } from '@/features/profile/components/profile-header-toolbar';
import type { ProfileHeaderVisualProps } from '@/features/profile/types';

export function ProfileHeaderVisual({ user }: ProfileHeaderVisualProps) {
  const emailPrefix = user.email.split('@')[0];
  const initials = emailPrefix
    .split(/[._-]/)
    .map((part: string) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const titleNode = (
    <div className="flex flex-wrap items-center gap-2">
      <Title size="lg" className="border-none">
        {emailPrefix}
      </Title>
      <Badge variant="outline" size="sm" tooltip="Tu cuenta personal">
        <Text size="xs">mi cuenta</Text>
      </Badge>
    </div>
  );

  return (
    <EntityBanner
      size="base"
      avatarPosition="inside"
      avatarFallback={initials || <UserIcon className="h-10 w-10" />}
      avatarAlt={user.email}
      titleNode={titleNode}
      description={user.email}
      actions={<ProfileHeaderToolbar />}
      innerClassName="container mx-auto"
      className="rounded-none group"
      bannerClassName="rounded-none border-x-0 border-t-0 pt-20!"
    />
  );
}
