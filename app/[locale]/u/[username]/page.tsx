// Importaciones necesarias
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Asumiendo que estas acciones y componentes están definidos correctamente
import { PublicProfileClient } from '@/features/profile/components/public-profile-client';
import { getUserPublicProfile } from '@/features/profile/actions';

// Definición del tipo para los parámetros de la ruta
// Es un objeto simple, no una promesa
interface UserProfileParams {
  locale: string;
  username: string;
}

// Definición de las props para la página, incluyendo los parámetros
interface PublicProfilePageProps {
  params: UserProfileParams;
}

// Función para generar metadatos
// Recibe las props con los parámetros de la ruta
export async function generateMetadata(
  { params }: PublicProfilePageProps // Usamos el tipo definido
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

// Componente principal de la página de perfil público
// Recibe las props con los parámetros de la ruta
export default async function PublicProfilePage(
  { params }: PublicProfilePageProps // Usamos el tipo definido
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