export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`
  }
  const maskedLocal = `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`
  return `${maskedLocal}@${domain}`
}
