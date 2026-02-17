import { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import resetPasswordImage from "@/features/auth/assets/reset-password-pana.svg";
import { AuthCard, PasswordResetRequestForm } from "@/features/auth/components";
import { Text } from "@/features/global/components/typography/text/text";
import { Link } from "@/i18n/navigation";

/**
 * generateMetadata - Server-side function for SEO metadata generation
 *
 * Generates metadata for the password reset request page using internationalized translations.
 * This helps with SEO and provides proper page titles for different locales.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.resetPassword.page");
  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * ResetPasswordPage - Password Reset Request Page
 *
 * A server component that renders the password reset request page with a responsive
 * two-column layout. The left column contains the reset password request form,
 * while the right column displays an illustration (hidden on mobile).
 *
 * Layout:
 * - Desktop: Two-column layout (form left, illustration right)
 * - Mobile: Single column (illustration hidden)
 *
 * Features:
 * - PasswordResetRequestForm wrapped in AuthCard for consistent styling
 * - Links to login page and signup page
 * - Responsive design with mobile-first approach
 * - Internationalized content using next-intl
 * - Security: Always shows success message to prevent email enumeration
 *
 * Flow:
 * 1. User enters their email address
 * 2. Form validates email format
 * 3. Server action sends reset link via email
 * 4. User is redirected to /reset-password/confirmation page
 *
 * Route: /[locale]/reset-password
 * Protection: Public route (unauthenticated users only via middleware)
 * Redirect: Authenticated users redirected to /dashboard by middleware
 *
 * @example
 * Access via: /en/reset-password or /es/reset-password
 */
export default async function ResetPasswordPage() {
  const t = await getTranslations("auth.resetPassword");

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
        {/* Left Column - Form Section */}
        <div className="w-full max-w-md mx-auto md:mx-0 md:justify-self-end">
          <AuthCard
            heading={t("page.header.title")}
            description={t("page.header.description")}
            footer={
              <div className="w-full space-y-3">
                {/* Links Section */}
                <div className="pt-4 space-y-2">
                  <div className="flex gap-2 items-center justify-center">
                    <Text size="xs" as="span">
                      {t("page.links.rememberedPassword")}
                    </Text>
                    <Link
                      href="/login"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {t("page.links.loginLink")}
                    </Link>
                  </div>
                  <div className="flex gap-2 items-center justify-center">
                    <Text size="xs" as="span">
                      {t("page.links.noAccount")}
                    </Text>
                    <Link
                      href="/signup"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {t("page.links.signupLink")}
                    </Link>
                  </div>
                  <div className="flex gap-2 items-center justify-center">
                    <Text size="xs" as="span">
                      {t("page.links.needHelp")}
                    </Text>
                    <Link
                      href="/help"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {t("page.links.helpLink")}
                    </Link>
                  </div>
                </div>
              </div>
            }
          >
            <PasswordResetRequestForm />
          </AuthCard>
        </div>

        {/* Right Column - Illustration Section (Hidden on mobile) */}
        <div className="hidden md:block w-full max-w-lg mx-auto md:mx-0 md:justify-self-start">
          <div className="relative aspect-square w-full">
            <Image
              src={resetPasswordImage}
              alt={t("page.image.alt")}
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
