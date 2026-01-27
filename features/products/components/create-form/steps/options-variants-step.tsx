"use client";

import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/features/shadcn/components/ui/button";
import { Input } from "@/features/shadcn/components/ui/input";
import { Label } from "@/features/shadcn/components/ui/label";
import { Switch } from "@/features/shadcn/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/features/shadcn/components/ui/collapsible";
import { useCreateProductContext } from "@/features/products/hooks";
import type {
  CreateProductOption,
  CreateProductOptionValue,
  CreateProductVariantForm,
} from "@/features/products/types";

/**
 * Generate all possible variant combinations from options
 */
function generateVariantCombinations(
  options: CreateProductOption[]
): CreateProductVariantForm[] {
  if (options.length === 0 || options.some((opt) => opt.values.length === 0)) {
    return [];
  }

  // Get all value combinations using cartesian product
  const valueCombinations = options.reduce<CreateProductOptionValue[][]>(
    (acc, option) => {
      if (acc.length === 0) {
        return option.values.map((v) => [v]);
      }
      const newCombinations: CreateProductOptionValue[][] = [];
      for (const combo of acc) {
        for (const value of option.values) {
          newCombinations.push([...combo, value]);
        }
      }
      return newCombinations;
    },
    []
  );

  // Create variants from combinations
  return valueCombinations.map((combo) => ({
    id: uuidv4(),
    sku: "",
    price: 0,
    promotionalPrice: null,
    cost: null,
    attributeValueIds: combo.map((v) => v.id),
    attributeCombination: combo.map((v) => v.value).join(" / "),
    isEnabled: true,
  }));
}

/**
 * OptionsVariantsStep - Step 3 of product creation
 *
 * Handles product options and variants:
 * - Toggle variants on/off
 * - Add/remove options (e.g., Size, Color)
 * - Add/remove values for each option
 * - Auto-generate variant combinations
 * - Set pricing per variant
 */
export function OptionsVariantsStep() {
  const { values, setValues, setStepValid } = useCreateProductContext();
  const { variants } = values;
  const { hasVariants, options, variants: variantsList } = variants;

  const [expandedOptions, setExpandedOptions] = useState<Set<string>>(
    new Set()
  );

  // Step is valid if:
  // - hasVariants is false, OR
  // - hasVariants is true AND there's at least one variant with price > 0
  useEffect(() => {
    if (!hasVariants) {
      setStepValid(3, true);
    } else {
      const hasValidVariant = variantsList.some(
        (v) => v.isEnabled && v.price > 0
      );
      setStepValid(3, hasValidVariant);
    }
  }, [hasVariants, variantsList, setStepValid]);

  /**
   * Toggle variants on/off
   */
  const handleToggleVariants = (enabled: boolean) => {
    setValues({
      variants: {
        ...variants,
        hasVariants: enabled,
        // Reset options and variants when disabling
        options: enabled ? options : [],
        variants: enabled ? variantsList : [],
      },
    });
  };

  /**
   * Add a new option (attribute)
   */
  const handleAddOption = () => {
    const newOption: CreateProductOption = {
      id: uuidv4(),
      name: "",
      type: "TEXT",
      values: [],
    };
    setValues({
      variants: {
        ...variants,
        options: [...options, newOption],
      },
    });
    setExpandedOptions((prev) => new Set([...prev, newOption.id]));
  };

  /**
   * Update an option's name
   */
  const handleUpdateOptionName = (optionId: string, name: string) => {
    const updatedOptions = options.map((opt) =>
      opt.id === optionId ? { ...opt, name } : opt
    );
    setValues({
      variants: {
        ...variants,
        options: updatedOptions,
      },
    });
  };

  /**
   * Remove an option
   */
  const handleRemoveOption = (optionId: string) => {
    const updatedOptions = options.filter((opt) => opt.id !== optionId);
    const newVariants = generateVariantCombinations(updatedOptions);
    setValues({
      variants: {
        ...variants,
        options: updatedOptions,
        variants: newVariants,
      },
    });
  };

  /**
   * Add a value to an option
   */
  const handleAddValue = (optionId: string) => {
    const newValue: CreateProductOptionValue = {
      id: uuidv4(),
      value: "",
    };
    const updatedOptions = options.map((opt) =>
      opt.id === optionId
        ? { ...opt, values: [...opt.values, newValue] }
        : opt
    );
    setValues({
      variants: {
        ...variants,
        options: updatedOptions,
      },
    });
  };

  /**
   * Update a value
   */
  const handleUpdateValue = (
    optionId: string,
    valueId: string,
    newValue: string
  ) => {
    const updatedOptions = options.map((opt) =>
      opt.id === optionId
        ? {
            ...opt,
            values: opt.values.map((v) =>
              v.id === valueId ? { ...v, value: newValue } : v
            ),
          }
        : opt
    );
    setValues({
      variants: {
        ...variants,
        options: updatedOptions,
      },
    });
  };

  /**
   * Remove a value from an option
   */
  const handleRemoveValue = (optionId: string, valueId: string) => {
    const updatedOptions = options.map((opt) =>
      opt.id === optionId
        ? { ...opt, values: opt.values.filter((v) => v.id !== valueId) }
        : opt
    );
    const newVariants = generateVariantCombinations(updatedOptions);
    setValues({
      variants: {
        ...variants,
        options: updatedOptions,
        variants: newVariants,
      },
    });
  };

  /**
   * Generate variants from current options
   */
  const handleGenerateVariants = useCallback(() => {
    const newVariants = generateVariantCombinations(options);
    setValues({
      variants: {
        ...variants,
        variants: newVariants,
      },
    });
  }, [options, variants, setValues]);

  /**
   * Update variant field
   */
  const handleUpdateVariant = (
    variantId: string,
    field: keyof CreateProductVariantForm,
    value: string | number | boolean | null
  ) => {
    const updatedVariants = variantsList.map((v) =>
      v.id === variantId ? { ...v, [field]: value } : v
    );
    setValues({
      variants: {
        ...variants,
        variants: updatedVariants,
      },
    });
  };

  /**
   * Toggle option expanded state
   */
  const toggleOptionExpanded = (optionId: string) => {
    setExpandedOptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(optionId)) {
        newSet.delete(optionId);
      } else {
        newSet.add(optionId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Opciones y Variantes</h2>
        <p className="text-sm text-muted-foreground">
          Configura las opciones del producto (talla, color, etc.) para generar
          variantes con precios individuales.
        </p>
      </div>

      {/* Toggle Variants */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-0.5">
          <Label htmlFor="has-variants">Este producto tiene variantes</Label>
          <p className="text-sm text-muted-foreground">
            Activa esta opción si tu producto tiene diferentes opciones como
            talla o color.
          </p>
        </div>
        <Switch
          id="has-variants"
          checked={hasVariants}
          onCheckedChange={handleToggleVariants}
        />
      </div>

      {hasVariants && (
        <>
          {/* Options Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Opciones</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar opción
              </Button>
            </div>

            {options.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4 border rounded-lg">
                No hay opciones. Agrega una opción como "Talla" o "Color".
              </p>
            )}

            {options.map((option) => (
              <Collapsible
                key={option.id}
                open={expandedOptions.has(option.id)}
                onOpenChange={() => toggleOptionExpanded(option.id)}
              >
                <div className="border rounded-lg">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        {expandedOptions.has(option.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          {option.name || "Nueva opción"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({option.values.length} valores)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveOption(option.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="p-4 pt-0 space-y-4 border-t">
                      {/* Option Name */}
                      <div className="space-y-2">
                        <Label>Nombre de la opción</Label>
                        <Input
                          placeholder="Ej: Talla, Color, Material"
                          value={option.name}
                          onChange={(e) =>
                            handleUpdateOptionName(option.id, e.target.value)
                          }
                        />
                      </div>

                      {/* Values */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Valores</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddValue(option.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Agregar valor
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {option.values.map((value) => (
                            <div
                              key={value.id}
                              className="flex items-center gap-2"
                            >
                              <Input
                                placeholder="Ej: S, M, L o Rojo, Azul"
                                value={value.value}
                                onChange={(e) =>
                                  handleUpdateValue(
                                    option.id,
                                    value.id,
                                    e.target.value
                                  )
                                }
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveValue(option.id, value.id)
                                }
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>

          {/* Generate Variants Button */}
          {options.length > 0 &&
            options.every((opt) => opt.values.length > 0) && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleGenerateVariants}
                className="w-full"
              >
                Generar variantes ({options.reduce(
                  (acc, opt) => acc * opt.values.length,
                  1
                )})
              </Button>
            )}

          {/* Variants Table */}
          {variantsList.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Variantes ({variantsList.length})
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3">Variante</th>
                      <th className="text-left p-3">SKU</th>
                      <th className="text-left p-3">Precio</th>
                      <th className="text-left p-3">Precio Promo</th>
                      <th className="text-center p-3">Activo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {variantsList.map((variant) => (
                      <tr key={variant.id}>
                        <td className="p-3 font-medium">
                          {variant.attributeCombination}
                        </td>
                        <td className="p-3">
                          <Input
                            className="h-8 w-28"
                            placeholder="SKU"
                            value={variant.sku}
                            onChange={(e) =>
                              handleUpdateVariant(
                                variant.id,
                                "sku",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            className="h-8 w-24"
                            type="number"
                            placeholder="0"
                            value={variant.price || ""}
                            onChange={(e) =>
                              handleUpdateVariant(
                                variant.id,
                                "price",
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            className="h-8 w-24"
                            type="number"
                            placeholder="0"
                            value={variant.promotionalPrice || ""}
                            onChange={(e) =>
                              handleUpdateVariant(
                                variant.id,
                                "promotionalPrice",
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : null
                              )
                            }
                          />
                        </td>
                        <td className="p-3 text-center">
                          <Switch
                            checked={variant.isEnabled}
                            onCheckedChange={(checked) =>
                              handleUpdateVariant(
                                variant.id,
                                "isEnabled",
                                checked
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
