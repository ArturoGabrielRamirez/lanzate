'use client'
import { useTranslations } from 'next-intl';
import { handleEditPassword } from "../../actions";
import { ChangePasswordButtonProps } from '../../types';
import { ButtonWithPopup, InputField } from "@/features/layout/components";
import { SetupPasswordPrompt } from '../change-visual/setup-password-prompt';
import usePasswordGuard from '../../hooks/use-password-guard';
import { Key, Lock } from "lucide-react";
import * as yup from 'yup'
import { passwordSchema } from '../../schemas/password-schema';
import { Skeleton } from '@/components/ui/skeleton';

// Schema de Yup para compatibilidad con ButtonWithPopup
/* const yupChangePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('La contraseña actual es requerida'),
  password: yup
    .string()
    .required('La nueva contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: yup
    .string()
    .required('Confirmar contraseña es requerido')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
}) */

export default function ChangePasswordButton({
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
    const result = await handleEditPassword(
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

  // Si tiene contraseña, mostrar el cambio normal
  return (
    <div className="flex items-center gap-3">
      {/* <Key className="w-5 h-5 text-gray-400" /> */}
      {/*   <div className="flex-1">
        <h4 className="text-white font-medium">Cambiar contraseña</h4>
        <p className="text-gray-400 text-sm">Actualiza tu contraseña</p>
      </div> */}

      <ButtonWithPopup<any, { currentPassword: string; password: string; confirmPassword: string }>
        text={buttonText}
        title={title}
        description={t("security-description")}
        action={changePasswordAction}
        schema={passwordSchema}
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