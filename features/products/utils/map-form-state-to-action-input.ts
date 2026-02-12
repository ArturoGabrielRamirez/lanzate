/**
 * Form State to Action Input Mapper
 *
 * Maps the multi-step form state structure to the CreateFullProductInput
 * expected by the createProductAction server action.
 */

import type {
  CreateProductFormState,
} from "@/features/products/types";
import type {
  CreateFullProductInput,
  AttributeInput,
  VariantInput,
  ImageInput,
} from "@/features/products/types";

/**
 * Maps form state to the CreateFullProductInput expected by createProductAction
 *
 * Transforms the multi-step form state (organized by step) into the flat
 * action input structure. Handles:
 * - Mapping options to AttributeInput[]
 * - Mapping variants to VariantInput[] (filtering enabled, auto-generating SKU)
 * - Mapping images to ImageInput[]
 * - Mapping digital product configuration
 * - Merging configuration flags into basicInfo
 *
 * @param values - The complete form state from all steps
 * @param storeId - The store ID to create the product in
 * @returns The CreateFullProductInput for the server action
 */
export function mapFormStateToActionInput(
  values: CreateProductFormState,
  storeId: string
): CreateFullProductInput {
  const { basicInfo, media, variants, configurations } = values;

  // Map attributes from options
  const attributes: AttributeInput[] = variants.hasVariants
    ? variants.options
        .filter((opt) => opt.name && opt.values.length > 0)
        .map((opt) => ({
          name: opt.name,
          type: opt.type,
          values: opt.values.map((v) => v.value),
        }))
    : [];

  // Map variants
  const variantInputs: VariantInput[] = variants.hasVariants
    ? variants.variants
        .filter((v) => v.isEnabled)
        .map((v) => ({
          sku: v.sku || `SKU-${v.id.slice(0, 8).toUpperCase()}`,
          price: v.price,
          promotionalPrice: v.promotionalPrice ?? undefined,
          cost: v.cost ?? undefined,
          attributeValueIds: v.attributeValueIds,
        }))
    : [];

  // Map images
  const images: ImageInput[] = media.images.map((img) => ({
    url: img.url,
    altText: img.altText,
    position: img.position,
    isPrimary: img.isPrimary,
  }));

  // Build basic info with configuration flags
  const actionInput: CreateFullProductInput = {
    basicInfo: {
      name: basicInfo.name,
      description: basicInfo.description,
      slug: basicInfo.slug,
      brand: basicInfo.brand,
      status: basicInfo.status,
      isDigital: configurations.isDigital,
      isFeatured: configurations.isFeatured,
      isNew: configurations.isNew,
      isOnSale: configurations.isOnSale,
      allowPromotions: configurations.allowPromotions,
      trackInventory: configurations.trackInventory,
      seoTitle: basicInfo.seoTitle || undefined,
      seoDescription: basicInfo.seoDescription || undefined,
      urlSlug: basicInfo.urlSlug || undefined,
      ogImageUrl: basicInfo.ogImageUrl || undefined,
    },
    storeId,
    attributes: attributes.length > 0 ? attributes : undefined,
    variants: variantInputs.length > 0 ? variantInputs : undefined,
    images: images.length > 0 ? images : undefined,
    digitalProduct:
      configurations.isDigital && configurations.digital
        ? {
            downloadUrl: configurations.digital.downloadUrl,
            fileName: configurations.digital.fileName,
            fileType: configurations.digital.fileType,
            fileSize: configurations.digital.fileSize,
            expirationDate: configurations.digital.expirationDate ?? undefined,
            downloadLimit: configurations.digital.downloadLimit ?? undefined,
          }
        : undefined,
  };

  return actionInput;
}
