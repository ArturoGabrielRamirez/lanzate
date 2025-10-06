import { getTranslations } from 'next-intl/server';

type CheckEmailPageProps = {
  searchParams: Promise<{ email?: string; type?: string }>
}

export default async function CheckEmailPage({ searchParams }: CheckEmailPageProps) {
  const t = await getTranslations('auth.checkEmail');
  const params = await searchParams;
  const email = params.email || '';
  const type = params.type || 'signup';

  return (
    <div className="w-full pt-20 md:pt-24 pb-4">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
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
        </div>
      </div>
    </div>
  );
}


