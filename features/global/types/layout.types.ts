/**
 * Props for locale-based layout components
 * Used in app/[locale]/layout.tsx
 */
export interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Props for the root layout component
 * Used in app/layout.tsx
 */
export interface RootLayoutProps {
  children: React.ReactNode;
}
