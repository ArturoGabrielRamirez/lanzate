import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getCurrentUserAction } from "@/features/auth/actions/get-current-user.action";
import { ProfileEditForm } from "@/features/auth/components/ProfileEditForm";
import { getUserSubscriptionStatusAction } from "@/features/billing/actions";
import { SubscriptionStatusCard } from "@/features/billing/components";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.profile.page");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProfilePage() {
  const tBilling = await getTranslations("billing.membership");

  const userResult = await getCurrentUserAction();
  const subscriptionResult = await getUserSubscriptionStatusAction();

  if (userResult.hasError || !userResult.payload?.user) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
        <h2 className="text-lg font-semibold text-destructive">
          Error loading profile
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {userResult.message || "Failed to load user data"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Edit Form Card */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <ProfileEditForm />
      </div>

      {/* Account Information Display */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
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
      <div>
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
    </div>
  );
}
