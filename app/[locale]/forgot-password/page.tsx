import { ForgotPasswordForm, ForgotPasswordImagePlaceholder } from '@/features/auth/forgot-password/components';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Recover access to your account',
};

export default async function ForgotPasswordPage() {
  const t = await getTranslations('auth.forgot');

  return (
    <div className="w-full pt-20 md:pt-24 pb-4 flex items-center justify-center min-h-dvh">
      <div className="container mx-auto px-4">
        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Form */}
          <div className="flex flex-col gap-8">
            <div className="typography">
              <h2 className="border-b-0">{t('title')}</h2>
              <p className="muted">{t('subtitle')}</p>
            </div>
            <div className="w-full max-w-md">
              <ForgotPasswordForm />
            </div>
          </div>

          {/* Right Side - Image Placeholder */}
          <div className="hidden lg:flex items-center justify-center min-h-[600px]">
            <div className="w-full h-[600px]">
              <ForgotPasswordImagePlaceholder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


