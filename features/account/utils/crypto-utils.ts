import { createHash, randomBytes, pbkdf2, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const pbkdf2Async = promisify(pbkdf2);

export class CryptoUtils {
  /**
   * Hash de contraseña usando PBKDF2 (similar a bcrypt)
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(32).toString('hex');
    const hash = await pbkdf2Async(password, salt, 10000, 64, 'sha512');
    return `${salt}:${hash.toString('hex')}`;
  }

  /**
   * Verificar contraseña
   */
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const [salt, hash] = hashedPassword.split(':');
      const hashToCompare = await pbkdf2Async(password, salt, 10000, 64, 'sha512');
      return timingSafeEqual(Buffer.from(hash, 'hex'), hashToCompare);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  /**
   * ✅ MEJORADO: Hash simple para emails (usando SHA-256)
   * Siempre normaliza el email antes de hacer hash
   */
  static hashEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }

    // Normalización consistente
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail) {
      throw new Error('Email cannot be empty after normalization');
    }

    return createHash('sha256').update(normalizedEmail).digest('hex');
  }

  /**
   * ✅ NUEVO: Verificar si un hash corresponde a un email
   */
  static verifyEmailHash(email: string, hash: string): boolean {
    try {
      const computedHash = this.hashEmail(email);
      return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedHash, 'hex'));
    } catch (error) {
      console.error('Error verifying email hash:', error);
      return false;
    }
  }

  /**
   * ✅ NUEVO: Generar identificador para usuario anonimizado usando supabase_user_id
   * Más confiable que usar hash de email
   */
  static generateAnonymizedIdentifier(supabaseUserId: string, timestamp?: number): string {
    if (!supabaseUserId) {
      throw new Error('Supabase User ID is required');
    }

    const ts = timestamp || Date.now();
    // Tomar solo una parte del UUID para el identificador
    const shortId = supabaseUserId.replace(/-/g, '').substring(0, 12);
    return `deleted_${shortId}_${ts}`;
  }

  /**
   * ✅ NUEVO: Generar email anonimizado usando supabase_user_id
   */
  static generateAnonymizedEmail(supabaseUserId: string, timestamp?: number): string {
    if (!supabaseUserId) {
      throw new Error('Supabase User ID is required');
    }

    const ts = timestamp || Date.now();
    const shortId = supabaseUserId.replace(/-/g, '').substring(0, 12);
    return `deleted_${shortId}_${ts}@deleted.local`;
  }

  /**
   * Generar token aleatorio
   */
  static generateSecureToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  /**
   * ✅ NUEVO: Generar hash para prevenir recreación de cuentas
   * Útil para mantener registro de emails que fueron eliminados
   */
  static createPreventionHash(email: string, additionalData?: string): string {
    const normalizedEmail = email.toLowerCase().trim();
    const dataToHash = additionalData
      ? `${normalizedEmail}:${additionalData}`
      : normalizedEmail;

    return createHash('sha256').update(dataToHash).digest('hex');
  }

  /**
   * ✅ NUEVO: Validar formato de email básico
   */
  static isValidEmailFormat(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.toLowerCase().trim());
  }
}