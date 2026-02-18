"use client";

import { Package, Sparkles, Tag, Star, Megaphone } from "lucide-react";
import { useEffect } from "react";

import { useCreateProductContext } from "@/features/products/hooks";
import { Label } from "@/features/shadcn/components/ui/label";
import { Switch } from "@/features/shadcn/components/ui/switch";

/**
 * ConfigurationsStep - Step 5 of product creation
 *
 * Handles product configuration flags:
 * - Inventory tracking
 * - Featured product
 * - New product badge
 * - On sale badge
 * - Allow promotions
 */
export function ConfigurationsStep() {
  const { values, setValues, setStepValid } = useCreateProductContext();
  const { configurations } = values;
  const {
    trackInventory,
    isFeatured,
    isNew,
    isOnSale,
    allowPromotions,
  } = configurations;

  // Step is always valid (all settings have defaults)
  useEffect(() => {
    setStepValid(5, true);
  }, [setStepValid]);

  /**
   * Update a configuration flag
   */
  const handleConfigChange = (
    field: keyof typeof configurations,
    value: boolean
  ) => {
    setValues({
      configurations: {
        ...configurations,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Configuraciones</h2>
        <p className="text-sm text-muted-foreground">
          Configura las opciones adicionales del producto.
        </p>
      </div>

      <div className="space-y-4">
        {/* Inventory Tracking */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label htmlFor="track-inventory">Control de inventario</Label>
              <p className="text-sm text-muted-foreground">
                Rastrea la cantidad disponible de este producto.
              </p>
            </div>
          </div>
          <Switch
            id="track-inventory"
            checked={trackInventory}
            onCheckedChange={(checked) =>
              handleConfigChange("trackInventory", checked)
            }
          />
        </div>

        {/* Featured Product */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label htmlFor="is-featured">Producto destacado</Label>
              <p className="text-sm text-muted-foreground">
                Muestra este producto en secciones destacadas de tu tienda.
              </p>
            </div>
          </div>
          <Switch
            id="is-featured"
            checked={isFeatured}
            onCheckedChange={(checked) =>
              handleConfigChange("isFeatured", checked)
            }
          />
        </div>

        {/* New Product Badge */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label htmlFor="is-new">Marcar como nuevo</Label>
              <p className="text-sm text-muted-foreground">
                Muestra un badge de &quote;Nuevo&quote; en el producto.
              </p>
            </div>
          </div>
          <Switch
            id="is-new"
            checked={isNew}
            onCheckedChange={(checked) => handleConfigChange("isNew", checked)}
          />
        </div>

        {/* On Sale Badge */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Tag className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label htmlFor="is-on-sale">En oferta</Label>
              <p className="text-sm text-muted-foreground">
                Muestra un badge de &quote;Oferta&quote; en el producto.
              </p>
            </div>
          </div>
          <Switch
            id="is-on-sale"
            checked={isOnSale}
            onCheckedChange={(checked) =>
              handleConfigChange("isOnSale", checked)
            }
          />
        </div>

        {/* Allow Promotions */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Megaphone className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label htmlFor="allow-promotions">Permitir promociones</Label>
              <p className="text-sm text-muted-foreground">
                Permite que este producto participe en promociones y descuentos.
              </p>
            </div>
          </div>
          <Switch
            id="allow-promotions"
            checked={allowPromotions}
            onCheckedChange={(checked) =>
              handleConfigChange("allowPromotions", checked)
            }
          />
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h3 className="font-medium mb-2">Resumen del producto</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • Nombre: <strong>{values.basicInfo.name || "Sin nombre"}</strong>
          </li>
          <li>
            • Estado:{" "}
            <strong>
              {values.basicInfo.status === "DRAFT"
                ? "Borrador"
                : values.basicInfo.status === "ACTIVE"
                  ? "Activo"
                  : "Archivado"}
            </strong>
          </li>
          <li>
            • Tipo:{" "}
            <strong>
              {configurations.isDigital ? "Digital" : "Físico"}
            </strong>
          </li>
          <li>
            • Imágenes: <strong>{values.media.images.length}</strong>
          </li>
          {values.variants.hasVariants && (
            <li>
              • Variantes: <strong>{values.variants.variants.length}</strong>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
