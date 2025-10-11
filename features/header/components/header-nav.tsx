import { HeaderNavAuth } from '@/features/header/components/header-nav-auth';
import { HeaderNavGuest } from '@/features/header/components/header-nav-guest';
import type { HeaderNavProps } from '@/features/header/types';

function HeaderNav({ user }: HeaderNavProps) {

  const isUserAuthenticated = Boolean(user);

  return (
    <nav className="hidden md:flex items-center fixed left-1/2 -translate-x-1/2">
      {isUserAuthenticated ? (
        <HeaderNavAuth user={user} />
      ) : (
        <HeaderNavGuest />
      )}
    </nav>
  )
};

export { HeaderNav };