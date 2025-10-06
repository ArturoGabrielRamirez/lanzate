'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logoutAction } from '@/features/auth/shared/actions/logout.action';
import { getUserDisplayName } from '@/features/global/utils';
import { UserAvatar } from './user-avatar';
import { toast } from 'sonner';
import type { HeaderCurrentUser } from '../types';

interface UserMenuProps {
  user: HeaderCurrentUser;
}

export const UserMenu = ({ user }: UserMenuProps) => {
  const t = useTranslations('header.userMenu');
  const router = useRouter();

  const handleLogout = async () => {
    const res = await logoutAction();
    if (res.hasError) {
      toast.error(t('logoutError'));
      return;
    }
    toast.success(t('logoutSuccess'));
    router.push('/');
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <UserAvatar user={user} size="md" className="cursor-pointer" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName || user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push('/account')}
          className="cursor-pointer"
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span>{t('myAccount')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

