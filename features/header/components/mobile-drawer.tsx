import { getTranslations } from "next-intl/server";

import { HamburguerIcon } from "@/features/header/components/hamburguer-icon";
import { LogoutLink } from "@/features/header/components/logout-link";
import { SettingsToolbar } from "@/features/header/components/settings-toolbar";
import { UserAvatar } from "@/features/header/components/user-avatar";
import type { MobileDrawerProps } from "@/features/header/types";
import { DropDrawer, DropDrawerTrigger, DropDrawerContent, DropDrawerItem, DropDrawerGroup, DropDrawerLabel } from "@/features/shadcn/components/dropdrawer";
import { Link } from "@/i18n/naviation";

async function MobileDrawer({ user, menuItems }: MobileDrawerProps) {

    const t = await getTranslations('layout.header.mobileDrawer');
    const tNav = await getTranslations();

    return (
        <DropDrawer shouldScaleBackground={true}>
            <DropDrawerTrigger className="rounded-full border-none outline-none ml-4" asChild>
                <div>
                    {user && <UserAvatar user={user} size="sm" />}
                    {!user && <HamburguerIcon />}
                </div>
            </DropDrawerTrigger>
            <DropDrawerContent className="outline-none">
                {user && (
                    <DropDrawerGroup>
                        <DropDrawerLabel>{t('welcome')}</DropDrawerLabel>
                        <DropDrawerItem>
                            <div className="mx-auto flex items-center gap-2">
                                <UserAvatar user={user} size="md" className="md:hidden" />
                                <p className="px-2 truncate text-sm text-muted-foreground py-2 md:py-0">{user.email}</p>
                            </div>
                        </DropDrawerItem>
                    </DropDrawerGroup>
                )}
                <DropDrawerGroup>
                    <DropDrawerLabel>{t('menu')}</DropDrawerLabel>
                    {menuItems.map((item) => (
                        <DropDrawerItem key={item.href} icon={item.icon}>
                            <Link href={item.href} className="w-full">{tNav(item.label)}</Link>
                        </DropDrawerItem>
                    ))}
                </DropDrawerGroup>
                <DropDrawerGroup className="md:hidden">
                    <DropDrawerLabel>{t('settings')}</DropDrawerLabel>
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