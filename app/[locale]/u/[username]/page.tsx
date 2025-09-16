// app/[locale]/u/[username]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { PublicProfileClient } from '@/features/profile/components/public-profile-client';
import { getUserPublicProfile } from '@/features/profile/actions';

// Importa PageProps y Params para una correcta tipificación en Next.js 13+ (App Router)
/* import { PageProps } from 'next/dist/build/types';  */// O desde 'next' si está disponible en tu versión

// Define un tipo específico para los parámetros de tu ruta
interface UserProfileParams {
  locale: string;
  username: string;
}

// Asegúrate de que PageProps extienda o use tu UserProfileParams
// En el App Router, los params se pasan directamente.
// La tipificación correcta para la metadata y la página es:
export async function generateMetadata(
  { params }: { params: UserProfileParams } // Usa tu tipo específico aquí
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

export default async function PublicProfilePage(
  { params }: { params: UserProfileParams } // Usa tu tipo específico aquí
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