'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserAvatarProps } from '@/features/header/types';
import { cn } from '@/lib/utils';

const sizeToClass: Record<NonNullable<UserAvatarProps['size']>, string> = {
    sm: 'size-8 md:size-9',
    md: 'size-9',
    lg: 'size-10',
    xl: 'size-11',
};

function UserAvatar({ user, size = 'md', className }: UserAvatarProps) {
    return (
        <Avatar className={cn(sizeToClass[size], 'border-2 cursor-pointer border-primary', className)}>
            <AvatarImage src={user.avatar || undefined} alt={user.email || 'User'} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {(user.first_name || user.last_name || user.email || '').charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    );
};

export { UserAvatar };