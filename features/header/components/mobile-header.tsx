'use client';

/* import { Menu } from 'lucide-react'; */
import { useState } from 'react';

/* import { IconButton } from '@/features/global/components'; */
import { MobileDrawer } from '@/features/header/components/mobile-drawer';

function MobileHeader() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  /* const handleToggleDrawer = () => {
    setIsDrawerOpen(true);
  }; */

  const handleDrawerChange = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  return (
    <>
      {/* <IconButton
        onClick={handleToggleDrawer}
        className="md:hidden"
        aria-label="Abrir menú"
        icon={<Menu className="size-6" />}
      /> */}

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerChange}
      />
    </>
  );
};

export { MobileHeader };