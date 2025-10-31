import { Zap } from 'lucide-react'

import { ChallengeCard } from '@/features/profile/components/challenge-card'
import { ChallengesSectionProps } from '@/features/profile/types'
import { Card, CardContent, CardHeader } from '@/features/shadcn/components/ui/card'

function ChallengesSection({ challenges }: ChallengesSectionProps) {
    if (challenges.length === 0) return null

    return (
        <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Retos Activos
                </h3>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
                {challenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
            </CardContent>
        </Card>
    )
}

export { ChallengesSection }