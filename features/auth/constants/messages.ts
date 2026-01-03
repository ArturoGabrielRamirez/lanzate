/**
 * Authentication Messages Constants
 *
 * This file contains all success and error messages used across
 * the authentication feature. Messages are structured to support
 * internationalization (i18n) with Spanish and English translations.
 *
 * These constants ensure consistent messaging across all auth flows
 * and make it easier to update messages in a single location.
 */

/**
 * Success Messages
 *
 * Messages displayed when authentication operations complete successfully
 */
export const AUTH_SUCCESS_MESSAGES = {
  SIGNUP: {
    es: 'Cuenta creada exitosamente. Bienvenido!',
    en: 'Account created successfully. Welcome!',
  },
  LOGIN: {
    es: 'Inicio de sesión exitoso. Bienvenido de vuelta!',
    en: 'Login successful. Welcome back!',
  },
  LOGOUT: {
    es: 'Sesión cerrada exitosamente',
    en: 'Logged out successfully',
  },
  PASSWORD_RESET_REQUEST: {
    es: 'Se ha enviado un enlace de restablecimiento a tu correo',
    en: 'A reset link has been sent to your email',
  },
  PASSWORD_RESET: {
    es: 'Contraseña restablecida exitosamente',
    en: 'Password reset successfully',
  },
  PROFILE_UPDATE: {
    es: 'Perfil actualizado exitosamente',
    en: 'Profile updated successfully',
  },
  EMAIL_UPDATE: {
    es: 'Correo electrónico actualizado exitosamente',
    en: 'Email updated successfully',
  },
  PASSWORD_UPDATE: {
    es: 'Contraseña actualizada exitosamente',
    en: 'Password updated successfully',
  },
} as const;

/**
 * Error Messages
 *
 * Messages displayed when authentication operations fail
 */
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: {
    es: 'Credenciales inválidas. Verifica tu email y contraseña',
    en: 'Invalid credentials. Check your email and password',
  },
  USER_ALREADY_EXISTS: {
    es: 'Ya existe una cuenta con este correo electrónico',
    en: 'An account with this email already exists',
  },
  USER_NOT_FOUND: {
    es: 'No se encontró una cuenta con este correo electrónico',
    en: 'No account found with this email',
  },
  WEAK_PASSWORD: {
    es: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
    en: 'Password must be at least 8 characters with one uppercase letter and one number',
  },
  PASSWORDS_DO_NOT_MATCH: {
    es: 'Las contraseñas no coinciden',
    en: 'Passwords do not match',
  },
  INVALID_EMAIL: {
    es: 'Por favor ingresa un correo electrónico válido',
    en: 'Please enter a valid email address',
  },
  INVALID_TOKEN: {
    es: 'El enlace de restablecimiento es inválido o ha expirado',
    en: 'The reset link is invalid or has expired',
  },
  SESSION_EXPIRED: {
    es: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente',
    en: 'Your session has expired. Please log in again',
  },
  UNAUTHORIZED: {
    es: 'No tienes autorización para realizar esta acción',
    en: 'You are not authorized to perform this action',
  },
  GENERIC_ERROR: {
    es: 'Ocurrió un error. Por favor intenta nuevamente',
    en: 'An error occurred. Please try again',
  },
  NETWORK_ERROR: {
    es: 'Error de conexión. Verifica tu conexión a internet',
    en: 'Connection error. Check your internet connection',
  },
  OAUTH_ERROR: {
    es: 'Error al iniciar sesión con Google. Por favor intenta nuevamente',
    en: 'Error signing in with Google. Please try again',
  },
  OAUTH_CANCELLED: {
    es: 'Inicio de sesión con Google cancelado',
    en: 'Google sign-in cancelled',
  },
  EMAIL_IN_USE: {
    es: 'Este correo electrónico ya está en uso',
    en: 'This email is already in use',
  },
  RATE_LIMIT_EXCEEDED: {
    es: 'Demasiados intentos. Por favor intenta más tarde',
    en: 'Too many attempts. Please try again later',
  },
} as const;

/**
 * Validation Messages
 *
 * Messages used in form validation
 * These are also defined in the Yup schemas but can be referenced here
 * for consistency across the application
 */
export const AUTH_VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: {
    es: 'El email es obligatorio',
    en: 'Email is required',
  },
  EMAIL_INVALID: {
    es: 'Email inválido',
    en: 'Invalid email',
  },
  PASSWORD_REQUIRED: {
    es: 'La contraseña es obligatoria',
    en: 'Password is required',
  },
  PASSWORD_MIN_LENGTH: {
    es: 'La contraseña debe tener al menos 8 caracteres',
    en: 'Password must be at least 8 characters',
  },
  PASSWORD_UPPERCASE: {
    es: 'Debe contener al menos una letra mayúscula',
    en: 'Must contain at least one uppercase letter',
  },
  PASSWORD_NUMBER: {
    es: 'Debe contener al menos un número',
    en: 'Must contain at least one number',
  },
  CONFIRM_PASSWORD_REQUIRED: {
    es: 'Debes confirmar la contraseña',
    en: 'You must confirm the password',
  },
  PASSWORDS_MUST_MATCH: {
    es: 'Las contraseñas no coinciden',
    en: 'Passwords do not match',
  },
} as const;

/**
 * Helper function to get message in specific language
 *
 * @param messageObj - Message object with language keys
 * @param locale - Language code ('es' or 'en')
 * @returns Translated message
 */
export function getAuthMessage(
  messageObj: { es: string; en: string },
  locale: 'es' | 'en' = 'es'
): string {
  return messageObj[locale];
}
