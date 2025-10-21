import { WarningBannerProps } from '@/features/profile/types'

function WarningBanner({ isMuchLarger }: WarningBannerProps) {
    if (!isMuchLarger) return null

    return (
        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-sm">
            <p className="text-yellow-800 dark:text-yellow-200">
                <strong>Nota:</strong> Tu imagen es considerablemente más grande que lo recomendado.
                Te sugerimos recortar o redimensionar para obtener el mejor rendimiento.
            </p>
        </div>
    )
}

export { WarningBanner }