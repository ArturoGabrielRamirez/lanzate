import { getTranslations } from "next-intl/server";

import { getUserInfo } from "@/features/global/actions/get-user-info.action";
import { HamburguerIcon } from "@/features/header/components/hamburguer-icon";
import { LogoutLink } from "@/features/header/components/logout-link";
import { SettingsToolbar } from "@/features/header/components/settings-toolbar";
import { UserAvatar } from "@/features/header/components/user-avatar";
import { DRAWER_MENU_ITEMS_GUEST, NAV_MENU_ITEMS_AUTH } from "@/features/header/constants";
import { DropDrawer, DropDrawerTrigger, DropDrawerContent, DropDrawerItem, DropDrawerGroup, DropDrawerLabel } from "@/features/shadcn/components/dropdrawer";
import { Link } from "@/i18n/naviation";

async function MobileDrawer() {

    const { payload: user } = await getUserInfo()
    const t = await getTranslations();

    return (
        <DropDrawer>
            <DropDrawerTrigger className="rounded-full border-none outline-none ml-4" asChild>
                <div>
                    {user && <UserAvatar user={user} size="sm" />}
                    {!user && (
                        <HamburguerIcon />
                    )}
                </div>
            </DropDrawerTrigger>
            <DropDrawerContent className="outline-none">
                {user && (
                    <DropDrawerGroup>
                        <DropDrawerLabel>Welcome!</DropDrawerLabel>
                        <DropDrawerItem>
                            <div className="mx-auto flex items-center gap-2">
                                <UserAvatar user={user} size="md" className="md:hidden" />
                                <p className="px-2 truncate text-sm text-muted-foreground py-2 md:py-0">{user.email}</p>
                            </div>
                        </DropDrawerItem>
                    </DropDrawerGroup>
                )}
                {user && (
                    <DropDrawerGroup>
                        <DropDrawerLabel>Menu</DropDrawerLabel>
                        {NAV_MENU_ITEMS_AUTH.map((item) => (
                            <DropDrawerItem key={item.href} icon={item.icon}>
                                <Link href={item.href}>{t(item.label)}</Link>
                            </DropDrawerItem>
                        ))}
                    </DropDrawerGroup>
                )}
                {!user && (
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
                    <DropDrawerItem className="justify-center">
                        <div className="mx-auto">
                            <SettingsToolbar />
                        </div>
                    </DropDrawerItem>
                </DropDrawerGroup>
                {user && (
                    <DropDrawerItem className="text-destructive">
                        <LogoutLink />
                    </DropDrawerItem>
                )}
            </DropDrawerContent>
        </DropDrawer>
    );
}

export { MobileDrawer };