import { useMemo } from 'react'

import { calculatePoints } from '@/features/profile/utils/calculate-points'
import { generateChallenges } from '@/features/profile/utils/generate-challenges'
import { getProgressToNextLevel } from '@/features/profile/utils/get-progress-to-next-level'
import { getUserLevel } from '@/features/profile/utils/get-user-level'

export function useUserStats(
    followersCount: number,
    followingCount: number,
    likesCount: number,
    accountAge: number,
    isOwnProfile: boolean,
    userType: 'customer' | 'admin' | 'store' = 'customer'
) {
    const calculatedPoints = useMemo(() =>
        calculatePoints(followersCount, likesCount, accountAge),
        [followersCount, likesCount, accountAge]
    )

    const currentLevel = useMemo(() =>
        getUserLevel(calculatedPoints, userType === 'admin' ? 'store' : userType),
        [calculatedPoints, userType]
    )

    const progressData = useMemo(() =>
        getProgressToNextLevel(calculatedPoints, userType === 'admin' ? 'store' : userType),
        [calculatedPoints, userType]
    )

    const challenges = useMemo(() =>
        generateChallenges(followersCount, followingCount, likesCount, isOwnProfile),
        [followersCount, followingCount, likesCount, isOwnProfile]
    )

    return {
        calculatedPoints,
        currentLevel,
        progressData,
        challenges
    }
}
