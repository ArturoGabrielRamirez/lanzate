"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { handleResetPasswordRequestAction } from "@/features/auth/actions/handleResetPasswordRequest.action";
import {
  createResetPasswordRequestSchema,
  type ResetPasswordRequestInput,
} from "@/features/auth/schemas/schemaFactory";
import { Form } from "@/features/global/components/form";
import { InputField } from "@/features/global/components/form";

/**
 * PasswordResetRequestForm Component
 *
 * A client-side form component for requesting a password reset email.
 * Users enter their email address and receive a reset link via email.
 *
 * Features:
 * - Email field with validation
 * - Integration with React Hook Form via Form wrapper
 * - Yup schema validation for email format
 * - Inline validation error display
 * - Loading states during submission with disabled button
 * - Success redirect to /reset-password/confirmation page
 * - Toast notifications for success/error feedback
 * - Full internationalization support (Spanish and English)
 *
 * Security Note:
 * - Always shows success message even if email doesn't exist
 * - This prevents email enumeration attacks
 *
 * @example
 * ```tsx
 * import { PasswordResetRequestForm } from '@/features/auth/components/PasswordResetRequestForm';
 *
 * export function ResetPasswordPage() {
 *   return (
 *     <div>
 *       <h1>Reset Password</h1>
 *       <PasswordResetRequestForm />
 *     </div>
 *   );
 * }
 * ```
 */
export function PasswordResetRequestForm() {
  const t = useTranslations();
  const tForm = useTranslations("auth.resetPassword.form");

  // Create schema with translation function
  const resetPasswordRequestSchema = createResetPasswordRequestSchema((key) => t(key));

  return (
    <Form<ResetPasswordRequestInput>
      resolver={yupResolver(resetPasswordRequestSchema)}
      formAction={handleResetPasswordRequestAction}
      successRedirect="/reset-password/confirmation"
      successMessage={tForm("messages.success")}
      loadingMessage={tForm("messages.loading")}
      contentButton={tForm("actions.submit")}
      className="flex flex-col gap-4 w-full"
      resetOnSuccess={false}
    >
      <InputField
        name="email"
        label={tForm("fields.email.label")}
        placeholder={tForm("fields.email.placeholder")}
        type="email"
        startIcon={<MailIcon className="h-4 w-4" />}
        tooltip={tForm("fields.email.tooltip")}
        description={tForm("fields.email.description")}
        isRequired
      />
    </Form>
  );
}
