"use client";

import { useState } from "react";
import type { Store } from "@prisma/client";
import {
  ArrowLeft,
  MoreHorizontal,
  Share2,
  Package,
  Store as StoreIcon,
  Settings,
} from "lucide-react";

import { useIsMobile } from "@/features/global/hooks/use-mobile";
import { Button } from "@/features/global/components/button/button";
import { CreateProductForm } from "@/features/products/components/create-form";
import {
  DropDrawer,
  DropDrawerContent,
  DropDrawerItem,
  DropDrawerTrigger,
  DropDrawerGroup,
  DropDrawerSeparator,
} from "@/features/shadcn/components/ui/dropdrawer";
import { useRouter } from "@/i18n/navigation";

import { ShareStoreDialog } from "./share-store-dialog";

interface StoreHeaderToolbarProps {
  store: Store;
  isOwner?: boolean;
}

/**
 * StoreHeaderToolbar - Toolbar with actions for the store header
 *
 * Provides navigation (go back), sharing, and more options.
 * Responsive: Desktop shows separate buttons, Mobile shows DropDrawer only.
 */
export function StoreHeaderToolbar({
  store,
  isOwner = true,
}: StoreHeaderToolbarProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleShare = () => {
    setIsShareOpen(true);
  };

  return (
    <div className="flex items-center gap-2 justify-end container mx-auto mt-auto opacity-50 group-hover:opacity-100 transition-opacity">
      {/* Desktop-only buttons */}
      {!isMobile && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={handleGoBack}
            aria-label="Volver"
            tooltip="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            aria-label="Compartir"
            tooltip="Compartir"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* DropDrawer - visible on both mobile and desktop */}
      <DropDrawer>
        <DropDrawerTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Más opciones"
            noTooltip
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropDrawerTrigger>
        <DropDrawerContent>
          {/* Mobile-only navigation items */}
          {isMobile && (
            <DropDrawerGroup>
              <DropDrawerItem onClick={handleGoBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </DropDrawerItem>
              <DropDrawerItem onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </DropDrawerItem>
            </DropDrawerGroup>
          )}

          {/* Separator for mobile */}
          {isMobile && <DropDrawerSeparator />}

          {/* Common items */}
          <DropDrawerGroup>
            {isOwner && (
              <CreateProductForm
                trigger={
                  <DropDrawerItem>
                    <Package className="h-4 w-4 mr-2" />
                    Crear producto
                  </DropDrawerItem>
                }
              />
            )}
            <DropDrawerItem disabled>
              <StoreIcon className="h-4 w-4 mr-2" />
              Editar tienda
            </DropDrawerItem>
            <DropDrawerItem disabled>
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </DropDrawerItem>
          </DropDrawerGroup>
        </DropDrawerContent>
      </DropDrawer>

      {/* Share Dialog */}
      <ShareStoreDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        subdomain={store.subdomain}
        storeName={store.name}
      />
    </div>
  );
}
