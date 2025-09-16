// app/[locale]/u/[username]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { PublicProfileClient } from '@/features/profile/components/public-profile-client';
import { getUserPublicProfile } from '@/features/profile/actions';

// Importa o define tu tipo de parámetros aquí
// Si lo definiste en otro archivo, usa: import { UserProfileParams } from '@/types';
interface UserProfileParams {
  locale: string;
  username: string;
}

// --- Generar Metadatos ---
export async function generateMetadata(
  // En Next.js 15, params es una promesa
  { params }: { params: Promise<UserProfileParams> }
): Promise<Metadata> {
  // Await params para obtener los valores
  const resolvedParams = await params;
  const user = await getUserPublicProfile(resolvedParams.username);

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

// --- Componente Principal de la Página ---
export default async function PublicProfilePage(
  // En Next.js 15, params es una promesa
  { params }: { params: Promise<UserProfileParams> }
) {
  // Await params para obtener los valores
  const resolvedParams = await params;
  const response = await getUserPublicProfile(resolvedParams.username);

  if (!response) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <PublicProfileClient user={response.payload} />
    </div>
  );
}