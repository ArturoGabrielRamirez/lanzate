"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { StoreIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Form, InputField } from "@/features/global/components/form";
import { createStoreAction } from "@/features/stores/actions/createStore.action";
import { createStoreSchema, type CreateStoreInput } from "@/features/stores/schemas/schemaFactory";
import type { CreateStoreFormProps } from "@/features/stores/types/store";

import type { Resolver } from "react-hook-form";
/**
 * CreateStoreForm Component
 *
 * A client-side form component for creating a new store.
 * Integrates with the global Form wrapper and InputField components.
 *
 * Features:
 * - Name, description (textarea), and subdomain fields
 * - Subdomain auto-transforms to lowercase on input
 * - Client-side validation with internationalized error messages
 * - useTransition pattern for non-blocking form submission
 * - Toast notifications for success/error feedback
 * - Server-side redirect to new store page on success
 *
 * @example
 * ```tsx
 * import { CreateStoreForm } from '@/features/stores/components/CreateStoreForm';
 *
 * export function CreateStorePage() {
 *   return (
 *     <div>
 *       <h1>Create Your Store</h1>
 *       <CreateStoreForm />
 *     </div>
 *   );
 * }
 * ```
 */
export function CreateStoreForm({ className }: CreateStoreFormProps) {
  const t = useTranslations();
  const tForm = useTranslations("store.create.form");

  // Create validation schema with translation function
  const storeSchema = createStoreSchema((key) => t(key));

  /**
   * Wrapper function to convert typed data to FormData
   * and call the server action
   */
  const handleCreateStore = async (data: CreateStoreInput) => {
    const formData = new FormData();
    formData.append("name", data.name);
    // Ensure subdomain is lowercase
    formData.append("subdomain", data.subdomain.toLowerCase());
    if (data.description) {
      formData.append("description", data.description);
    }
    return createStoreAction(formData);
  };

  return (
    <Form<CreateStoreInput>
      resolver={yupResolver(storeSchema) as Resolver<CreateStoreInput>}
      formAction={handleCreateStore}
      loadingMessage={tForm("messages.loading")}
      contentButton={tForm("actions.submit")}
      className={className}
    >
      {/* Store Name Field */}
      <InputField
        name="name"
        label={tForm("fields.name.label")}
        placeholder={tForm("fields.name.placeholder")}
        tooltip={tForm("fields.name.tooltip")}
        startIcon={<StoreIcon className="h-4 w-4" />}
        isRequired
      />

      {/* Description Field - Textarea */}
      <InputField
        name="description"
        label={tForm("fields.description.label")}
        placeholder={tForm("fields.description.placeholder")}
        description={tForm("fields.description.tooltip")}
        as="textarea"
        minHeight="100px"
        rows={4}
      />

      {/* Subdomain Field with lowercase transformation */}
      <InputField
        name="subdomain"
        label={tForm("fields.subdomain.label")}
        placeholder={tForm("fields.subdomain.placeholder")}
        tooltip={tForm("fields.subdomain.tooltip")}
        startText={tForm("fields.subdomain.prefix")}
        endText={tForm("fields.subdomain.suffix")}
        isRequired
      />
    </Form>
  );
}
