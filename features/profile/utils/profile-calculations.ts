export function calculateAccountAge(createdAt: string): number {
  return Math.floor(
    (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )
}

export function getDisplayName(firstName?: string | null, lastName?: string | null, username?: string): string {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  }
  return username || 'Usuario'
}
