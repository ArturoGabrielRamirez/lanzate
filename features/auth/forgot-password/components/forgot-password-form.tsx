'use client';

import { useTranslations } from 'next-intl';
import { DynamicForm, FormField } from '@/features/global/components/form';
import { getForgotValidationSchema } from '../schemas';
import { Mail } from 'lucide-react';
import { AuthProviders } from '@/features/auth/shared/components/auth-providers';

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

  const onSubmit = async (data: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Forgot password data:', data);
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


