import { Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ProductBadgesProps } from '../types'

export function ProductBadges({ isActive }: ProductBadgesProps) {
    return (
        <>
            <div className="absolute top-2 right-2">
                <div className="bg-red-500 text-white p-1.5 rounded-full">
                    <Heart className="w-3 h-3 fill-current" />
                </div>
            </div>

            {!isActive && (
                <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                        No disponible
                    </Badge>
                </div>
            )}
        </>
    )
}
