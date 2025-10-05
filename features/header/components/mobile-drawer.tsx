'use client';

import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

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
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onClose(false)}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="p-4 border-t border-border space-y-3 mt-auto">
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/saber-mas" onClick={() => onClose(false)}>
              Saber más
            </Link>
          </Button>
          <Button className="w-full" asChild>
            <Link href="/acceder" onClick={() => onClose(false)}>
              Acceder
            </Link>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
