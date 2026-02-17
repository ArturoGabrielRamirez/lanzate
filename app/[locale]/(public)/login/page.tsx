import { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import loginImage from "@/features/auth/assets/login-pana.svg";
import { AuthCard, GoogleAuthButton, LoginForm } from "@/features/auth/components";
import { Text } from "@/features/global/components/typography/text/text";
import { Link } from "@/i18n/navigation";

/**
 * generateMetadata - Server-side function for SEO metadata generation
 *
 * Generates metadata for the login page using internationalized translations.
 * This helps with SEO and provides proper page titles for different locales.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.login.page");
  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * LoginPage - User Login Page
 *
 * A server component that renders the user login page with a responsive
 * two-column layout. The left column contains the login form and authentication
 * options, while the right column displays an illustration (hidden on mobile).
 *
 * Layout:
 * - Desktop: Two-column layout (form left, illustration right)
 * - Mobile: Single column (illustration hidden)
 *
 * Features:
 * - LoginForm wrapped in AuthCard for consistent styling
 * - GoogleAuthButton for OAuth authentication
 * - Links to signup page, password reset, and help page
 * - Responsive design with mobile-first approach
 * - Internationalized content using next-intl
 *
 * Route: /[locale]/login
 * Protection: Public route (unauthenticated users only via middleware)
 * Redirect: Authenticated users redirected to /dashboard by middleware
 *
 * @example
 * Access via: /en/login or /es/login
 */
export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("auth.login");

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
                <GoogleAuthButton locale={locale} />

                {/* Links Section */}
                <div className="pt-4 space-y-2">
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
                    <Link
                      href="/reset-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {t("page.links.resetPassword")}
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
            <LoginForm />
          </AuthCard>
        </div>

        {/* Right Column - Illustration Section (Hidden on mobile) */}
        <div className="hidden md:block w-full max-w-lg mx-auto md:mx-0 md:justify-self-start">
          <div className="relative aspect-square w-full">
            <Image
              src={loginImage}
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
