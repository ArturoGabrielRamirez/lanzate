'use client';

import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { AuthProviders } from '@/features/auth/shared/components';
import { signUpAction } from '@/features/auth/signup/actions';
import { getSignupValidationSchema } from '@/features/auth/signup/schemas';
import type { SignUpFormData } from '@/features/auth/signup/types';
import { DynamicForm, FormField } from '@/features/global/components';

export const SignupForm = () => {
  const t = useTranslations('auth.signup');
  const router = useRouter();

  const validationSchema = getSignupValidationSchema((key) => t(key));

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

  const handleSubmit = async (data: SignUpFormData) => {
    const { hasError, message } = await signUpAction({ email: data.email, password: data.password });
    if (hasError) {
      toast.error(t('toastError'));
      return;
    }
    toast.success(t('toastSuccess'));
    const url = `/check-email?email=${encodeURIComponent(data.email)}&type=signup`;
    router.push(url);
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

