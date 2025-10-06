'use client';

import { useTranslations } from 'next-intl';
import { DynamicForm, FormField } from '@/features/global/components';
import { getForgotValidationSchema } from '@/features/auth/forgot-password/schemas';
import { Mail } from 'lucide-react';
import { AuthProviders } from '@/features/auth/shared/components';
import { resetPasswordAction } from '@/features/auth/forgot-password/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const ForgotPasswordForm = () => {
  const t = useTranslations('auth.forgot');

  const validationSchema = getForgotValidationSchema((key) => t(key));

  const fields: FormField[] = [
    {
      name: 'email',
      label: t('emailLabel'),
      type: 'email',
      placeholder: t('emailPlaceholder'),
      leftIcon: <Mail className="h-4 w-4" />,
      required: true,
      tooltip: t('emailTooltip'),
    },
  ];

  const router = useRouter();

  const onSubmit = async (data: any) => {
    const res = await resetPasswordAction(data.email);
    if (res.hasError) {
      toast.error(t('errorGeneric', { default: 'Something went wrong' } as any));
      return;
    }
    toast.success(t('successSent', { default: 'Reset email sent' } as any));
    const url = `/check-email?email=${encodeURIComponent(data.email)}&type=recovery`;
    router.push(url);
  };

  return (
    <div className="w-full typography">
      <div className="not-typography">
        <DynamicForm
          fields={fields}
          onSubmit={onSubmit}
          submitText={t('submitButton')}
          submitLoadingText={t('submitting')}
          validationSchema={validationSchema}
        />
        <div className="mt-4">
          <AuthProviders label={t('orContinueWith')} />
        </div>
      </div>
    </div>
  );
};


