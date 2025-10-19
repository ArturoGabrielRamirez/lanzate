import { useMemo } from 'react'
import { calculatePoints, generateChallenges, getProgressToNextLevel, getUserLevel } from '../utils/points-system-utils'

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
