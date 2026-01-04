"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { LockIcon } from "lucide-react";

import { handleResetPasswordAction } from "@/features/auth/actions/handleResetPassword.action";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/features/auth/schemas/auth.schema";
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
  return (
    <Form<ResetPasswordInput>
      resolver={yupResolver(resetPasswordSchema)}
      formAction={handleResetPasswordAction}
      successRedirect="/login"
      successMessage="Contraseña restablecida exitosamente. Ya puedes iniciar sesión."
      loadingMessage="Restableciendo contraseña..."
      contentButton="Restablecer contraseña"
      className="flex flex-col gap-4 w-full"
      resetOnSuccess={false}
    >
      <InputField
        name="password"
        label="Nueva contraseña"
        placeholder="Mínimo 8 caracteres"
        type="password"
        startIcon={<LockIcon className="h-4 w-4" />}
        tooltip="Debe tener al menos 8 caracteres, una letra mayúscula y un número"
        isRequired
      />
      <InputField
        name="confirmPassword"
        label="Confirmar nueva contraseña"
        placeholder="Confirma tu nueva contraseña"
        type="password"
        startIcon={<LockIcon className="h-4 w-4" />}
        tooltip="Debe coincidir con la contraseña ingresada arriba"
        isRequired
      />
    </Form>
  );
}
