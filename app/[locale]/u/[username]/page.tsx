import { Metadata } from 'next'

import { getProfileWithFollowStatusAction } from '@/features/profile/actions/get-profile-with-follow.action';
import { UserNotFound } from '@/features/profile/components/not-found'
import { PublicProfileClient } from '@/features/profile/components/public-profile-client'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; username: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const result = await getProfileWithFollowStatusAction(resolvedParams.username)

  if (!result?.payload?.user) {
    return {
      title: 'Usuario no encontrado',
      description: 'El perfil que buscas no existe'
    }
  }

  const { user } = result.payload
  const displayName = user.first_name && user.last_name
    ? `${user.first_name} ${user.last_name}`
    : user.username

  return {
    title: `${displayName} (@${user.username})`,
    description: user.profile_bio || `Perfil de ${displayName}`,
    openGraph: {
      title: `${displayName} (@${user.username})`,
      description: user.profile_bio || `Perfil de ${displayName}`,
      images: user.avatar ? [user.avatar] : undefined,
    },
  }
}

export default async function PublicProfilePage(
  { params }: { params: Promise<{ locale: string; username: string }> }
) {
  const resolvedParams = await params

  // ✅ SINGLE QUERY: Obtiene user + currentUser + isFollowing
  const result = await getProfileWithFollowStatusAction(resolvedParams.username)

  if (!result?.payload?.user) {
    return <UserNotFound />
  }

  const { user, currentUser, isFollowing } = result.payload

  return (
    <div className="min-h-screen">
      <PublicProfileClient
        user={user}
        initialCurrentUser={currentUser}
        initialIsFollowing={isFollowing} // ✅ Estado inicial desde servidor
      />
    </div>
  )
}