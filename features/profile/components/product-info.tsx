import { Store } from 'lucide-react'
import { formatRelativeTime } from '../utils/date-utils'
import { ProductInfoProps } from '../types'

export function ProductInfo({
    name,
    description,
    price,
    storeName,
    likedAt
}: ProductInfoProps) {
    return (
        <div className="space-y-2">
            <h4 className="font-medium text-sm leading-tight line-clamp-2">
                {name}
            </h4>

            {description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {description}
                </p>
            )}

            <div className="flex items-center justify-between">
                <span className="font-bold text-sm">
                    ${price.toLocaleString()}
                </span>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Store className="w-3 h-3" />
                    <span className="truncate max-w-20">
                        {storeName}
                    </span>
                </div>
            </div>

            <div className="text-xs text-muted-foreground">
                Le gustó {formatRelativeTime(likedAt)}
            </div>
        </div>
    )
}