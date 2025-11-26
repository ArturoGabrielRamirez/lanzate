import Image from 'next/image'

import { InitialPreviewProps } from '@/features/global/types/media'
import { Alert, AlertDescription } from '@/features/shadcn/components/ui/alert'

export function InitialPreview({ originalUrl }: InitialPreviewProps) {
    return (
        <div className="space-y-3">
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
                {originalUrl && (
                    <Image
                        src={originalUrl}
                        alt="Original"
                        className="w-full h-full object-contain"
                        fill
                    />
                )}
            </div>
            <Alert>
                <AlertDescription className="text-sm">
                    💡 <strong>Tip:</strong> Funciona mejor con fotos donde el sujeto u objeto está bien definido.
                    El procesamiento puede tomar 10-30 segundos.
                </AlertDescription>
            </Alert>
        </div>
    )
}