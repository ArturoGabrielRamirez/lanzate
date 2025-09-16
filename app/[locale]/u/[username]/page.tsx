import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { PublicProfileClient } from '@/features/profile/components/public-profile-client';
import { getUserPublicProfile } from '@/features/profile/actions';

// Define explícitamente los tipos para los parámetros de tu ruta
interface PageParams {
  locale: string;
  username: string;
}

// Para generateMetadata, pasa los params con el tipo definido
export async function generateMetadata(
  { params }: { params: PageParams } // Usa el tipo PageParams aquí
): Promise<Metadata> {
  const user = await getUserPublicProfile(params.username);

  if (!user) {
    return { title: 'Usuario no encontrado' };
  }

  const displayName =
    user.payload.first_name && user.payload.last_name
      ? `${user.payload.first_name} ${user.payload.last_name}`
      : user.payload.username;

  return {
    title: `${displayName} (@${user.payload.username})`,
    description: user.payload.profile_bio || `Perfil de ${displayName}`,
    openGraph: {
      title: `${displayName} (@${user.payload.username})`,
      description: user.payload.profile_bio || `Perfil de ${displayName}`,
      images: user.payload.avatar ? [user.payload.avatar] : undefined,
    },
  };
}

// Para el componente de página principal, también usa el tipo PageParams
export default async function PublicProfilePage(
  { params }: { params: PageParams } // Usa el tipo PageParams aquí
) {
  const response = await getUserPublicProfile(params.username);

  if (!response) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <PublicProfileClient user={response.payload} />
    </div>
  );
}