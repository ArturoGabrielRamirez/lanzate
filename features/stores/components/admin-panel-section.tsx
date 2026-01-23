/**
 * Admin Panel Section Component
 *
 * Displays a grid of admin cards for store management.
 */

import { BarChart3, Box, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

import { AdminCard } from '@/features/stores/components/admin-card';
import type { AdminPanelSectionProps } from '@/features/stores/types';

export function AdminPanelSection({
  subdomain,
  productCount,
  branchCount,
}: AdminPanelSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Panel Administrativo
        </h2>
        <Link
          href={`/stores/${subdomain}/admin`}
          className="text-sm text-primary hover:underline"
        >
          Ver todos
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 xl:grid-cols-2">
        <AdminCard
          icon={Box}
          iconClassName="bg-violet-500"
          title="Productos"
          subtitle={`${productCount} items activos`}
          href={`/stores/${subdomain}/products`}
        />
        <AdminCard
          icon={Users}
          iconClassName="bg-pink-500"
          title="Empleados"
          subtitle="Próximamente"
          disabled
        />
        <AdminCard
          icon={MapPin}
          iconClassName="bg-emerald-500"
          title="Sucursales"
          subtitle={`${branchCount} ${branchCount === 1 ? 'local' : 'locales'}`}
          href={`/stores/${subdomain}/branches`}
        />
        <AdminCard
          icon={BarChart3}
          iconClassName="bg-orange-500"
          title="Analíticas"
          subtitle="Próximamente"
          disabled
        />
      </div>
    </section>
  );
}
