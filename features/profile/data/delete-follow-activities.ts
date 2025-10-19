/* import { prisma } from "@/utils/prisma" */

// PARCHE TEMPORAL: Elimina actividades de seguimiento usando tipo temporal
/* export async function deleteFollowActivities(
    currentUserId: number,
    targetUserId: number,
    targetUsername: string
) {
    return prisma.socialActivity.deleteMany({
        where: {
            user_id: currentUserId,
            activity_type: 'USER_LOGIN', // Tipo temporal que estamos usando para follows
            entity_type: 'USER',
            entity_id: targetUserId,
            title: {
                contains: `Siguió a @${targetUsername}`
            }
        }
    })
}
 */
// TODO: Cuando actualices la tabla SocialActivity, reemplaza la función de arriba con esta:
/*
export async function deleteFollowActivities(
  currentUserId: number, 
  targetUserId: number
) {
  return prisma.socialActivity.deleteMany({
    where: {
      user_id: currentUserId,
      activity_type: 'USER_FOLLOW', // Tipo correcto cuando esté disponible
      entity_type: 'USER',
      entity_id: targetUserId
    }
  })
}
*/