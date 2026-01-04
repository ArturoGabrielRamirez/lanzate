"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { LockIcon, MailIcon } from "lucide-react";

import { handleSignupAction } from "@/features/auth/actions/handleSignup.action";
import { signupSchema, type SignupInput } from "@/features/auth/schemas/auth.schema";
import { Form } from "@/features/global/components/form";
import { InputField } from "@/features/global/components/form";

/**
 * SignupForm Component
 *
 * A client-side form component for user registration with email and password.
 * Integrates with the global Form wrapper and InputField components for
 * consistent styling, validation, and error handling.
 *
 * Features:
 * - Email and password fields with confirm password validation
 * - Integration with React Hook Form via Form wrapper
 * - Yup schema validation for email format and password strength
 * - Password visibility toggle for password fields
 * - Inline validation error display
 * - Loading states during submission with disabled button
 * - Success redirect to /dashboard
 * - Toast notifications for success/error feedback
 *
 * @example
 * ```tsx
 * import { SignupForm } from '@/features/auth/components/SignupForm';
 *
 * export function SignupPage() {
 *   return (
 *     <div>
 *       <h1>Create Account</h1>
 *       <SignupForm />
 *     </div>
 *   );
 * }
 * ```
 */
export function SignupForm() {
  return (
    <Form<SignupInput>
      resolver={yupResolver(signupSchema)}
      formAction={handleSignupAction}
      successRedirect="/dashboard"
      successMessage="Cuenta creada exitosamente. Bienvenido!"
      loadingMessage="Creando tu cuenta..."
      contentButton="Crear cuenta"
      className="flex flex-col gap-4 w-full"
      resetOnSuccess={false}
    >
      <InputField
        name="email"
        label="Email"
        placeholder="tu@email.com"
        type="email"
        startIcon={<MailIcon className="h-4 w-4" />}
        tooltip="Ingresa un correo electrónico válido"
        isRequired
      />
      <InputField
        name="password"
        label="Contraseña"
        placeholder="Mínimo 8 caracteres"
        type="password"
        startIcon={<LockIcon className="h-4 w-4" />}
        tooltip="Debe tener al menos 8 caracteres, una letra mayúscula y un número"
        isRequired
      />
      <InputField
        name="confirmPassword"
        label="Confirmar contraseña"
        placeholder="Confirma tu contraseña"
        type="password"
        startIcon={<LockIcon className="h-4 w-4" />}
        tooltip="Debe coincidir con la contraseña ingresada arriba"
        isRequired
      />
    </Form>
  );
}
