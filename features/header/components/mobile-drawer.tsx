import { Menu } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { DropDrawer, DropDrawerTrigger, DropDrawerContent, DropDrawerItem, DropDrawerGroup, DropDrawerLabel } from "@/components/dropdrawer";
import { getCurrentUserAction } from "@/features/global/actions";
import { IconButton } from "@/features/global/components";
import { UserAvatar, LogoutLink, SettingsToolbar } from "@/features/header/components";
import { DRAWER_MENU_ITEMS_GUEST, NAV_MENU_ITEMS_AUTH } from "@/features/header/constants";
import { Link } from "@/i18n/navigation";


async function MobileDrawer() {

  const { payload: currentUser } = await getCurrentUserAction();
  const t = await getTranslations();

  return (
    <DropDrawer>
      <DropDrawerTrigger className="rounded-full border-none outline-none ml-4" asChild>
        <div>
          {currentUser && <UserAvatar user={currentUser} size="xl" />}
          {!currentUser && (
            <IconButton
              className="md:hidden"
              icon={<Menu className="size-7 md:size-8" />}
            />
          )}
        </div>
      </DropDrawerTrigger>
      <DropDrawerContent className="outline-none">
        {currentUser && (
          <DropDrawerGroup>
            <DropDrawerLabel>Welcome!</DropDrawerLabel>
            <DropDrawerItem>
              <div className="mx-auto flex items-center gap-2">
                <UserAvatar user={currentUser} size="md" className="md:hidden" />
                <p className="px-2 truncate text-sm text-muted-foreground py-2 md:py-0">{currentUser.email}</p>
              </div>
            </DropDrawerItem>
          </DropDrawerGroup>
        )}
        {currentUser && (
          <DropDrawerGroup>
            <DropDrawerLabel>Menu</DropDrawerLabel>
            {NAV_MENU_ITEMS_AUTH.map((item) => (
              <DropDrawerItem key={item.href} icon={item.icon}>
                <Link href={item.href}>{t(item.label)}</Link>
              </DropDrawerItem>
            ))}
          </DropDrawerGroup>
        )}
        {!currentUser && (
          <DropDrawerGroup>
            <DropDrawerLabel>Menu</DropDrawerLabel>
            {DRAWER_MENU_ITEMS_GUEST.map((item) => (
              <DropDrawerItem key={item.href} icon={item.icon}>
                <Link href={item.href} className="w-full">{t(item.label)}</Link>
              </DropDrawerItem>
            ))}
          </DropDrawerGroup>
        )}
        <DropDrawerGroup className="md:hidden">
          <DropDrawerLabel>Settings</DropDrawerLabel>
          <DropDrawerItem>
            <div className="mx-auto">
              <SettingsToolbar />
            </div>
          </DropDrawerItem>
        </DropDrawerGroup>
        {currentUser && (
          <DropDrawerItem className="text-destructive">
            <LogoutLink />
          </DropDrawerItem>
        )}
      </DropDrawerContent>
    </DropDrawer>
  );
}

export { MobileDrawer };