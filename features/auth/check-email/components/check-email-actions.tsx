'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { CheckEmailActionsProps } from '@/features/auth/check-email/types';
import { resetPasswordAction } from '@/features/auth/forgot-password/actions';
import { AsyncButton } from '@/features/global/components';

export const CheckEmailActions = ({ email }: CheckEmailActionsProps) => {
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
    <div className="not-typography space-y-3 grid grid-cols-2 gap-3">
      <AsyncButton className="w-full" size="lg" onClickAsync={handleResend} disabled={!email} loadingText={t('resendLoading')}>
        {t('resendButton')}
      </AsyncButton>
      <Button asChild variant="outline" className="w-full" size="lg">
        <Link href="/login">{t('backToLogin')}</Link>
      </Button>
    </div>
  );
};


