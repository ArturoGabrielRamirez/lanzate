import { AlertCircleIcon } from 'lucide-react'

import { AnimatedShinyButton } from '@/features/shadcn/components/animated-shiny-button'
import { Alert, AlertDescription, AlertTitle } from '@/features/shadcn/components/ui/alert'
import { Link } from '@/i18n/naviation'

function JoinWaitlistAlert() {
    return (
        <Alert className='col-span-full bg-chart-2/20 border-chart-2/50 text-chart-2'>
            <AlertCircleIcon className='text-chart-2 stroke-chart-2' />
            <AlertTitle>
                <h3 className="text-lg font-bold text-chart-2 leading-5">
                    Únete a la lista de espera
                </h3>
            </AlertTitle>
            <AlertDescription className='gap-0 flex justify-between'>
                <div>
                    <p>Lanzate esta en desarrollo aun, pero ya puedes unirte a la lista de espera.</p>
                    <p>Dejanos tu email y te notificaremos cuando el producto esté disponible.</p>
                </div>
                <AnimatedShinyButton asChild>
                    <Link href="/waitlist">
                        Únete a la lista de espera
                    </Link>
                </AnimatedShinyButton>
            </AlertDescription>
        </Alert>
    )
}

export { JoinWaitlistAlert }