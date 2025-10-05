'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { MobileHeaderProps } from '../types';
import { MobileDrawer } from './mobile-drawer';

export const MobileHeader = ({ links }: MobileHeaderProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleToggleDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerChange = (open: boolean) => {
    setIsDrawerOpen(open);
  };

  return (
    <>
      <button
        onClick={handleToggleDrawer}
        className="md:hidden p-2 rounded-md hover:bg-accent transition-colors cursor-pointer"
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" />
      </button>

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerChange}
        links={links}
      />
    </>
  );
};
