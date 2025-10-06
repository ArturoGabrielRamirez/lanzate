import { SignupForm, SignupImagePlaceholder } from '@/features/auth/signup/components';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your account',
};

async function SignupPage() {
  const t = await getTranslations('auth.signup');

  return (
    <div className="w-full pt-20 md:pt-24 pb-4">
      <div className="container mx-auto px-4">
        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Signup Form */}
          <div className="flex flex-col gap-8">
            <div className="typography">
              <h2 className="border-b-0">{t('title')}</h2>
              <p className="muted">{t('subtitle')}</p>
            </div>
            <div className="w-full max-w-md">
              <SignupForm />
            </div>
          </div>

          {/* Right Side - Image Placeholder */}
          <div className="hidden lg:flex items-center justify-center min-h-[600px]">
            <div className="w-full h-[600px]">
              <SignupImagePlaceholder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

