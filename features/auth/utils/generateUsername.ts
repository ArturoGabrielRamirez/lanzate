/**
 * Generate Username Utility
 *
 * Extracts the username from an email address by taking
 * the part before the @ symbol.
 *
 * @param email - The email address to extract username from
 * @returns The username (email prefix before @)
 *
 * @example
 * generateUsername('john.doe@example.com') // returns 'john.doe'
 * generateUsername('user+tag@domain.com') // returns 'user+tag'
 */
export function generateUsername(email: string): string {
  const username = email.split('@')[0];

  if (!username) {
    throw new Error('Invalid email format: unable to extract username');
  }

  return username;
}
