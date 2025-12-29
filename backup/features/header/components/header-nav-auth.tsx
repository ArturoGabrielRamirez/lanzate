"use client";

import { NavLinkWithUnderline } from "@/features/header/components/nav-link-with-underline";
import { NAV_MENU_ITEMS_AUTH } from "@/features/header/constants";
import type { HeaderNavAuthProps } from "@/features/header/types";
import { isActiveRoute } from "@/features/header/utils";
import { usePathname } from "@/i18n/naviation";

function HeaderNavAuth({ storesCount }: HeaderNavAuthProps) {
  const pathname = usePathname();

  return (
    <>
      {NAV_MENU_ITEMS_AUTH.map((link) => {
        const isActive = isActiveRoute(pathname, link.href);

        return (
          <NavLinkWithUnderline
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
            isActive={isActive}
            prefetch
            disabled={link.href === "/sale" && storesCount === 0}
          />
        );
      })}
    </>
  );
}

export { HeaderNavAuth };
