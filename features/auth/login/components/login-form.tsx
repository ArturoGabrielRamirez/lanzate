'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { DynamicForm, FormField } from '@/features/global/components/form';
import { getLoginValidationSchema } from '../schemas';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { AuthProviders } from '@/features/auth/shared/components/auth-providers';

export const LoginForm = () => {
  const t = useTranslations('auth.login');

  // Validation schema
  const validationSchema = getLoginValidationSchema((key) => t(key));

  // Form fields configuration
  const formFields: FormField[] = [
    {
      name: 'email',
      label: t('emailLabel'),
      type: 'email',
      placeholder: t('emailPlaceholder'),
      leftIcon: <Mail className="h-4 w-4" />,
      required: true,
      tooltip: t('emailTooltip'),
    },
    {
      name: 'password',
      label: t('passwordLabel'),
      type: 'password',
      placeholder: t('passwordPlaceholder'),
      leftIcon: <Lock className="h-4 w-4" />,
      required: true,
      tooltip: t('passwordTooltip'),
    },
  ];

  // Handle form submission
  const handleSubmit = async (data: any) => {
    // Simulate a 1 second delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Login data:', data);
    // TODO: Implement login logic
  };

  return (
    <div className="w-full space-y-6 typography">
      {/* Form */}
      <div className="not-typography space-y-4">
        <DynamicForm
          fields={formFields}
          onSubmit={handleSubmit}
          submitText={t('submitButton')}
          submitLoadingText={t('submitting')}
          validationSchema={validationSchema}
        />

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="small text-primary hover:underline"
          >
            {t('forgotPassword')}
          </Link>
        </div>

        <AuthProviders label={t('orContinueWith')} />
      </div>

      {/* Sign Up Link */}
      <div className="text-center small">
        <span className="text-muted-foreground">{t('noAccount')} </span>
        <Link href="/signup" className="text-primary hover:underline font-medium">
          {t('signUp')}
        </Link>
      </div>
    </div>
  );
};

