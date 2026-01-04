import { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import resetPasswordImage from "@/features/auth/assets/reset-password-pana.svg";
import { AuthCard, PasswordResetForm } from "@/features/auth/components";
import { Link } from "@/i18n/navigation";

/**
 * generateMetadata - Server-side function for SEO metadata generation
 *
 * Generates metadata for the password reset update page using internationalized translations.
 * This helps with SEO and provides proper page titles for different locales.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.resetPasswordUpdate.page");
  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * ResetPasswordUpdatePage - Password Reset Form Page
 *
 * A server component that renders the password reset form page after the user
 * clicks the reset link from their email. Users enter their new password and
 * confirm it to complete the password reset process.
 *
 * Layout:
 * - Desktop: Two-column layout (form left, illustration right)
 * - Mobile: Single column (illustration hidden)
 *
 * Features:
 * - PasswordResetForm wrapped in AuthCard for consistent styling
 * - Token extraction handled automatically by Supabase session
 * - Links to login page and help page
 * - Responsive design with mobile-first approach
 * - Internationalized content using next-intl
 *
 * Security Note:
 * - Token from URL is automatically validated by Supabase Auth
 * - Invalid or expired tokens will result in error messages
 * - Users must have clicked the reset link from their email
 *
 * Flow:
 * 1. User clicks reset link in email (contains token parameter)
 * 2. Supabase Auth validates token and sets temporary session
 * 3. User enters new password and confirms it
 * 4. Form validates password strength
 * 5. Server action updates password via Supabase Auth
 * 6. User is redirected to login page with success message
 *
 * Route: /[locale]/reset-password/update
 * Protection: Public route (requires valid reset token)
 *
 * @example
 * Access via: /en/reset-password/update or /es/reset-password/update
 * Note: Users reach this page through email link with token parameter
 */
export default async function ResetPasswordUpdatePage() {
  const t = await getTranslations("auth.resetPasswordUpdate");

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
                    <span className="text-sm text-muted-foreground">
                      {t("page.links.rememberedPassword")}
                    </span>
                    <Link
                      href="/login"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {t("page.links.loginLink")}
                    </Link>
                  </div>
                  <div className="flex gap-2 items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                      {t("page.links.needHelp")}
                    </span>
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
            <PasswordResetForm />
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
