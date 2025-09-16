// Importa los tipos necesarios de Next.js
import type { Metadata } from 'next';
// Importa PageProps y Params desde los tipos correctos de Next.js
// En versiones más recientes de Next.js, a menudo se usa el tipo genérico `PropsWithChildren`
// o simplemente se definen las props directamente si no se necesita `PageProps` explícitamente.
// Sin embargo, para resolver este error específico de `PageProps`, vamos a asegurarnos de que las `params` se definan correctamente.
import { notFound } from 'next/navigation';
import { getUserPublicProfile } from '@/features/profile/actions';
import { PublicProfileClient } from '@/features/profile/components/public-profile-client';

// Define los tipos para los parámetros de tu ruta dinámica
interface UserProfileParams {
  locale: string;
  username: string;
}

// Define las props para tu página, asegurándote de que `params` tenga el tipo correcto
interface PublicProfilePageProps {
  params: UserProfileParams;
}

// --- Función generateMetadata ---
export async function generateMetadata(
  { params }: PublicProfilePageProps // Usa el tipo definido para las props de la página
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

// --- Componente de Página Principal ---
export default async function PublicProfilePage(
  { params }: PublicProfilePageProps // Usa el tipo definido para las props de la página
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