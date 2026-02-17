/**
 * Section Header Component
 *
 * Reusable header for dashboard sections with consistent styling.
 * Supports optional count badge and "Ver más" link.
 *
 * @example
 * // With count and link
 * <SectionHeader title="Your Stores" count={2} href="/stores" />
 *
 * // Without count and link
 * <SectionHeader title="Tu feed" />
 *
 * // With custom link text
 * <SectionHeader title="Orders" count={5} href="/orders" linkText="View all" />
 */

import Link from 'next/link';

import { Button } from "@/features/global/components/button/button";

export interface SectionHeaderProps {
  /** Section title */
  title: string;
  /** Optional count to display in parentheses */
  count?: number;
  /** Optional link destination - shows "Ver más" link if provided */
  href?: string;
  /** Custom link text (default: "Ver más →") */
  linkText?: string;
  /** Additional CSS classes */
  className?: string;
}

export function SectionHeader({
  title,
  count,
  href,
  linkText = 'Ver más →',
  className,
}: SectionHeaderProps) {
  return (
    <div className={`mb-4 flex items-center justify-between ${className ?? ''}`}>
      <h2 className="text-xl font-semibold text-foreground">
        {title}
        {count !== undefined && ` (${count})`}
      </h2>
      {href && (
        <Link href={href}>
          <Button variant="link" className="text-primary hover:text-primary/80">
            {linkText}
          </Button>
        </Link>
      )}
    </div>
  );
}
