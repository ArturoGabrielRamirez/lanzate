/**
 * Get Store Public Data — Data Layer
 *
 * Pure database operation: fetches a store by subdomain and combines
 * it with its theme configuration.
 *
 * Theme defaults are hardcoded today. When a `store_themes` table is
 * added to Prisma, update this function to query the table — no other
 * files need to change.
 *
 * @param subdomain - The store subdomain to look up
 * @returns StorePublicData with store + theme, or null if not found
 */
import { DEFAULT_HOME_SECTIONS } from '@/features/storefront/types/storefront-sections.types';
import type { StorePublicData, StoreTheme } from '@/features/stores/types';
import { prisma } from '@/lib/prisma';

/**
 * Default theme returned for all stores until per-store customization
 * is persisted in the database.
 */
const DEFAULT_THEME: StoreTheme = {
    primaryColor: '#6366f1',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    borderRadius: 'md',
    fontFamily: 'sans',
    headerLayout: 'left',
    showHeaderLogo: true,
    showFooter: true,
};

export async function getStorePublicDataData(
    subdomain: string
): Promise<StorePublicData | null> {
    const store = await prisma.store.findUnique({
        where: { subdomain },
    });

    if (!store) {
        return null;
    }

    // TODO: Replace with actual DB query when store_themes table exists:
    // const themeRow = await prisma.storeTheme.findUnique({ where: { storeId: store.id } });
    // const theme = themeRow ? mapThemeRowToTheme(themeRow) : DEFAULT_THEME;

    // TODO: Replace with actual DB query when store_appearances table exists:
    // const appearance = await prisma.storeAppearance.findUnique({ where: { storeId: store.id } });
    // const homeSections = appearance?.homeSections ?? DEFAULT_HOME_SECTIONS;

    return {
        store,
        theme: DEFAULT_THEME,
        homeSections: DEFAULT_HOME_SECTIONS,
    };
}
