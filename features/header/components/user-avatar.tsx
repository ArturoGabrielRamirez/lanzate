'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserAvatarProps } from '@/features/header/types';

const sizeToClass: Record<NonNullable<UserAvatarProps['size']>, string> = {
    sm: 'size-8 md:size-9',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
    xl: 'h-11 w-11',
};

function UserAvatar({ user, size = 'md', className }: UserAvatarProps) {
    return (
        <Avatar className={`${sizeToClass[size]} border-2 cursor-pointer border-primary ${className || ''}`}>
            <AvatarImage src={user.avatar || undefined} alt={user.email || 'User'}/>
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {(user.first_name || user.last_name || user.email || '').charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    );
};

export { UserAvatar };