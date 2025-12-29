import { AlertCircleIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { AnimatedShinyButton } from '@/features/shadcn/components/animated-shiny-button'
import { Alert, AlertDescription, AlertTitle } from '@/features/shadcn/components/ui/alert'
import { Link } from '@/i18n/naviation'

async function JoinWaitlistAlert() {
    const t = await getTranslations("auth.waitlist.alert")
    
    return (
        <Alert className='col-span-full bg-chart-2/20 border-chart-2/50 text-chart-2'>
            <AlertCircleIcon className='text-chart-2 stroke-chart-2' />
            <AlertTitle>
                <h3 className="text-lg font-bold text-chart-2 leading-5">
                    {t('title')}
                </h3>
            </AlertTitle>
            <AlertDescription className='gap-2 flex justify-between'>
                <div>
                    <p>{t('description1')}</p>
                    <p className='hidden md:block'>{t('description2')}</p>
                </div>
                <AnimatedShinyButton asChild className='shrink-0 self-end'>
                    <Link href="/waitlist">
                        {t('button')}
                    </Link>
                </AnimatedShinyButton>
            </AlertDescription>
        </Alert>
    )
}

export { JoinWaitlistAlert }