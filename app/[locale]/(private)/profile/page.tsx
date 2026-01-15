import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getCurrentUserAction } from "@/features/auth/actions/getCurrentUser.action";
import { ProfileEditForm } from "@/features/auth/components/ProfileEditForm";
import { getUserSubscriptionStatusAction } from "@/features/billing/actions";
import { SubscriptionStatusCard } from "@/features/billing/components";
import { createClient } from "@/lib/supabase/server";

/**
 * generateMetadata - Server-side function for SEO metadata generation
 *
 * Generates metadata for the profile page using internationalized translations.
 * This helps with SEO and provides proper page titles for different locales.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.profile.page");
  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * ProfilePage - User Profile Edit Page
 *
 * A server component that renders the user profile editing page.
 * This is a protected route that requires authentication.
 * Users can update their email and password from this page.
 *
 * Features:
 * - Protected route (requires authentication)
 * - Server-side authentication check
 * - Fetches current user data
 * - Renders ProfileEditForm for editing
 * - Displays current user information
 * - Internationalized content using next-intl
 *
 * Route: /[locale]/profile
 * Protection: Private route (authenticated users only)
 * Redirect: Unauthenticated users redirected to /login
 *
 * Architecture:
 * - Uses Server Components for authentication check
 * - Fetches user data via getCurrentUserAction
 * - Delegates form handling to ProfileEditForm client component
 * - Follows protected route pattern from dashboard
 *
 * @example
 * Access via: /en/profile or /es/profile (requires authentication)
 */
export default async function ProfilePage() {
  const t = await getTranslations("auth.profile");
  const tBilling = await getTranslations("billing.membership");

  // Check authentication status
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  // Fetch current user data
  const userResult = await getCurrentUserAction();

  // Fetch subscription status
  const subscriptionResult = await getUserSubscriptionStatusAction();

  // Handle error case
  if (userResult.hasError || !userResult.payload?.user) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] dark:bg-background">
        <main className="mx-auto max-w-3xl px-6 py-8 md:px-12 lg:px-16">
          <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
            <h2 className="text-lg font-semibold text-destructive">
              Error loading profile
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {userResult.message || "Failed to load user data"}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2] dark:bg-background">
      <main className="mx-auto max-w-3xl px-6 py-8 md:px-12 lg:px-16">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {t("page.header.title")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("page.header.description")}
          </p>
        </div>

        {/* Profile Edit Form Card */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <ProfileEditForm />
        </div>

        {/* Account Information Display */}
        <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Account Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-sm font-medium text-muted-foreground">
                Email
              </span>
              <span className="text-sm text-foreground">
                {userResult.payload.user.email}
              </span>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-sm font-medium text-muted-foreground">
                User ID
              </span>
              <span className="text-sm text-foreground font-mono">
                {userResult.payload.user.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Account Created
              </span>
              <span className="text-sm text-foreground">
                {new Date(userResult.payload.user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Status Card */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            {tBilling("title")}
          </h2>
          {subscriptionResult.hasError ? (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
              <h3 className="text-lg font-semibold text-destructive">
                Error loading membership information
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {tBilling("error")}
              </p>
            </div>
          ) : subscriptionResult.payload ? (
            <SubscriptionStatusCard 
              subscriptionStatus={subscriptionResult.payload}
              className="rounded-lg border border-border bg-card p-6 shadow-sm"
            />
          ) : (
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <p className="text-muted-foreground">{tBilling("loading")}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
