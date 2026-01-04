"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { MailIcon } from "lucide-react";

import { handleResetPasswordRequestAction } from "@/features/auth/actions/handleResetPasswordRequest.action";
import {
  resetPasswordRequestSchema,
  type ResetPasswordRequestInput,
} from "@/features/auth/schemas/auth.schema";
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
  return (
    <Form<ResetPasswordRequestInput>
      resolver={yupResolver(resetPasswordRequestSchema)}
      formAction={handleResetPasswordRequestAction}
      successRedirect="/reset-password/confirmation"
      successMessage="Se ha enviado un correo con instrucciones para restablecer tu contraseña."
      loadingMessage="Enviando correo..."
      contentButton="Enviar instrucciones"
      className="flex flex-col gap-4 w-full"
      resetOnSuccess={false}
    >
      <InputField
        name="email"
        label="Email"
        placeholder="tu@email.com"
        type="email"
        startIcon={<MailIcon className="h-4 w-4" />}
        tooltip="Ingresa el correo electrónico asociado a tu cuenta"
        description="Te enviaremos un enlace para restablecer tu contraseña"
        isRequired
      />
    </Form>
  );
}
