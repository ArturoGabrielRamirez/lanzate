import { Package } from 'lucide-react'
import Image from 'next/image'

import { ProductImageProps } from '@/features/profile/types'

function ProductImage({ src, alt }: ProductImageProps) {
    return (
        <div className="relative aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    fill
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package className="w-8 h-8" />
                </div>
            )}
        </div>
    )
}

export { ProductImage }