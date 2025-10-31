'use client'

import { Lock } from "lucide-react";
import { useTranslations } from 'next-intl';

import { handleEditPasswordAction } from "@/features/auth/actions";
import { SetupPasswordPrompt } from "@/features/auth/components/change-visual/setup-password-prompt";
import usePasswordGuard from "@/features/auth/hooks/use-password-guard";
import { changePasswordSchema } from "@/features/auth/schemas/password-schema";
import { ChangePasswordButtonProps } from "@/features/auth/types";
import { ButtonWithPopup } from "@/features/global/components/button-with-popup";
import InputField from "@/features/global/components/form/input";
import { Skeleton } from '@/features/shadcn/components/ui/skeleton';


function ChangePasswordButton({
  buttonText,
  title,
  /*  className  */
}: ChangePasswordButtonProps) {
  const t = useTranslations("auth.password-change")
  const { hasPassword, loading, refreshPasswordStatus } = usePasswordGuard()

  // Función simple para cambiar contraseña
  async function changePasswordAction(formData: {
    currentPassword: string;
    password: string;
    confirmPassword: string;
  }) {
    const result = await handleEditPasswordAction(
      formData.currentPassword,
      formData.password
    )
    return result
  }

  if (loading) {
    return (
      <Skeleton className="size-6 rounded"/>
    )
  }

  // Si no tiene contraseña, mostrar prompt para configurarla
  if (!hasPassword) {
    return (
      <SetupPasswordPrompt
        operationName="cambiar tu contraseña"
        onPasswordSet={refreshPasswordStatus}
      />
    )
  }

  return (
    <div className="flex items-center gap-3">

      <ButtonWithPopup<{ currentPassword: string; password: string; confirmPassword: string }>
        text={buttonText}
        title={title}
        description={t("security-description")}
        action={changePasswordAction}
        schema={changePasswordSchema}
        messages={{
          success: t("password-updated"),
          error: t("error-updating-password"),
          loading: t("verifying-updating")
        }}
        /*  className={`${className} `} */
        variant="default"
        onlyIcon={true}
      >
        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <Lock className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-amber-300 font-medium text-sm mb-1">
                Cambio de contraseña
              </h4>
              <p className="text-amber-200/80 text-sm leading-relaxed">
                {t("security-description")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <InputField
              name="currentPassword"
              label={t("current-password-label")}
              type="password"
              placeholder={t("current-password-placeholder")}
            />
            <InputField
              name="password"
              label={t("new-password-label")}
              type="password"
              placeholder={t("new-password-placeholder")}
            />
            <InputField
              name="confirmPassword"
              label={t("confirm-password-label")}
              type="password"
              placeholder={t("confirm-password-placeholder")}
            />
          </div>
        </div>
      </ButtonWithPopup>
    </div>
  )
}

export { ChangePasswordButton };