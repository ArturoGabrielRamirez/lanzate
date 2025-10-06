import { getTranslations } from 'next-intl/server';
import { CheckEmailActions, CheckEmailVisual } from '@/features/auth/check-email/components';

type CheckEmailPageProps = {
  searchParams: Promise<{ email?: string; type?: string }>
}

export default async function CheckEmailPage({ searchParams }: CheckEmailPageProps) {
  const t = await getTranslations('auth.checkEmail');
  const params = await searchParams;
  const email = params.email || '';
  const type = params.type || 'signup';

  return (
    <div className="w-full pt-20 md:pt-24 pb-4 flex items-center justify-center min-h-dvh">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-8">
            <div className="typography">
              <h2>{t('title')}</h2>
              <p className="muted">
                {type === 'recovery' ? t('subtitleRecovery') : t('subtitleGeneric')}
              </p>
              {email ? (
                <p>
                  {t('sentTo')} <strong>{email}</strong>
                </p>
              ) : null}
              <p className="small text-muted-foreground">{t('tipSpam')}</p>
            </div>

            <CheckEmailActions email={email} type={type} />
          </div>

          <div className="hidden lg:flex items-center justify-center min-h-[400px]">
            <CheckEmailVisual />
          </div>
        </div>
      </div>
    </div>
  );
}


