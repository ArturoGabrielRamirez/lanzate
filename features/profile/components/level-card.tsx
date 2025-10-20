import { Badge } from '@/features/shadcn/components/ui/badge'
import { Card, CardContent } from '@/features/shadcn/components/ui/card'
import { Progress } from '@/features/shadcn/components/ui/progress'
import { LevelCardProps } from '../types'

export function LevelCard({ level, points, progressData }: LevelCardProps) {
    const LevelIcon = level.icon

    return (
        <Card className={`bg-gradient-to-r ${level.bgColor} border ${level.borderColor} backdrop-blur-sm`}>
            <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gray-800/50">
                        <LevelIcon className={`w-4 h-4 ${level.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white truncate">{level.name}</h3>
                        <p className="text-xs text-gray-300">{points.toLocaleString()} pts</p>
                    </div>
                    <Badge variant="secondary" className={`${level.color} bg-gray-800/30 text-xs`}>
                        Nv.{level.level}
                    </Badge>
                </div>

                {progressData.pointsNeeded > 0 && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-200 truncate">{progressData.nextLevelName}</span>
                            <span className={level.color}>{progressData.progress}%</span>
                        </div>
                        <Progress value={progressData.progress} className="h-2" />
                        <p className="text-xs text-gray-300 text-center">
                            {progressData.pointsNeeded} pts restantes
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}