import { Crop, Minimize2, Zap, ImageIcon } from 'lucide-react'

import { OptimizationOption } from '@/features/profile/components/optimization-option'
import { OptimizationOptionsListProps } from '@/features/profile/types'

function OptimizationOptionsList({
    onDecision,
    isMuchLarger,
    isLargeFile
}: OptimizationOptionsListProps) {
    return (
        <div className="grid gap-4">
            <OptimizationOption
                icon={Crop}
                iconColor="bg-primary/10 text-primary"
                title="Recortar manualmente"
                description="Elegí exactamente qué parte de la imagen usar. Te dará control total sobre el resultado final."
                badges={[{ label: 'Recomendado', variant: 'secondary' }]}
                features={['Mejor calidad', 'Control total']}
                onClick={() => onDecision('crop')}
            />

            <OptimizationOption
                icon={Minimize2}
                iconColor="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                title="Redimensionar automáticamente"
                description="Reduce el tamaño automáticamente manteniendo las proporciones originales. Proceso instantáneo."
                badges={[{ label: 'Rápido', variant: 'outline', icon: Zap }]}
                features={['Automático', 'Mantiene proporciones']}
                onClick={() => onDecision('resize')}
            />

            {!isMuchLarger && (
                <OptimizationOption
                    icon={ImageIcon}
                    iconColor="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    title="Mantener tamaño original"
                    description={`Usar la imagen tal como está. ${isLargeFile
                        ? 'Puede afectar la velocidad de carga.'
                        : 'Buena opción si la calidad es prioritaria.'
                        }`}
                    badges={
                        isLargeFile
                            ? [{ label: 'Archivo grande', variant: 'outline' }]
                            : []
                    }
                    features={['Máxima calidad', 'Sin procesamiento']}
                    onClick={() => onDecision('keep')}
                />
            )}
        </div>
    )
}

export { OptimizationOptionsList }