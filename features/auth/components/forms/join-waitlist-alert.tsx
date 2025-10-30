import { AlertCircleIcon } from 'lucide-react'

import { JoinWaitlist } from '@/features/auth/components'
import { Alert, AlertDescription, AlertTitle } from '@/features/shadcn/components/ui/alert'

function JoinWaitlistAlert() {
    return (
        <Alert className='sticky top-[70px] md:top-24 col-span-full z-20 max-w-2xl mx-auto mb-10 md:mb-0'>
            <AlertCircleIcon />
            <AlertTitle>
                <h3 className="text-lg font-bold">
                    Únete a la lista de espera
                </h3>
            </AlertTitle>
            <AlertDescription className='gap-0'>
                <p>Lanzate esta en desarrollo aun, pero ya puedes unirte a la lista de espera.</p>
                <p>Dejanos tu email y te notificaremos cuando el producto esté disponible.</p>
            </AlertDescription>
            <JoinWaitlist />
        </Alert>
    )
}

export { JoinWaitlistAlert }