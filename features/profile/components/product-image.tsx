import { Package } from 'lucide-react'
import { ProductImageProps } from '../types'

export function ProductImage({ src, alt }: ProductImageProps) {
    return (
        <div className="relative aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package className="w-8 h-8" />
                </div>
            )}
        </div>
    )
}