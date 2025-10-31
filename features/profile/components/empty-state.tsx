import { Heart } from 'lucide-react'

import { EmptyStateProps } from '@/features/profile/types'
import { Card, CardContent } from '@/features/shadcn/components/ui/card'

function EmptyState({
    icon: Icon = Heart,
    title,
    description
}: EmptyStateProps) {
    return (
        <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
                <Icon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium mb-1">{title}</p>
                <p className="text-sm">{description}</p>
            </CardContent>
        </Card>
    )
}

export { EmptyState }