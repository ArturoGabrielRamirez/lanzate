"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ChevronDown } from "lucide-react";

import { InputField } from "@/features/global/components/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/features/shadcn/components/ui/collapsible";
import { useCreateProductContext } from "../create-product-provider";
import type { CreateProductBasicInfo } from "@/features/products/types";

/**
 * Validation schema for basic info step
 */
const basicInfoSchema = yup.object({
  name: yup
    .string()
    .required("El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: yup
    .string()
    .max(2000, "La descripción no puede exceder 2000 caracteres"),
  slug: yup
    .string()
    .required("El slug es requerido")
    .matches(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones"),
  brand: yup.string().max(50, "La marca no puede exceder 50 caracteres"),
  status: yup.string().oneOf(["DRAFT", "ACTIVE", "ARCHIVED"]).required(),
  seoTitle: yup.string().max(60, "El título SEO no puede exceder 60 caracteres"),
  seoDescription: yup.string().max(160, "La descripción SEO no puede exceder 160 caracteres"),
  urlSlug: yup.string(),
  ogImageUrl: yup.string().url("Debe ser una URL válida").nullable(),
});

/**
 * Slugify helper - converts string to URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * BasicInfoStep - Step 1 of product creation
 *
 * Collects basic product information:
 * - Name and description
 * - URL slug (auto-generated from name)
 * - Brand
 * - Status (Draft/Active/Archived)
 * - SEO fields (title, description, OG image)
 */
export function BasicInfoStep() {
  const { values, setValues, setStepValid, step } = useCreateProductContext();
  const { basicInfo } = values;

  const methods = useForm<CreateProductBasicInfo>({
    resolver: yupResolver(basicInfoSchema),
    defaultValues: basicInfo,
    mode: "onChange",
  });

  const {
    watch,
    setValue,
    formState: { isValid, errors },
  } = methods;

  // Watch name for auto-slug generation
  const name = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (name && !basicInfo.slug) {
      const newSlug = slugify(name);
      setValue("slug", newSlug, { shouldValidate: true });
    }
  }, [name, basicInfo.slug, setValue]);

  // Sync form values with context
  useEffect(() => {
    const subscription = watch((formValues) => {
      setValues({
        basicInfo: {
          ...basicInfo,
          ...formValues,
        } as CreateProductBasicInfo,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, setValues, basicInfo]);

  // Update step validation status
  useEffect(() => {
    setStepValid(1, isValid);
  }, [isValid, setStepValid]);

  const [seoOpen, setSeoOpen] = useState(false);

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Información Básica</h2>
          <p className="text-sm text-muted-foreground">
            Ingresa los datos básicos de tu producto
          </p>
        </div>

        <div className="grid gap-4">
          {/* Row 1: Name + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="name"
              label="Nombre del producto"
              placeholder="Ej: Camiseta de algodón"
              isRequired
            />
            <InputField
              name="slug"
              label="URL amigable (slug)"
              placeholder="camiseta-algodon"
              isRequired
              tooltip="Se genera automáticamente a partir del nombre. Puedes editarlo manualmente."
            />
          </div>

          {/* Row 2: Brand + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="brand"
              label="Marca"
              placeholder="Ej: Mi Marca"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-10"
                value={basicInfo.status}
                onChange={(e) =>
                  setValues({
                    basicInfo: {
                      ...basicInfo,
                      status: e.target.value as "DRAFT" | "ACTIVE" | "ARCHIVED",
                    },
                  })
                }
              >
                <option value="DRAFT">Borrador</option>
                <option value="ACTIVE">Activo</option>
                <option value="ARCHIVED">Archivado</option>
              </select>
            </div>
          </div>

          {/* Row 3: Description */}
          <InputField
            name="description"
            label="Descripción"
            placeholder="Describe tu producto..."
            as="textarea"
          />
        </div>

        {/* SEO Section - Collapsible */}
        <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full text-left group">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">SEO</h3>
              <p className="text-sm text-muted-foreground">
                Optimiza tu producto para buscadores (opcional)
              </p>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ml-auto ${
                seoOpen ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="seoTitle"
                label="Título SEO"
                placeholder="Título para buscadores (máx. 60 caracteres)"
                tooltip="El título que aparecerá en los resultados de búsqueda"
              />
              <InputField
                name="ogImageUrl"
                label="Imagen para redes sociales"
                placeholder="https://ejemplo.com/imagen.jpg"
                tooltip="URL de la imagen que se mostrará al compartir en redes sociales"
              />
            </div>
            <InputField
              name="seoDescription"
              label="Descripción SEO"
              placeholder="Descripción para buscadores (máx. 160 caracteres)"
              as="textarea"
              tooltip="La descripción que aparecerá en los resultados de búsqueda"
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </FormProvider>
  );
}
