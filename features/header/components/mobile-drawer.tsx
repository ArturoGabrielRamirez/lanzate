'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { X } from 'lucide-react';
import { MobileDrawerProps } from '../types';

export const MobileDrawer = ({ isOpen, onClose, links }: MobileDrawerProps) => {
  const handleLinkClick = (href: string) => {
    onClose(false);
    
    const targetId = href.split('#')[1];
    const element = document.getElementById(targetId);
    
    if (element) {
      setTimeout(() => {
        const headerOffset = 56;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 300);
    }
  };

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="md:hidden">
        <DrawerHeader className="flex items-center justify-between border-b border-border">
          <DrawerTitle>Menú</DrawerTitle>
          <DrawerClose asChild>
            <button
              className="p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* Navigation Links */}
        <nav className="flex flex-col p-4 gap-2 flex-1 overflow-y-auto">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => handleLinkClick(link.href)}
              className="px-4 py-3 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-left"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="p-4 border-t border-border mt-auto">
          <Button className="w-full" asChild>
            <Link href="/login" onClick={() => onClose(false)}>
              Acceder
            </Link>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
