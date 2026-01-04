"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { LockIcon, MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { getCurrentUserAction } from "@/features/auth/actions/getCurrentUser.action";
import { updateProfileAction } from "@/features/auth/actions/updateProfile.action";
import { updateProfileSchema, type UpdateProfileInput } from "@/features/auth/schemas/auth.schema";
import { Form } from "@/features/global/components/form";
import { InputField } from "@/features/global/components/form";

/**
 * ProfileEditForm Component
 *
 * A client-side form component for editing user profile information.
 * Allows users to update their email and/or password.
 * Integrates with the global Form wrapper and InputField components for
 * consistent styling, validation, and error handling.
 *
 * Features:
 * - Email and password fields (both optional)
 * - Displays current user email in the email field
 * - Integration with React Hook Form via Form wrapper
 * - Yup schema validation for email format and password strength
 * - Password visibility toggle for password fields
 * - Inline validation error display
 * - Loading states during submission with disabled button
 * - Toast notifications for success/error feedback
 * - At least one field must be updated (enforced by schema)
 * - Internationalization support (English and Spanish)
 *
 * @example
 * ```tsx
 * import { ProfileEditForm } from '@/features/auth/components/ProfileEditForm';
 *
 * export function ProfilePage() {
 *   return (
 *     <div>
 *       <h1>Edit Profile</h1>
 *       <ProfileEditForm />
 *     </div>
 *   );
 * }
 * ```
 */
export function ProfileEditForm() {
  const t = useTranslations("auth.profile.form");
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user data on component mount
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const result = await getCurrentUserAction();

        if (!result.hasError && result.payload?.user) {
          setCurrentEmail(result.payload.user.email);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCurrentUser();
  }, []);

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">{t("messages.loadingData")}</p>
      </div>
    );
  }

  return (
    <Form<UpdateProfileInput>
      resolver={yupResolver(updateProfileSchema)}
      formAction={updateProfileAction}
      successMessage={t("messages.success")}
      loadingMessage={t("messages.loading")}
      contentButton={t("actions.submit")}
      className="flex flex-col gap-4 w-full"
      resetOnSuccess={false}
      defaultValues={{
        email: currentEmail,
        password: "",
        confirmPassword: "",
      }}
    >
      <InputField
        name="email"
        label={t("fields.email.label")}
        placeholder={t("fields.email.placeholder")}
        type="email"
        startIcon={<MailIcon className="h-4 w-4" />}
        tooltip={t("fields.email.tooltip")}
      />
      <InputField
        name="password"
        label={t("fields.password.label")}
        placeholder={t("fields.password.placeholder")}
        type="password"
        startIcon={<LockIcon className="h-4 w-4" />}
        tooltip={t("fields.password.tooltip")}
      />
      <InputField
        name="confirmPassword"
        label={t("fields.confirmPassword.label")}
        placeholder={t("fields.confirmPassword.placeholder")}
        type="password"
        startIcon={<LockIcon className="h-4 w-4" />}
        tooltip={t("fields.confirmPassword.tooltip")}
      />
    </Form>
  );
}
