"use client";

import { useEffect } from "react";
import { Package, FileDown } from "lucide-react";

import { Input } from "@/features/shadcn/components/ui/input";
import { Label } from "@/features/shadcn/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/features/shadcn/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shadcn/components/ui/select";
import { useCreateProductContext } from "@/features/products/hooks";

/**
 * TypeSpecificStep - Step 4 of product creation
 *
 * Handles product type configuration:
 * - Physical product: weight, dimensions
 * - Digital product: download URL, file info, expiration, limits
 */
export function TypeSpecificStep() {
  const { values, setValues, setStepValid } = useCreateProductContext();
  const { configurations } = values;
  const { isDigital, physical, digital } = configurations;

  // Step is always valid (settings are optional)
  useEffect(() => {
    setStepValid(4, true);
  }, [setStepValid]);

  /**
   * Toggle between physical and digital product
   */
  const handleTypeChange = (value: string) => {
    const isDigitalProduct = value === "digital";
    setValues({
      configurations: {
        ...configurations,
        isDigital: isDigitalProduct,
        // Initialize default configs
        physical: isDigitalProduct
          ? null
          : physical || {
              weight: null,
              weightUnit: "kg",
              width: null,
              height: null,
              depth: null,
              dimensionUnit: "cm",
            },
        digital: isDigitalProduct
          ? digital || {
              downloadUrl: "",
              fileName: "",
              fileType: "",
              fileSize: 0,
              expirationDate: null,
              downloadLimit: null,
            }
          : null,
      },
    });
  };

  /**
   * Update physical product config
   */
  const handlePhysicalChange = (
    field: keyof NonNullable<typeof physical>,
    value: string | number | null
  ) => {
    if (!physical) return;
    setValues({
      configurations: {
        ...configurations,
        physical: {
          ...physical,
          [field]: value,
        },
      },
    });
  };

  /**
   * Update digital product config
   */
  const handleDigitalChange = (
    field: keyof NonNullable<typeof digital>,
    value: string | number | Date | null
  ) => {
    if (!digital) return;
    setValues({
      configurations: {
        ...configurations,
        digital: {
          ...digital,
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Tipo de Producto</h2>
        <p className="text-sm text-muted-foreground">
          Selecciona si tu producto es físico o digital y configura los detalles
          específicos.
        </p>
      </div>

      {/* Product Type Selection */}
      <RadioGroup
        value={isDigital ? "digital" : "physical"}
        onValueChange={handleTypeChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Label
          htmlFor="physical"
          className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
            !isDigital ? "border-primary bg-primary/5" : "hover:bg-muted/50"
          }`}
        >
          <RadioGroupItem value="physical" id="physical" />
          <Package className="h-8 w-8 text-muted-foreground" />
          <div className="space-y-1">
            <span className="font-medium">Producto Físico</span>
            <p className="text-sm text-muted-foreground">
              Requiere envío y tiene dimensiones físicas.
            </p>
          </div>
        </Label>

        <Label
          htmlFor="digital"
          className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
            isDigital ? "border-primary bg-primary/5" : "hover:bg-muted/50"
          }`}
        >
          <RadioGroupItem value="digital" id="digital" />
          <FileDown className="h-8 w-8 text-muted-foreground" />
          <div className="space-y-1">
            <span className="font-medium">Producto Digital</span>
            <p className="text-sm text-muted-foreground">
              Descarga instantánea, sin envío físico.
            </p>
          </div>
        </Label>
      </RadioGroup>

      {/* Physical Product Settings */}
      {!isDigital && physical && (
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-medium">Configuración de Envío</h3>

          {/* Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Peso</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={physical.weight ?? ""}
                onChange={(e) =>
                  handlePhysicalChange(
                    "weight",
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Unidad</Label>
              <Select
                value={physical.weightUnit}
                onValueChange={(value) =>
                  handlePhysicalChange(
                    "weightUnit",
                    value as "kg" | "lb" | "g" | "oz"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                  <SelectItem value="g">Gramos (g)</SelectItem>
                  <SelectItem value="lb">Libras (lb)</SelectItem>
                  <SelectItem value="oz">Onzas (oz)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-2">
            <Label>Dimensiones</Label>
            <div className="grid grid-cols-4 gap-2">
              <Input
                type="number"
                placeholder="Ancho"
                value={physical.width ?? ""}
                onChange={(e) =>
                  handlePhysicalChange(
                    "width",
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
              />
              <Input
                type="number"
                placeholder="Alto"
                value={physical.height ?? ""}
                onChange={(e) =>
                  handlePhysicalChange(
                    "height",
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
              />
              <Input
                type="number"
                placeholder="Profundidad"
                value={physical.depth ?? ""}
                onChange={(e) =>
                  handlePhysicalChange(
                    "depth",
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
              />
              <Select
                value={physical.dimensionUnit}
                onValueChange={(value) =>
                  handlePhysicalChange(
                    "dimensionUnit",
                    value as "cm" | "in" | "m"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="in">in</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Digital Product Settings */}
      {isDigital && digital && (
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-medium">Configuración de Descarga</h3>

          {/* Download URL */}
          <div className="space-y-2">
            <Label>URL de descarga</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={digital.downloadUrl}
              onChange={(e) =>
                handleDigitalChange("downloadUrl", e.target.value)
              }
            />
            <p className="text-xs text-muted-foreground">
              URL del archivo que se enviará al comprador.
            </p>
          </div>

          {/* File Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre del archivo</Label>
              <Input
                placeholder="mi-archivo.pdf"
                value={digital.fileName}
                onChange={(e) =>
                  handleDigitalChange("fileName", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de archivo</Label>
              <Input
                placeholder="PDF, ZIP, MP3..."
                value={digital.fileType}
                onChange={(e) =>
                  handleDigitalChange("fileType", e.target.value)
                }
              />
            </div>
          </div>

          {/* File Size */}
          <div className="space-y-2">
            <Label>Tamaño del archivo (MB)</Label>
            <Input
              type="number"
              placeholder="0"
              value={digital.fileSize || ""}
              onChange={(e) =>
                handleDigitalChange(
                  "fileSize",
                  e.target.value ? parseFloat(e.target.value) : 0
                )
              }
            />
          </div>

          {/* Download Limit */}
          <div className="space-y-2">
            <Label>Límite de descargas (opcional)</Label>
            <Input
              type="number"
              placeholder="Sin límite"
              value={digital.downloadLimit ?? ""}
              onChange={(e) =>
                handleDigitalChange(
                  "downloadLimit",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
            />
            <p className="text-xs text-muted-foreground">
              Número máximo de veces que el comprador puede descargar el
              archivo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
