import { notFound } from 'next/navigation';
import { Metadata } from 'next'; // Asegúrate de que Metadata esté correctamente importado

import { PublicProfileClient } from '@/features/profile/components/public-profile-client';
import { getUserPublicProfile } from '@/features/profile/actions'; // Asumiendo que esta acción devuelve el perfil del usuario o null

// Definimos explícitamente el tipo para los parámetros dinámicos de la ruta.
// Esto es una buena práctica para tener mayor claridad y seguridad de tipos.
interface UserProfileParams {
  locale: string;
  username: string;
}

// --- Metadatos ---
// La función generateMetadata recibe las props de la página, incluyendo `params`.
export async function generateMetadata(
  { params }: { params: UserProfileParams } // Aquí usamos nuestro tipo de parámetros definido
): Promise<Metadata> {
  const user = await getUserPublicProfile(params.username);

  if (!user) {
    // Si el usuario no existe, devolvemos metadatos genéricos.
    // En un escenario real, podrías querer devolver algo que indique que la página no se encontró.
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

// --- Componente de la Página ---
// El componente de la página también recibe las props, incluyendo `params`.
export default async function PublicProfilePage(
  { params }: { params: UserProfileParams } // Aquí también usamos nuestro tipo de parámetros definido
) {
  const response = await getUserPublicProfile(params.username);

  if (!response) {
    // Si getUserPublicProfile devuelve null o undefined, llamamos a notFound()
    // para mostrar la página 404 de Next.js.
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Pasamos el payload del usuario al componente cliente */}
      <PublicProfileClient user={response.payload} />
    </div>
  );
}