'use client';

import { useTranslations } from 'next-intl';
import { DynamicForm, FormField } from '@/features/global/components';
import { getSignupValidationSchema } from '@/features/auth/signup/schemas';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { AuthProviders } from '@/features/auth/shared/components';

export const SignupForm = () => {
  const t = useTranslations('auth.signup');

  // Validation schema
  const validationSchema = getSignupValidationSchema((key) => t(key));

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
    {
      name: 'confirmPassword',
      label: t('confirmPasswordLabel'),
      type: 'password',
      placeholder: t('confirmPasswordPlaceholder'),
      leftIcon: <Lock className="h-4 w-4" />,
      required: true,
      tooltip: t('confirmPasswordTooltip'),
    },
  ];

  // Handle form submission
  const handleSubmit = async (data: any) => {
    // Simulate a 1 second delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Signup data:', data);
    // TODO: Implement signup logic
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

        <AuthProviders label={t('orContinueWith')} />
      </div>

      {/* Login Link */}
      <div className="text-center small">
        <span className="text-muted-foreground">{t('hasAccount')} </span>
        <Link href="/login" className="text-primary hover:underline font-medium">
          {t('signIn')}
        </Link>
      </div>
    </div>
  );
};

