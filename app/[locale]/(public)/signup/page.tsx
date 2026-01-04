import { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import signupImage from "@/features/auth/assets/signup-pana.svg";
import { AuthCard, GoogleAuthButton, SignupForm } from "@/features/auth/components";
import { Link } from "@/i18n/navigation";

/**
 * generateMetadata - Server-side function for SEO metadata generation
 *
 * Generates metadata for the signup page using internationalized translations.
 * This helps with SEO and provides proper page titles for different locales.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.signup.page");
  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * SignupPage - User Registration Page
 *
 * A server component that renders the user registration page with a responsive
 * two-column layout. The left column contains the signup form and authentication
 * options, while the right column displays an illustration (hidden on mobile).
 *
 * Layout:
 * - Desktop: Two-column layout (form left, illustration right)
 * - Mobile: Single column (illustration hidden)
 *
 * Features:
 * - SignupForm wrapped in AuthCard for consistent styling
 * - GoogleAuthButton for OAuth authentication
 * - Links to login page and help page
 * - Responsive design with mobile-first approach
 * - Internationalized content using next-intl
 *
 * Route: /[locale]/signup
 * Protection: Public route (unauthenticated users only via middleware)
 * Redirect: Authenticated users redirected to /dashboard by middleware
 *
 * @example
 * Access via: /en/signup or /es/signup
 */
export default async function SignupPage() {
  const t = await getTranslations("auth.signup");

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
                {/* Google OAuth Button */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {t("social.label")}
                    </span>
                  </div>
                </div>
                <GoogleAuthButton />

                {/* Links Section */}
                <div className="pt-4 space-y-2">
                  <div className="flex gap-2 items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                      {t("page.links.hasAccount")}
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
            <SignupForm />
          </AuthCard>
        </div>

        {/* Right Column - Illustration Section (Hidden on mobile) */}
        <div className="hidden md:block w-full max-w-lg mx-auto md:mx-0 md:justify-self-start">
          <div className="relative aspect-square w-full">
            <Image
              src={signupImage}
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
