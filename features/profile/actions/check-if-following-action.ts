/* 'use server'

import { actionWrapper, formatSuccessResponse } from "@/utils/lib"
import { resolveUserId } from "../utils/user-utils"
import { findUserFollow } from "../data/find-user-follow"

export async function checkIfFollowing(
    currentUserId: number | string,
    targetUserId: number
) {
    return actionWrapper(async () => {
        const resolvedCurrentUserId = await resolveUserId(currentUserId)

        if (!resolvedCurrentUserId) {
            return formatSuccessResponse("Usuario no autenticado", {
                isFollowing: false
            })
        }

        const follow = await findUserFollow(resolvedCurrentUserId, targetUserId)

        return formatSuccessResponse("Estado verificado", {
            isFollowing: !!follow
        })
    })
}
 */