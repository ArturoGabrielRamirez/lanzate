"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { LockIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { handleResetPasswordAction } from "@/features/auth/actions/handle-reset-password.action";
import {
  createResetPasswordSchema,
  type ResetPasswordInput,
} from "@/features/auth/schemas/schemaFactory";
import { Form } from "@/features/global/components/form";
import { InputField } from "@/features/global/components/form";

/**
 * PasswordResetForm Component
 *
 * A client-side form component for resetting the user's password after clicking
 * the reset link from their email. Users enter their new password and confirm it.
 *
 * Features:
 * - Password and confirm password fields with validation
 * - Integration with React Hook Form via Form wrapper
 * - Yup schema validation for password strength and matching
 * - Password visibility toggle for both password fields
 * - Inline validation error display
 * - Loading states during submission with disabled button
 * - Success redirect to /login page
 * - Toast notifications for success/error feedback
 * - Full internationalization support (Spanish and English)
 *
 * Security Note:
 * - User must have a valid reset token in their session from the email link
 * - Token validation is handled automatically by Supabase
 *
 * @example
 * ```tsx
 * import { PasswordResetForm } from '@/features/auth/components/PasswordResetForm';
 *
 * export function ResetPasswordPage() {
 *   return (
 *     <div>
 *       <h1>Create New Password</h1>
 *       <PasswordResetForm />
 *     </div>
 *   );
 * }
 * ```
 */
export function PasswordResetForm() {
  const t = useTranslations();
  const tForm = useTranslations("auth.resetPasswordUpdate.form");

  // Create schema with translation function
  const resetPasswordSchema = createResetPasswordSchema((key) => t(key));

  return (
    <Form<ResetPasswordInput>
      resolver={yupResolver(resetPasswordSchema)}
      formAction={handleResetPasswordAction}
      successRedirect="/login"
      successMessage={tForm("messages.success")}
      loadingMessage={tForm("messages.loading")}
      contentButton={tForm("actions.submit")}
      className="flex flex-col gap-4 w-full"
      resetOnSuccess={false}
    >
      <InputField
        name="password"
        label={tForm("fields.password.label")}
        placeholder={tForm("fields.password.placeholder")}
        type="password"
        startIcon={<LockIcon className="h-4 w-4" />}
        tooltip={tForm("fields.password.tooltip")}
        isRequired
      />
      <InputField
        name="confirmPassword"
        label={tForm("fields.confirmPassword.label")}
        placeholder={tForm("fields.confirmPassword.placeholder")}
        type="password"
        startIcon={<LockIcon className="h-4 w-4" />}
        tooltip={tForm("fields.confirmPassword.tooltip")}
        isRequired
      />
    </Form>
  );
}
