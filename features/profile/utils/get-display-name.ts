/**
 * Obtiene el nombre de visualización del usuario
 * @param firstName - Nombre
 * @param lastName - Apellido
 * @param username - Nombre de usuario
 * @returns Nombre completo o username como fallback
 */
export function getDisplayName(
  firstName?: string | null,
  lastName?: string | null,
  username?: string
): string {
  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(' ')
  }
  return username || 'Usuario'
}
