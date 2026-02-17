import { CheckCircle2Icon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/features/global/components/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/features/shadcn/components/ui/card";
import { Link } from "@/i18n/navigation";

/**
 * ResetPasswordConfirmationPage - Password Reset Email Sent Confirmation Page
 *
 * A server component that displays a confirmation message after a user has requested
 * a password reset link. This page informs users to check their email for further
 * instructions.
 *
 * Features:
 * - Simple, centered confirmation message
 * - Success icon for visual feedback
 * - Clear instructions to check email
 * - Link to return to login page
 * - Responsive design
 * - Internationalized content using next-intl
 *
 * Security Note:
 * - This page is shown regardless of whether the email exists in the system
 * - This prevents email enumeration attacks
 *
 * Flow:
 * 1. User requests password reset on /reset-password page
 * 2. Form is submitted successfully
 * 3. User is redirected to this confirmation page
 * 4. User checks their email for reset link
 * 5. User can return to login or wait for email
 *
 * Route: /[locale]/reset-password/confirmation
 * Protection: Public route
 *
 * @example
 * Access via: /en/reset-password/confirmation or /es/reset-password/confirmation
 */
export default async function ResetPasswordConfirmationPage() {
  const t = await getTranslations("auth.resetPassword.confirmation");

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle2Icon className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{t("title")}</CardTitle>
            <CardDescription className="text-base">
              {t("description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">{t("instructions")}</p>
            <div className="bg-muted/50 p-4 rounded-md">
              <p className="text-sm font-medium">{t("note.title")}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("note.message")}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/login">{t("actions.backToLogin")}</Link>
            </Button>
            <div className="flex gap-2 items-center justify-center w-full">
              <span className="text-sm text-muted-foreground">
                {t("links.needHelp")}
              </span>
              <Link
                href="/help"
                className="text-sm font-medium text-primary hover:underline"
              >
                {t("links.helpLink")}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
