/* 'use server'

import { actionWrapper, formatSuccessResponse } from "@/utils/lib"
import { countUserFollowers } from "../data/count-user-followers"
import { countUserFollowing } from "../data/count-user-following"

export async function getUserFollowStats(userId: number) {
    return actionWrapper(async () => {
        const [followersCount, followingCount] = await Promise.all([
            countUserFollowers(userId),
            countUserFollowing(userId)
        ])

        return formatSuccessResponse("Estadísticas obtenidas", {
            followers: followersCount,
            following: followingCount
        })
    })
}
 */