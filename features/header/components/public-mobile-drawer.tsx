import { getTranslations } from "next-intl/server";

import { HamburguerIcon } from "@/features/header/components/hamburguer-icon";
import { SettingsToolbar } from "@/features/header/components/settings-toolbar";
import { DRAWER_MENU_ITEMS_GUEST } from "@/features/header/constants";
import { DropDrawer, DropDrawerTrigger, DropDrawerContent, DropDrawerItem, DropDrawerGroup, DropDrawerLabel } from "@/features/shadcn/components/dropdrawer";
import { Link } from "@/i18n/naviation";

async function MobileDrawer() {

    const t = await getTranslations('layout.header.mobileDrawer');
    const tNav = await getTranslations();

    return (
        <DropDrawer shouldScaleBackground={true}>
            <DropDrawerTrigger className="rounded-full border-none outline-none ml-4" asChild>
                <HamburguerIcon />
            </DropDrawerTrigger>
            <DropDrawerContent className="outline-none">
                <DropDrawerGroup>
                    <DropDrawerLabel>{t('menu')}</DropDrawerLabel>
                    {DRAWER_MENU_ITEMS_GUEST.map((item) => (
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
            </DropDrawerContent>
        </DropDrawer>
    );
}

export { MobileDrawer };