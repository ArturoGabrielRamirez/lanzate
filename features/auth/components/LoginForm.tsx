"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { LockIcon, MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { handleLoginAction } from "@/features/auth/actions/handle-login.action";
import { createLoginSchema, type LoginInput } from "@/features/auth/schemas/schemaFactory";
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
 * - Full internationalization support (Spanish and English)
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
  const t = useTranslations();
  const tForm = useTranslations("auth.login.form");

  // Create schema with translation function
  const loginSchema = createLoginSchema((key) => t(key));

  return (
    <Form<LoginInput>
      resolver={yupResolver(loginSchema)}
      formAction={handleLoginAction}
      successRedirect="/dashboard"
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
        isRequired
      />
      <InputField
        name="password"
        label={tForm("fields.password.label")}
        placeholder={tForm("fields.password.placeholder")}
        type="password"
        startIcon={<LockIcon className="h-4 w-4" />}
        tooltip={tForm("fields.password.tooltip")}
        isRequired
      />
    </Form>
  );
}
