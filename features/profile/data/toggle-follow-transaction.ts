/* import { prisma } from "@/utils/prisma"

export async function toggleFollowTransaction(
    followerId: number,
    followingId: number,
    shouldFollow: boolean,
    displayName: string,
    username: string,
    showActivity: boolean
) {
    return prisma.$transaction(async (tx) => {
        if (shouldFollow) {
            // Crear follow
            await tx.userFollow.create({
                data: {
                    follower_id: followerId,
                    following_id: followingId
                }
            })

            // Actividad solo si está habilitado
            if (showActivity) {
                await tx.socialActivity.create({
                    data: {
                        user_id: followerId,
                        activity_type: 'USER_LOGIN',
                        entity_type: 'USER',
                        entity_id: followingId,
                        title: `Comenzó a seguir a ${displayName}`, // ✅ Patrón único para follow
                        description: `Ahora sigue a @${username}`,
                        metadata: JSON.stringify({
                            action: 'follow', // ✅ Metadato para diferenciar de registro
                            followedUser: {
                                id: followingId,
                                username,
                                displayName
                            }
                        }),
                        is_public: true,
                        is_featured: false
                    }
                })
            }
        } else {
            // Eliminar follow
            await tx.userFollow.deleteMany({
                where: {
                    follower_id: followerId,
                    following_id: followingId
                }
            })

            // 🔥 CRÍTICO: Eliminar SOLO actividad de follow específica
            await tx.socialActivity.deleteMany({
                where: {
                    user_id: followerId,
                    activity_type: 'USER_LOGIN',
                    entity_type: 'USER',
                    entity_id: followingId,
                    title: {
                        contains: 'Comenzó a seguir a'
                    },
                    // 🛡️ PROTECCIÓN: El registro tiene entity_id = user_id
                    // El follow tiene entity_id = following_id (diferente)
                    NOT: {
                        entity_id: followerId
                    }
                }
            })
        }
    })
} */