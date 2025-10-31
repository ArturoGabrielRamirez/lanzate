import { ChallengeCardProps } from '@/features/profile/types'
import { Badge } from '@/features/shadcn/components/ui/badge'
import { Progress } from '@/features/shadcn/components/ui/progress'

function ChallengeCard({ challenge }: ChallengeCardProps) {
    const ChallengeIcon = challenge.icon
    const progressPercent = (challenge.progress / challenge.max) * 100

    return (
        <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
                <ChallengeIcon className={`w-4 h-4 ${challenge.color}`} />
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{challenge.title}</h4>
                    <p className="text-xs text-gray-400 truncate">{challenge.description}</p>
                </div>
                <Badge variant="outline" className="text-xs text-amber-400 border-amber-400/30">
                    {challenge.reward}
                </Badge>
            </div>

            <div className="flex items-center gap-2 text-xs">
                <Progress value={progressPercent} className="flex-1 h-1.5" />
                <span className="text-gray-400 text-xs min-w-fit">
                    {challenge.progress}/{challenge.max}
                </span>
            </div>
        </div>
    )
}

export { ChallengeCard }