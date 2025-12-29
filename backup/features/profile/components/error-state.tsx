import { Heart } from 'lucide-react'

import { ErrorStateProps } from '@/features/profile/types'
import { Card, CardContent } from '@/features/shadcn/components/ui/card'

function ErrorState({ message }: ErrorStateProps) {
    return (
        <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium mb-1">Error al cargar los productos</p>
                <p className="text-sm">{message}</p>
            </CardContent>
        </Card>
    )
}

export { ErrorState }