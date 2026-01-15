/**
 * BillingPageHeader Component
 *
 * Header component for the billing history page.
 * Displays title, subtitle, and breadcrumb navigation.
 */

import { ChevronRight } from 'lucide-react';

import { Link } from '@/i18n/navigation';

interface BillingPageHeaderProps {
  title: string;
  subtitle: string;
}

export function BillingPageHeader({ title, subtitle }: BillingPageHeaderProps) {
  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/profile" className="hover:text-foreground transition-colors">
          Perfil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{title}</span>
      </nav>

      {/* Title and Subtitle */}
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 text-muted-foreground">{subtitle}</p>
    </div>
  );
}
