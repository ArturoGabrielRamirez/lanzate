'use client';

/**
 * Store Detail Component
 *
 * Displays detailed information about a store.
 * Used on the /stores/[subdomain] page.
 */

import { Calendar, ExternalLink, Globe, Pencil, Store as StoreIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/features/shadcn/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/shadcn/components/ui/card';
import { DeleteStoreButton } from '@/features/stores/components/delete-store-button';
import type { StoreDetailProps } from '@/features/stores/types';
import { formatDate } from '@/features/stores/utils';

export function StoreDetail({ store }: StoreDetailProps) {
  const publicUrl = `http://${store.subdomain}.localhost:3000`;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/stores" className="hover:text-foreground">
          Tiendas
        </Link>
        <span>/</span>
        <span className="text-foreground">{store.name}</span>
      </nav>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <StoreIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{store.name}</CardTitle>
                <CardDescription className="mt-1">
                  {store.description || 'Sin descripción'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <DeleteStoreButton store={store} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* URL pública */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">URL pública:</span>
            <Link
              href={publicUrl}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
              target="_blank"
            >
              {store.subdomain}
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {/* Fecha de creación */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Creada el:</span>
            <span className="text-sm">{formatDate(store.createdAt, 'long')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
