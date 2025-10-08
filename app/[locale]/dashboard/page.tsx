import { getTranslations } from 'next-intl/server';
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions } from '@/components/ui/empty';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';
import { DashboardTutorial } from '@/features/dashboard';

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  return (
    <div className="w-full pt-20 md:pt-24 pb-4 px-4">
      <div className="max-w-5xl mx-auto">

        {/* <DashboardTutorial /> */}
        
        <Empty>
          <EmptyIcon>
            <LayoutDashboard className="h-10 w-10 text-muted-foreground" />
          </EmptyIcon>
          <EmptyTitle>{t('title')}</EmptyTitle>
          <EmptyDescription>
            {t('description')}
          </EmptyDescription>
          <EmptyActions>
            <Button asChild>
              <Link href="/">{t('goHome')}</Link>
            </Button>
          </EmptyActions>
        </Empty>
      </div>
    </div>
  );
}


