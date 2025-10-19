"use client"

import { memo } from 'react'
import { CommunityStatsProps } from '../types'
import { useUserStats } from '../hooks/use-user-stats'
import { LevelCard } from './level-card'
import { StatsGrid } from './stats-grid'
import { ChallengesSection } from './challenges-section'
import { PointsTips } from './points-tips'

export const CommunityStatsCard = memo(({
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