"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { handleGoogleLoginAction } from "@/features/auth/actions/handleGoogleLogin.action";
import { GoogleLogo } from "@/features/global/components/icons";
import { Button } from "@/features/shadcn/components/ui/button";

/**
 * GoogleAuthButton Component
 *
 * A client-side button component that initiates Google OAuth authentication.
 * Handles the OAuth flow by calling the server action and redirecting the user
 * to Google's authentication page.
 *
 * Features:
 * - Google logo icon
 * - Loading states during OAuth initiation
 * - Error handling with toast notifications
 * - Automatic redirect to Google OAuth page on success
 * - Disabled state while loading
 * - Locale preservation through OAuth flow
 *
 * @param locale - The user's locale preference ('es' or 'en')
 *
 * @example
 * ```tsx
 * import { GoogleAuthButton } from '@/features/auth/components/GoogleAuthButton';
 *
 * export function LoginPage({ params }: { params: { locale: string } }) {
 *   return (
 *     <div>
 *       <h1>Login</h1>
 *       <GoogleAuthButton locale={params.locale} />
 *     </div>
 *   );
 * }
 * ```
 */
export function GoogleAuthButton({ locale }: { locale: string }) {
  const [isPending, startTransition] = useTransition();

  const handleGoogleLogin = async () => {
    startTransition(async () => {
      try {
        // Show loading toast
        const loadingToast = toast.loading("Iniciando sesión con Google...");

        // Call the server action to get OAuth URL, passing locale
        const result = await handleGoogleLoginAction(locale);

        // Dismiss loading toast
        toast.dismiss(loadingToast);

        if (result.hasError) {
          // Show error toast
          toast.error(result.message || "Error al iniciar sesión con Google");
          return;
        }

        // Redirect to Google OAuth page
        if (result.payload?.url) {
          toast.success("Redirigiendo a Google...");
          window.location.href = result.payload.url;
        } else {
          toast.error("No se recibió la URL de autenticación");
        }
      } catch (error) {
        toast.error("Ocurrió un error inesperado");
        console.error("Google OAuth error:", error);
      }
    });
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isPending}
      className="w-full"
      size="lg"
      variant="outline"
    >
      <GoogleLogo className="h-5 w-5 mr-2" />
      {isPending ? "Conectando con Google..." : "Continuar con Google"}
    </Button>
  );
}
