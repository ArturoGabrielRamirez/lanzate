"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { LockIcon, MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { handleSignupAction } from "@/features/auth/actions/handleSignup.action";
import { createSignupSchema, type SignupInput } from "@/features/auth/schemas/schemaFactory";
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
 * - Full internationalization support (Spanish and English)
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
  const t = useTranslations();
  const tForm = useTranslations("auth.signup.form");

  // Create schema with translation function
  const signupSchema = createSignupSchema((key) => t(key));

  return (
    <Form<SignupInput>
      resolver={yupResolver(signupSchema)}
      formAction={handleSignupAction}
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
