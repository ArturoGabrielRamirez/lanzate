"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { LockIcon, MailIcon } from "lucide-react";

import { handleLoginAction } from "@/features/auth/actions/handleLogin.action";
import { loginSchema, type LoginInput } from "@/features/auth/schemas/auth.schema";
import { Form } from "@/features/global/components/form";
import { InputField } from "@/features/global/components/form";

/**
 * LoginForm Component
 *
 * A client-side form component for user authentication with email and password.
 * Integrates with the global Form wrapper and InputField components for
 * consistent styling, validation, and error handling.
 *
 * Features:
 * - Email and password fields with validation
 * - Integration with React Hook Form via Form wrapper
 * - Yup schema validation for email format
 * - Password visibility toggle for password field
 * - Inline validation error display
 * - Loading states during submission with disabled button
 * - Success redirect to /dashboard
 * - Toast notifications for success/error feedback
 *
 * @example
 * ```tsx
 * import { LoginForm } from '@/features/auth/components/LoginForm';
 *
 * export function LoginPage() {
 *   return (
 *     <div>
 *       <h1>Login</h1>
 *       <LoginForm />
 *     </div>
 *   );
 * }
 * ```
 */
export function LoginForm() {
  return (
    <Form<LoginInput>
      resolver={yupResolver(loginSchema)}
      formAction={handleLoginAction}
      successRedirect="/dashboard"
      successMessage="Inicio de sesión exitoso. Bienvenido de nuevo!"
      loadingMessage="Iniciando sesión..."
      contentButton="Iniciar sesión"
      className="flex flex-col gap-4 w-full"
      resetOnSuccess={false}
    >
      <InputField
        name="email"
        label="Email"
        placeholder="tu@email.com"
        type="email"
        startIcon={<MailIcon className="h-4 w-4" />}
        tooltip="Ingresa tu correo electrónico"
        isRequired
      />
      <InputField
        name="password"
        label="Contraseña"
        placeholder="Ingresa tu contraseña"
        type="password"
        startIcon={<LockIcon className="h-4 w-4" />}
        tooltip="Ingresa tu contraseña"
        isRequired
      />
    </Form>
  );
}
