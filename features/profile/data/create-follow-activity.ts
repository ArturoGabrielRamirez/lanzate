/* import { prisma } from "@/utils/prisma"

type CreateFollowActivityParams = {
    userId: number
    targetUserId: number
    targetUsername: string
    targetFirstName: string | null
}
 */
// PARCHE TEMPORAL: Crea actividad social básica
/* export async function createFollowActivity({
    userId,
    targetUserId,
    targetUsername,
    targetFirstName
}: CreateFollowActivityParams) {
    return prisma.socialActivity.create({
        data: {
            user_id: userId,
            activity_type: 'USER_LOGIN', // Tipo temporal - cambiar después
            entity_type: 'USER',
            entity_id: targetUserId,
            title: `Siguió a @${targetUsername}`,
            description: `Comenzó a seguir a ${targetFirstName || targetUsername}`,
            is_public: true,
            created_at: new Date()
        }
    })
}
 */
// TODO: Cuando actualices la tabla SocialActivity, reemplaza la función de arriba con esta:
/*
export async function createFollowActivity({
  userId,
  targetUserId,
  targetUsername,
  targetFirstName
}: CreateFollowActivityParams) {
  return prisma.socialActivity.create({
    data: {
      user_id: userId,
      activity_type: 'USER_FOLLOW', // Agregar este enum a Prisma schema
      entity_type: 'USER',
      entity_id: targetUserId,
      title: `Siguió a @${targetUsername}`,
      description: `Ahora sigue a ${targetFirstName || targetUsername}`,
      is_public: true,
      metadata: JSON.stringify({
        action: 'follow',
        targetUsername: targetUsername,
        targetDisplayName: targetFirstName || targetUsername,
        timestamp: new Date().toISOString()
      })
    }
  })
}
*/
