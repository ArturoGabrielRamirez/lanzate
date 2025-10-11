import { getTranslations } from 'next-intl/server';

import { LoginForm, LoginImagePlaceholder } from '@/features/auth/login/components';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your account',
};

async function LoginPage() {
  const t = await getTranslations('auth.login');

  return (
    <div className="w-full min-h-dvh pt-20 md:pt-24 pb-4 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-8">
            <div className="typography mb-8 text-center md:text-left">
              <h2 className="border-b-0">{t('title')}</h2>
              <p className="muted mt-0">{t('subtitle')}</p>
            </div>
            <LoginForm />
          </div>
          <div className="hidden lg:flex items-center justify-center min-h-[600px]">
            <div className="w-full h-[600px]">
              <LoginImagePlaceholder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

