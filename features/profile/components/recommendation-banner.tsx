import { Info } from 'lucide-react'

import { RecommendationBannerProps } from '@/features/profile/types'

function RecommendationBanner({
  type,
  recommendedWidth,
  recommendedHeight,
  isLargeFile
}: RecommendationBannerProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
            Tamaño recomendado para {type === 'avatar' ? 'avatar' : 'banner'}
          </p>
          <p className="text-blue-700 dark:text-blue-200">
            {recommendedWidth} × {recommendedHeight} px o menor
          </p>
          {isLargeFile && (
            <p className="text-blue-700 dark:text-blue-200 mt-1">
              Los archivos más pequeños cargan más rápido y mejoran la experiencia del usuario.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export { RecommendationBanner }