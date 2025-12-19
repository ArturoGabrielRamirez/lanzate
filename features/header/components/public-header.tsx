import { BaseHeader } from "@/features/header/components/base-header";
import { BrandLogo } from "@/features/header/components/brand-logo";
import { HeaderActions } from "@/features/header/components/header-actions";
import { HeaderNavContainer } from "@/features/header/components/header-nav-container";
import { HeaderNavGuest } from "@/features/header/components/header-nav-guest";
import { MobileDrawer } from "@/features/header/components/mobile-drawer";
import { DRAWER_MENU_ITEMS_GUEST } from "@/features/header/constants";
import type { PublicHeaderProps } from "@/features/header/types";

async function PublicHeader({ className }: PublicHeaderProps) {
  return (
    <BaseHeader className={className}>
      <BrandLogo />
      <HeaderNavContainer>
        <HeaderNavGuest />
      </HeaderNavContainer>
      <div className="flex items-center">
        <HeaderActions showLogin={true} />
        <MobileDrawer user={null} menuItems={DRAWER_MENU_ITEMS_GUEST} />
      </div>
    </BaseHeader>
  );
}

export { PublicHeader };
