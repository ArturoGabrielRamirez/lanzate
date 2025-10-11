import { MobileDrawer } from '@/features/header/components';
import { HeaderActions } from '@/features/header/components/header-actions';
import { HeaderLogo } from '@/features/header/components/header-logo';
import { HeaderNav } from '@/features/header/components/header-nav';
import type { HeaderProps } from '@/features/header/types';
import { cn } from '@/lib/utils';

function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "fixed md:absolute top-0 z-30 w-full text-primary-foreground",
        className
      )}
    >
      <div className="container mx-auto px-4 flex h-14 md:h-20 items-center justify-between">
        <HeaderLogo />
        <HeaderNav />
        <div className='flex items-center gap-3'>
          <HeaderActions />
          <MobileDrawer />
        </div>
      </div>
    </header>
  );
};

export { Header };