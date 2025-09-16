import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import { PublicProfileClient } from '@/features/profile/components/public-profile-client'
import { getUserPublicProfile } from '@/features/profile/actions'

// Definimos una interfaz explícita para los parámetros de la página
interface PageParams {
  locale: string;
  username: string;
}

export async function generateMetadata(
  { params }: { params: PageParams } // Usamos la interfaz PageParams aquí
): Promise<Metadata> {
  const user = await getUserPublicProfile(params.username)

  if (!user) {
    return { title: 'Usuario no encontrado' }
  }

  const displayName =
    user.payload.first_name && user.payload.last_name
      ? `${user.payload.first_name} ${user.payload.last_name}`
      : user.payload.username

  return {
    title: `${displayName} (@${user.payload.username})`,
    description: user.payload.profile_bio || `Perfil de ${displayName}`,
    openGraph: {
      title: `${displayName} (@${user.payload.username})`,
      description: user.payload.profile_bio || `Perfil de ${displayName}`,
      images: user.payload.avatar ? [user.payload.avatar] : undefined,
    },
  }
}

export default async function PublicProfilePage(
  { params }: { params: PageParams } // Usamos la interfaz PageParams aquí también
) {
  const response = await getUserPublicProfile(params.username)

  if (!response) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <PublicProfileClient user={response.payload} />
    </div>
  )
}