import { Users, Heart, UserCheck, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/features/shadcn/components/ui/card'
import { StatItem } from './stats-item'
import { StatsGridProps } from '../types'

export function StatsGrid({
    followersCount,
    followingCount,
    likesCount,
    accountAge
}: StatsGridProps) {
    return (
        <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-4 space-y-3">
                <StatItem
                    icon={Users}
                    label="Seguidores"
                    value={followersCount}
                    color="text-orange-400"
                    bgColor="bg-orange-500/20"
                    maxValue={followersCount + 5}
                />

                <StatItem
                    icon={UserCheck}
                    label="Siguiendo"
                    value={followingCount}
                    color="text-blue-400"
                    bgColor="bg-blue-500/20"
                    maxValue={followingCount + 3}
                />

                <StatItem
                    icon={Heart}
                    label="Me gusta"
                    value={likesCount}
                    color="text-pink-400"
                    bgColor="bg-pink-500/20"
                    maxValue={likesCount + 5}
                />

                <StatItem
                    icon={Calendar}
                    label="Días activo"
                    value={accountAge}
                    color="text-purple-400"
                    bgColor="bg-purple-500/20"
                    showProgress={false}
                />
            </CardContent>
        </Card>
    )
}