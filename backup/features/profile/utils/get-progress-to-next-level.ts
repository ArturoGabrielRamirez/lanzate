import { CUSTOMER_LEVELS, STORE_LEVELS } from '@/features/profile/constants'
import { getUserLevel } from '@/features/profile/utils/get-user-level'

export const getProgressToNextLevel = (points: number, userType: 'customer' | 'store') => {
    const levels = userType === 'store' ? STORE_LEVELS : CUSTOMER_LEVELS
    const currentLevel = getUserLevel(points, userType)
    const nextLevel = levels.find(level => level.level === currentLevel.level + 1)

    if (!nextLevel) {
        return { progress: 100, pointsNeeded: 0, nextLevelName: 'Nivel máximo' }
    }

    const pointsInCurrentLevel = points - currentLevel.minPoints
    const pointsNeededForNextLevel = nextLevel.minPoints - currentLevel.minPoints
    const progress = Math.min((pointsInCurrentLevel / pointsNeededForNextLevel) * 100, 100)
    const pointsNeeded = nextLevel.minPoints - points

    return {
        progress: Math.round(progress),
        pointsNeeded: Math.max(pointsNeeded, 0),
        nextLevelName: nextLevel.name
    }
}
