import { getTranslations } from 'next-intl/server';

import { NotFoundContent } from '@/features/not-found/components';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <NotFoundContent 
      title={t('title')}
      description={t('description')}
      goHome={t('goHome')}
      goBack={t('goBack')}
    />
  );
}

