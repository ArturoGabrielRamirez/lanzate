import { getCurrentUserAction } from '@/features/global/actions';
import { HeaderNavAuth } from '@/features/header/components/header-nav-auth';
import { HeaderNavGuest } from '@/features/header/components/header-nav-guest';

async function HeaderNav() {

  const { payload: currentUser } = await getCurrentUserAction();

  return (
    <nav className="hidden xl:flex items-center fixed left-1/2 -translate-x-1/2 gap-8">
      {currentUser ? (
        <HeaderNavAuth />
      ) : (
        <HeaderNavGuest />
      )}
    </nav>
  )
};

export { HeaderNav };