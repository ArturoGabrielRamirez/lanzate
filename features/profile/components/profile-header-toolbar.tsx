"use client";

import {
  ArrowLeft,
  MoreHorizontal,
  Settings,
  User,
} from "lucide-react";

import { Button } from "@/features/global/components/button/button";
import { useIsMobile } from "@/features/global/hooks/use-mobile";
import {
  DropDrawer,
  DropDrawerContent,
  DropDrawerItem,
  DropDrawerTrigger,
  DropDrawerGroup,
  DropDrawerSeparator,
} from "@/features/shadcn/components/ui/dropdrawer";
import { useRouter } from "@/i18n/navigation";

/**
 * ProfileHeaderToolbar - Toolbar with actions for the profile header
 *
 * Provides navigation (go back) and more options.
 * Responsive: Desktop shows separate buttons, Mobile shows DropDrawer only.
 */
export function ProfileHeaderToolbar() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center gap-2 justify-end container mx-auto mt-auto opacity-50 group-hover:opacity-100 transition-opacity">
      {/* Desktop-only buttons */}
      {!isMobile && (
        <Button
          variant="outline"
          size="icon"
          onClick={handleGoBack}
          aria-label="Volver"
          tooltip="Volver"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
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
          {/* Mobile-only navigation */}
          {isMobile && (
            <DropDrawerGroup>
              <DropDrawerItem onClick={handleGoBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </DropDrawerItem>
            </DropDrawerGroup>
          )}

          {isMobile && <DropDrawerSeparator />}

          <DropDrawerGroup>
            <DropDrawerItem disabled>
              <User className="h-4 w-4 mr-2" />
              Editar perfil
            </DropDrawerItem>
            <DropDrawerItem disabled>
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </DropDrawerItem>
          </DropDrawerGroup>
        </DropDrawerContent>
      </DropDrawer>
    </div>
  );
}
