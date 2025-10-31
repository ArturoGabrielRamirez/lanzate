"use client"

import { memo } from 'react'

import { ChallengesSection } from '@/features/profile/components/challenges-section'
import { LevelCard } from '@/features/profile/components/level-card'
import { PointsTips } from '@/features/profile/components/points-tips'
import { StatsGrid } from '@/features/profile/components/stats-grid'
import { useUserStats } from '@/features/profile/hooks/use-user-stats'
import { CommunityStatsProps } from '@/features/profile/types'

const CommunityStatsCard = memo(({
  followersCount,
  followingCount,
  likesCount,
  accountAge,
  isOwnProfile,
  userType = 'customer'
}: CommunityStatsProps) => {

  const { calculatedPoints, currentLevel, progressData, challenges } = useUserStats(
    followersCount,
    followingCount,
    likesCount,
    accountAge,
    isOwnProfile,
    userType
  )

  return (
    <div className="space-y-3">
      <LevelCard
        level={currentLevel}
        points={calculatedPoints}
        progressData={progressData}
      />

      <StatsGrid
        followersCount={followersCount}
        followingCount={followingCount}
        likesCount={likesCount}
        accountAge={accountAge}
      />

      {isOwnProfile && (
        <>
          <ChallengesSection challenges={challenges} />
          <PointsTips />
        </>
      )}
    </div>
  )
})

CommunityStatsCard.displayName = 'CommunityStatsCard'

export { CommunityStatsCard }