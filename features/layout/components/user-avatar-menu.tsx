'use client';

/**
 * UserAvatar Menu Component (Client Component)
 *
 * Displays the user avatar with a dropdown/drawer menu
 * for profile options and logout.
 * Uses DropDrawer for responsive mobile/desktop experience.
 */

import { LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { handleLogoutAction } from '@/features/auth/actions/handleLogout.action';
import { Avatar } from '@/features/global/components/avatar/avatar';
import type { UserAvatarMenuProps } from '@/features/layout/types';
/* import { Avatar, AvatarFallback, AvatarImage } from '@/features/shadcn/components/ui/avatar'; */
import {
  DropDrawer,
  DropDrawerContent,
  DropDrawerGroup,
  DropDrawerItem,
  DropDrawerLabel,
  DropDrawerSeparator,
  DropDrawerTrigger,
} from '@/features/shadcn/components/ui/dropdrawer';
import { Link } from '@/i18n/navigation';


export function UserAvatarMenu({ user }: UserAvatarMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initials = user.name
    ? user.name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : user.email.charAt(0).toUpperCase();

  const handleLogout = () => {
    startTransition(async () => {
      await handleLogoutAction();
      router.push('/');
    });
  };

  return (
    <DropDrawer>
      <DropDrawerTrigger asChild>
        <Avatar
          size='sm'
          src={user.image || ''}
          alt={user.name || 'User avatar'}
          fallback={initials}
          status="success"
          tooltip='Click to see more options'
        />
      </DropDrawerTrigger>

      <DropDrawerContent>
        <DropDrawerLabel className="flex flex-col">
          <span className="font-semibold text-foreground">{user.name || 'Usuario'}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </DropDrawerLabel>

        <DropDrawerSeparator />

        <DropDrawerGroup>
          <DropDrawerItem asChild>
            <Link href="/profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Ver Perfil
            </Link>
          </DropDrawerItem>
          <DropDrawerItem asChild>
            <Link href="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </Link>
          </DropDrawerItem>
        </DropDrawerGroup>

        <DropDrawerSeparator />

        <DropDrawerItem
          variant="destructive"
          onClick={handleLogout}
          disabled={isPending}
          asChild
        >
          <div className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            {isPending ? 'Cerrando sesión...' : 'Cerrar Sesión'}
          </div>
        </DropDrawerItem>
      </DropDrawerContent>
    </DropDrawer>
  );
}
