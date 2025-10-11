'use client';

import { LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { logoutAction } from '@/features/auth/shared/actions/logout.action';
import { UserAvatar } from '@/features/header/components/user-avatar';
import type { UserMenuProps } from '@/features/header/types';
import { Link } from '@/i18n/navigation';

function UserMenu({ user }: UserMenuProps) {
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
      <DropdownMenuTrigger className='rounded-full border-none outline-none'>
        <UserAvatar user={user} size="md" className="cursor-pointer" />
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
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/account">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>{t('myAccount')}</span>
          </Link>
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

export { UserMenu };