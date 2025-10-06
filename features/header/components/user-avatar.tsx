'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUserInitials } from '@/features/global/utils';
import type { User } from '@supabase/supabase-js';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeToClass: Record<NonNullable<UserAvatarProps['size']>, string> = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-10 w-10',
};

export const UserAvatar = ({ user, size = 'md', className }: UserAvatarProps) => {
  return (
    <Avatar className={`${sizeToClass[size]} border-2 border-primary ${className || ''}`}>
      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User'} />
      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
        {getUserInitials(user)}
      </AvatarFallback>
    </Avatar>
  );
};


