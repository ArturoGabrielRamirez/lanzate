import { Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function PointsTips() {
    return (
        <Card className="bg-gray-800/30 border-gray-700/30 backdrop-blur-sm">
            <CardContent className="p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Cómo Ganar Puntos
                </h4>
                <div className="space-y-2 text-xs text-gray-400">
                    <p>• Seguidores: +5 pts cada uno</p>
                    <p>• Likes recibidos: +2 pts cada uno</p>
                    <p>• Actividad diaria: +1 pt por día</p>
                    <p>• Bonus 10+ seguidores: +50 pts</p>
                </div>
            </CardContent>
        </Card>
    )
}