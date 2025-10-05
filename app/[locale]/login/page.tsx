import { LoginForm, LoginImagePlaceholder } from '@/features/auth/login/components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your account',
};

function LoginPage() {
  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8 h-screen">
        <div className="grid lg:grid-cols-2 gap-8 h-full items-center">
          {/* Left Side - Login Form */}
          <div className="flex items-center justify-center">
            <LoginForm />
          </div>

          {/* Right Side - Image Placeholder */}
          <div className="hidden lg:flex items-center justify-center h-full">
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

