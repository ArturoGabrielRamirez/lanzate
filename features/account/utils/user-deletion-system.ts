// features/account/utils/user-deletion-system.ts
// 🎯 SISTEMA UNIFICADO - VERSIÓN TESTING CON PERÍODOS REDUCIDOS
import { prisma } from '@/utils/prisma';
import { CryptoUtils } from './crypto-utils';
import { createServerSideClient } from '@/utils/supabase/server';

export class UserDeletionSystem {
  // ✅ CONFIGURACIÓN CENTRALIZADA - MODO TESTING
  private static readonly CONFIG = {
    // 🧪 TESTING: 2 minutos en lugar de 30 días
    GRACE_PERIOD_DAYS: 0, // 0 días = inmediato
    GRACE_PERIOD_MINUTES: 2, // Para testing específico
    
    // 🧪 TESTING: Períodos súper reducidos
    RETENTION: {
      DELETION_LOGS_YEARS: 0,     // En testing: 0 = inmediato
      DELETION_LOGS_MINUTES: 5,   // 5 minutos para ver logs
      EMAIL_HASH_YEARS: 0,        // En testing: 0 = inmediato  
      EMAIL_HASH_MINUTES: 10,     // 10 minutos para testing legal
      USER_DATA_DAYS: 0,          // Inmediato tras período de gracia
    },
    
    // 🎯 FLAG PARA CAMBIAR FÁCILMENTE
    IS_TESTING_MODE: true, // ⚠️ CAMBIAR A false PARA PRODUCCIÓN
  };

  // ✅ GETTERS PÚBLICOS - Adaptados para testing
  static get GRACE_PERIOD_DAYS() { 
    return this.CONFIG.IS_TESTING_MODE ? 0 : 30; 
  }
  
  static get GRACE_PERIOD_MINUTES() { 
    return this.CONFIG.IS_TESTING_MODE ? this.CONFIG.GRACE_PERIOD_MINUTES : 0; 
  }
  
  static get LEGAL_RETENTION_YEARS() { 
    return this.CONFIG.IS_TESTING_MODE ? 0 : 7; 
  }
  
  static get LEGAL_RETENTION_MINUTES() { 
    return this.CONFIG.IS_TESTING_MODE ? this.CONFIG.RETENTION.EMAIL_HASH_MINUTES : 0; 
  }

  // 🧪 HELPER PARA CALCULAR FECHAS EN MODO TESTING
  private static calculateScheduleDate(): Date {
    const scheduledAt = new Date();
    
    if (this.CONFIG.IS_TESTING_MODE) {
      // En testing: agregar minutos
      scheduledAt.setMinutes(scheduledAt.getMinutes() + this.CONFIG.GRACE_PERIOD_MINUTES);
      console.log(`🧪 TESTING MODE: Eliminación programada para ${scheduledAt.toLocaleString()}`);
    } else {
      // En producción: agregar días
      scheduledAt.setDate(scheduledAt.getDate() + 30);
    }
    
    return scheduledAt;
  }

  private static calculateLegalRetention(): Date {
    const retentionDate = new Date();
    
    if (this.CONFIG.IS_TESTING_MODE) {
      // En testing: agregar minutos
      retentionDate.setMinutes(retentionDate.getMinutes() + this.CONFIG.RETENTION.EMAIL_HASH_MINUTES);
      console.log(`🧪 TESTING MODE: Retención legal hasta ${retentionDate.toLocaleString()}`);
    } else {
      // En producción: agregar años
      retentionDate.setFullYear(retentionDate.getFullYear() + 7);
    }
    
    return retentionDate;
  }

  // ================================
  // 🎯 OPERACIONES PRINCIPALES
  // ================================

  /**
   * SOLICITAR ELIMINACIÓN
   */
  static async requestDeletion(params: {
    userId: number;
    reason: string;
    ipAddress: string;
    userAgent: string;
  }) {
    const { userId, reason, ipAddress, userAgent } = params;
    const deletionRequestedAt = new Date();
    const deletionScheduledAt = this.calculateScheduleDate();

    return await prisma.$transaction(async (tx) => {
      // Obtener datos del usuario para el log
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { email: true, Account: true, Store: true },
      });

      if (!user) throw new Error('Usuario no encontrado');

      await tx.user.update({
        where: { id: userId },
        data: {
          deletion_requested_at: deletionRequestedAt,
          deletion_scheduled_at: deletionScheduledAt,
          deletion_reason: reason,
          deletion_ip_address: ipAddress,
          deletion_user_agent: userAgent,
          is_deletion_cancelled: false,
          deletion_cancelled_at: null,
          deletion_cancelled_reason: null,
        },
      });

      await tx.userDeletionLog.create({
        data: {
          user_id: userId,
          action: 'REQUEST',
          reason,
          ip_address: ipAddress,
          user_agent: userAgent,
          additional_data: JSON.stringify({
            scheduled_for: deletionScheduledAt.toISOString(),
            grace_period_days: this.GRACE_PERIOD_DAYS,
            grace_period_minutes: this.GRACE_PERIOD_MINUTES,
            testing_mode: this.CONFIG.IS_TESTING_MODE,
            legal_basis: 'Article 17 GDPR - Right to erasure',
            user_snapshot: {
              email_hash: CryptoUtils.hashEmail(user.email),
              accounts_count: user.Account?.length || 0,
              stores_count: user.Store?.length || 0,
            },
          }),
        },
      });

      // 🧪 Log especial para testing
      if (this.CONFIG.IS_TESTING_MODE) {
        console.log(`🧪 TESTING: Usuario ${userId} programado para eliminación en ${this.CONFIG.GRACE_PERIOD_MINUTES} minutos`);
        console.log(`🧪 Fecha programada: ${deletionScheduledAt.toLocaleString()}`);
      }

      return {
        deletionRequestedAt,
        deletionScheduledAt,
        gracePeriodDays: this.GRACE_PERIOD_DAYS,
        gracePeriodMinutes: this.GRACE_PERIOD_MINUTES,
        testingMode: this.CONFIG.IS_TESTING_MODE,
      };
    });
  }

  /**
   * CANCELAR ELIMINACIÓN
   */
  static async cancelDeletion(params: {
    userId: number;
    reason: string;
    ipAddress: string;
    userAgent: string;
  }) {
    const { userId, reason, ipAddress, userAgent } = params;
    const cancelledAt = new Date();

    return await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          deletion_requested_at: null,
          deletion_scheduled_at: null,
          deletion_reason: null,
          deletion_ip_address: null,
          deletion_user_agent: null,
          is_deletion_cancelled: true,
          deletion_cancelled_at: cancelledAt,
          deletion_cancelled_reason: reason,
        },
      });

      await tx.userDeletionLog.create({
        data: {
          user_id: userId,
          action: 'CANCEL',
          reason,
          ip_address: ipAddress,
          user_agent: userAgent,
          additional_data: JSON.stringify({
            cancelled_at: cancelledAt.toISOString(),
            testing_mode: this.CONFIG.IS_TESTING_MODE,
            legal_basis: 'User withdrew deletion request',
          }),
        },
      });

      return { cancelledAt };
    });
  }

  /**
   * EJECUTAR ELIMINACIÓN (ANONIMIZACIÓN)
   */
  static async executeUserDeletion(userId: number) {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          supabase_user_id: true,
          deletion_scheduled_at: true,
          is_deletion_cancelled: true,
          is_anonymized: true,
        },
      });

      if (!user) return { success: false, reason: 'User not found' };
      if (user.is_deletion_cancelled) return { success: false, reason: 'Deletion was cancelled' };
      if (user.is_anonymized) return { success: false, reason: 'User already anonymized' };

      const now = new Date();
      if (user.deletion_scheduled_at && user.deletion_scheduled_at > now) {
        return { success: false, reason: 'Not yet scheduled' };
      }

      // Eliminar de Supabase Auth
      let supabaseDeleted = false;
      if (user.supabase_user_id) {
        try {
          const supabase = createServerSideClient();
          const { error } = await supabase.auth.admin.deleteUser(user.supabase_user_id);
          if (!error) supabaseDeleted = true;
        } catch (error) {
          console.error('Error eliminando de Supabase:', error);
        }
      }

      // Generar datos de anonimización
      const emailHash = CryptoUtils.hashEmail(user.email);
      const timestamp = Date.now();
      const anonymizedEmail = user.supabase_user_id
        ? CryptoUtils.generateAnonymizedEmail(user.supabase_user_id, timestamp)
        : `deleted_${timestamp}@deleted.local`;
      const anonymizedUsername = user.supabase_user_id
        ? CryptoUtils.generateAnonymizedIdentifier(user.supabase_user_id, timestamp)
        : `deleted_${userId}_${timestamp}`;

      // Calcular retención legal (adaptado para testing)
      const legalRetentionUntil = this.calculateLegalRetention();

      // Anonimizar usuario
      await tx.user.update({
        where: { id: userId },
        data: {
          email: anonymizedEmail,
          first_name: null,
          last_name: null,
          phone: null,
          avatar: null,
          username: anonymizedUsername,
          supabase_user_id: null,
          is_anonymized: true,
          anonymized_at: now,
          original_email_hash: emailHash,
          account_locked_until: legalRetentionUntil,
          deletion_requested_at: null,
          deletion_scheduled_at: null,
          deletion_reason: null,
          deletion_ip_address: null,
          deletion_user_agent: null,
        },
      });

      // Log de ejecución
      await tx.userDeletionLog.create({
        data: {
          user_id: userId,
          action: 'EXECUTE',
          reason: 'Scheduled deletion executed',
          ip_address: 'system',
          user_agent: 'auto-deletion',
          additional_data: JSON.stringify({
            anonymized: true,
            executed_at: now.toISOString(),
            original_email_hash: emailHash,
            supabase_deleted: supabaseDeleted,
            legal_retention_until: legalRetentionUntil.toISOString(),
            testing_mode: this.CONFIG.IS_TESTING_MODE,
            retention_policy: this.CONFIG.RETENTION,
          }),
        },
      });

      // Limpiar referencias
      await this.cleanupUserReferences(tx, userId);

      // 🧪 Log especial para testing
      if (this.CONFIG.IS_TESTING_MODE) {
        console.log(`🧪 TESTING: Usuario ${userId} anonimizado. Retención hasta: ${legalRetentionUntil.toLocaleString()}`);
      } else {
        console.log(`✅ Usuario ${userId} anonimizado. Retención hasta: ${legalRetentionUntil.toISOString()}`);
      }

      return {
        success: true,
        anonymized: true,
        supabaseDeleted,
        legalRetentionUntil,
        testingMode: this.CONFIG.IS_TESTING_MODE,
      };
    });
  }

  // ================================
  // 🔍 VALIDACIÓN Y ESTADO
  // ================================

  /**
   * OBTENER ESTADO DE ELIMINACIÓN
   */
  static async getDeletionStatus(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        deletion_requested_at: true,
        deletion_scheduled_at: true,
        deletion_reason: true,
        is_deletion_cancelled: true,
        is_anonymized: true,
        anonymized_at: true,
        account_locked_until: true,
      },
    });

    if (!user || !user.deletion_requested_at) {
      return {
        isDeletionRequested: false,
        deletionRequestedAt: null,
        deletionScheduledAt: null,
        deletionReason: null,
        canCancel: false,
        daysRemaining: 0,
        minutesRemaining: 0,
        timeRemaining: null,
        isAnonymized: user?.is_anonymized || false,
        legalStatus: user?.is_anonymized ? 'legally_processed' : 'active',
        testingMode: this.CONFIG.IS_TESTING_MODE,
      };
    }

    const now = new Date();
    const scheduledAt = user.deletion_scheduled_at!;
    const timeDifference = scheduledAt.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(timeDifference / (1000 * 60 * 60 * 24)));
    const minutesRemaining = Math.max(0, Math.ceil(timeDifference / (1000 * 60)));
    const canCancel = timeDifference > 0 && !user.is_deletion_cancelled && !user.is_anonymized;

    return {
      isDeletionRequested: true,
      deletionRequestedAt: user.deletion_requested_at,
      deletionScheduledAt: user.deletion_scheduled_at,
      deletionReason: user.deletion_reason,
      canCancel,
      daysRemaining,
      minutesRemaining,
      timeRemaining: Math.max(0, timeDifference),
      isAnonymized: user.is_anonymized || false,
      anonymizedAt: user.anonymized_at,
      legalRetentionUntil: user.account_locked_until,
      legalStatus: user.is_anonymized ? 'legally_processed' : 'pending_deletion',
      testingMode: this.CONFIG.IS_TESTING_MODE,
    };
  }

  /**
   * VALIDAR CREACIÓN DE NUEVO USUARIO
   */
  static async validateNewUserCreation(email: string) {
    const emailHash = CryptoUtils.hashEmail(email);

    // Verificar usuario activo con el mismo email
    const activeUser = await prisma.user.findFirst({
      where: { email: email, is_anonymized: false },
      select: { id: true },
    });

    if (activeUser) {
      return {
        canCreate: false,
        reason: 'Email already in use by active account',
        conflict: true,
      };
    }

    // Verificar si fue previamente anonimizado
    const anonymizedUser = await prisma.user.findFirst({
      where: {
        original_email_hash: emailHash,
        is_anonymized: true,
      },
      select: { anonymized_at: true, account_locked_until: true },
    });

    return {
      canCreate: true,
      reason: null,
      conflict: false,
      previouslyAnonymized: !!anonymizedUser,
      anonymizedAt: anonymizedUser?.anonymized_at,
      legalRetentionUntil: anonymizedUser?.account_locked_until,
      testingMode: this.CONFIG.IS_TESTING_MODE,
    };
  }

  // ================================
  // 🔄 PROCESAMIENTO AUTOMÁTICO
  // ================================

  /**
   * PROCESAR ELIMINACIONES PROGRAMADAS
   */
  static async processScheduledDeletions() {
    const now = new Date();

    const usersToDelete = await prisma.user.findMany({
      where: {
        deletion_scheduled_at: { lte: now },
        is_deletion_cancelled: false,
        is_anonymized: false,
      },
      select: { id: true, email: true },
    });

    // 🧪 Log especial para testing
    if (this.CONFIG.IS_TESTING_MODE && usersToDelete.length > 0) {
      console.log(`🧪 TESTING: Procesando ${usersToDelete.length} eliminaciones programadas`);
    }

    let processedCount = 0;
    for (const user of usersToDelete) {
      try {
        const result = await this.executeUserDeletion(user.id);
        if (result.success) processedCount++;
      } catch (error) {
        console.error(`Error procesando usuario ${user.id}:`, error);
      }
    }

    return {
      processed: processedCount,
      total: usersToDelete.length,
      success: processedCount === usersToDelete.length,
      testingMode: this.CONFIG.IS_TESTING_MODE,
    };
  }

  /**
   * PROCESAR EXPIRACIÓN DE RETENCIÓN LEGAL
   */
  static async processLegalRetentionExpiry() {
    const now = new Date();

    const expiredUsers = await prisma.user.findMany({
      where: {
        is_anonymized: true,
        account_locked_until: { lte: now },
      },
      select: { id: true },
    });

    // 🧪 Log especial para testing
    if (this.CONFIG.IS_TESTING_MODE && expiredUsers.length > 0) {
      console.log(`🧪 TESTING: Eliminando definitivamente ${expiredUsers.length} usuarios con retención expirada`);
    }

    let deletedCount = 0;
    for (const user of expiredUsers) {
      try {
        await prisma.$transaction(async (tx) => {
          await tx.userDeletionLog.deleteMany({ where: { user_id: user.id } });
          await tx.user.delete({ where: { id: user.id } });
        });
        deletedCount++;
      } catch (error) {
        console.error(`Error eliminando definitivamente usuario ${user.id}:`, error);
      }
    }

    return {
      deleted: deletedCount,
      total: expiredUsers.length,
      success: deletedCount === expiredUsers.length,
      testingMode: this.CONFIG.IS_TESTING_MODE,
    };
  }

  /**
   * LIMPIAR CONEXIONES HUÉRFANAS
   */
  static async cleanupOrphanedConnections() {
    const orphanedUsers = await prisma.user.findMany({
      where: {
        is_anonymized: true,
        supabase_user_id: { not: null },
      },
      select: { id: true, supabase_user_id: true },
    });

    let cleanedCount = 0;
    for (const user of orphanedUsers) {
      try {
        if (user.supabase_user_id) {
          const supabase = createServerSideClient();
          await supabase.auth.admin.deleteUser(user.supabase_user_id);
          
          await prisma.user.update({
            where: { id: user.id },
            data: { supabase_user_id: null },
          });
          
          cleanedCount++;
        }
      } catch (error) {
        console.error(`Error limpiando usuario ${user.id}:`, error);
      }
    }

    return cleanedCount;
  }

  // ================================
  // 📊 ESTADÍSTICAS Y MANTENIMIENTO
  // ================================

  /**
   * ESTADÍSTICAS GENERALES
   */
  static async getDeletionStats() {
    const [pendingDeletions, anonymizedAccounts, expiredRetention] = await Promise.all([
      prisma.user.count({
        where: {
          deletion_scheduled_at: { not: null },
          is_deletion_cancelled: false,
          is_anonymized: false,
        },
      }),
      prisma.user.count({ where: { is_anonymized: true } }),
      prisma.user.count({
        where: {
          is_anonymized: true,
          account_locked_until: { lte: new Date() },
        },
      }),
    ]);

    return {
      pendingDeletions,
      anonymizedAccounts,
      expiredLegalRetention: expiredRetention,
      gracePeriodDays: this.GRACE_PERIOD_DAYS,
      gracePeriodMinutes: this.GRACE_PERIOD_MINUTES,
      legalRetentionYears: this.LEGAL_RETENTION_YEARS,
      legalRetentionMinutes: this.LEGAL_RETENTION_MINUTES,
      testingMode: this.CONFIG.IS_TESTING_MODE,
    };
  }

  /**
   * ESTADO DEL SISTEMA
   */
  static async getSystemStatus() {
    const stats = await this.getDeletionStats();
    const orphanedCount = (await this.findOrphanedConnections()).length;

    return {
      ...stats,
      orphanedConnections: orphanedCount,
      systemHealthy: orphanedCount === 0 && stats.pendingDeletions < 100,
      lastChecked: new Date().toISOString(),
      testingMode: this.CONFIG.IS_TESTING_MODE,
    };
  }

  /**
   * CHEQUEO RÁPIDO DE SALUD
   */
  static async quickHealthCheck() {
    const stats = await this.getDeletionStats();
    const orphaned = await this.findOrphanedConnections();

    return {
      healthy: orphaned.length === 0 && stats.pendingDeletions < 100,
      pendingDeletions: stats.pendingDeletions,
      orphanedConnections: orphaned.length,
      anonymizedAccounts: stats.anonymizedAccounts,
      testingMode: this.CONFIG.IS_TESTING_MODE,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * MANTENIMIENTO PROGRAMADO
   */
  static async runScheduledMaintenance() {
    const modeLabel = this.CONFIG.IS_TESTING_MODE ? '🧪 TESTING' : '🔧';
    console.log(`${modeLabel} Iniciando mantenimiento programado...`);

    const [deletionResults, orphanedCleaned, retentionResults] = await Promise.all([
      this.processScheduledDeletions(),
      this.cleanupOrphanedConnections(),
      this.processLegalRetentionExpiry(),
    ]);

    const summary = {
      deletions: deletionResults,
      orphanedConnectionsCleaned: orphanedCleaned,
      legalRetentionCleanup: retentionResults,
      testingMode: this.CONFIG.IS_TESTING_MODE,
      timestamp: new Date().toISOString(),
      success: deletionResults.success && retentionResults.success,
    };

    console.log(`${modeLabel} Mantenimiento completado:`, summary);
    return summary;
  }

  // ================================
  // 🧹 HELPERS PRIVADOS
  // ================================

  private static async findOrphanedConnections() {
    return await prisma.user.findMany({
      where: {
        is_anonymized: true,
        supabase_user_id: { not: null },
      },
      select: {
        id: true,
        email: true,
        supabase_user_id: true,
        anonymized_at: true,
      },
    });
  }

  private static async cleanupUserReferences(tx: any, userId: number) {
    // Limpiar comentarios
    await tx.product_comments.updateMany({
      where: { user_id: userId },
      data: { content: '[Comentario de usuario eliminado]', is_active: false },
    });

    // Eliminar likes
    await tx.product_likes.deleteMany({ where: { user_id: userId } });

    // Eliminar notificaciones
    await tx.notification.deleteMany({ where: { user_id: userId } });

    // Eliminar recordatorios
    await tx.userReminder.deleteMany({ where: { user_id: userId } });

    // Anonimizar mensajes
    await tx.orderMessage.updateMany({
      where: { sender_id: userId },
      data: { message: '[Mensaje de usuario eliminado]' },
    });

    const modeLabel = this.CONFIG.IS_TESTING_MODE ? '🧪' : '🧹';
    console.log(`${modeLabel} Referencias limpiadas para usuario ${userId}`);
  }

  // ================================
  // 🧪 UTILIDADES DE DESARROLLO Y TESTING
  // ================================

  /**
   * 🧪 CAMBIAR MODO (para testing)
   */
  static setTestingMode(enabled: boolean) {
    console.log(`🧪 Cambiando modo testing: ${enabled ? 'ACTIVADO' : 'DESACTIVADO'}`);
    // Nota: En implementación real, esto debería cambiar una variable de entorno
    // o usar un método más seguro
    return {
      previousMode: this.CONFIG.IS_TESTING_MODE,
      newMode: enabled,
      warning: 'Este método es solo para testing. En producción usar variables de entorno.',
    };
  }

  /**
   * 🧪 FORZAR PROCESAMIENTO (para testing)
   */
  static async forceProcessPendingDeletions() {
    if (!this.CONFIG.IS_TESTING_MODE) {
      throw new Error('forceProcessPendingDeletions solo disponible en modo testing');
    }

    console.log('🧪 FORZANDO procesamiento de eliminaciones pendientes...');
    return await this.processScheduledDeletions();
  }

  /**
   * 🧪 FORZAR LIMPIEZA DE RETENCIÓN (para testing)
   */
  static async forceProcessRetentionExpiry() {
    if (!this.CONFIG.IS_TESTING_MODE) {
      throw new Error('forceProcessRetentionExpiry solo disponible en modo testing');
    }

    console.log('🧪 FORZANDO limpieza de retención legal expirada...');
    return await this.processLegalRetentionExpiry();
  }

  /**
   * LIMPIAR DATOS DE TESTING (solo desarrollo)
   */
  static async cleanTestData(testEmailPattern: string = '@test.') {
    if (process.env.NODE_ENV === 'production' && !this.CONFIG.IS_TESTING_MODE) {
      throw new Error('cleanTestData no permitido en producción');
    }

    const testUsers = await prisma.user.findMany({
      where: { email: { contains: testEmailPattern } },
      select: { id: true, email: true },
    });

    for (const user of testUsers) {
      await this.executeUserDeletion(user.id);
    }

    return {
      cleaned: testUsers.length,
      users: testUsers.map((u) => u.email),
      testingMode: this.CONFIG.IS_TESTING_MODE,
    };
  }
}

export default UserDeletionSystem;