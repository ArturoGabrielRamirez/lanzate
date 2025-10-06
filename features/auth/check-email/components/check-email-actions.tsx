'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { resetPasswordAction } from '@/features/auth/forgot-password/actions/reset-password.action';

interface CheckEmailActionsProps {
  email?: string;
  type?: string;
}

export const CheckEmailActions = ({ email, type }: CheckEmailActionsProps) => {
  const t = useTranslations('auth.checkEmail');

  const handleResend = async () => {
    if (!email) return;
    const res = await resetPasswordAction(email);
    if (res.hasError) {
      toast.error(t('resendError'));
      return;
    }
    toast.success(t('resendSuccess'));
  };

  return (
    <div className="not-typography space-y-3">
      <Button className="w-full" size="lg" onClick={handleResend} disabled={!email}>
        {t('resendButton')}
      </Button>
      <Button asChild variant="outline" className="w-full" size="lg">
        <Link href="/login">{t('backToLogin')}</Link>
      </Button>
    </div>
  );
};


