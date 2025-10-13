import { prisma } from '@/utils/prisma';
import { CryptoUtils } from './crypto-utils';
import DeletionHelpers from './deletion-helpers';

export class UserDeletionSystem {
  // CONFIGURACIÓN ADAPTADA PARA SUPABASE CRON
  private static readonly CONFIG = {
    // Para testing con cron cada minuto
    GRACE_PERIOD_MINUTES: 2,

    // Para producción
    GRACE_PERIOD_DAYS: 30,

    RETENTION: {
      LEGAL_RETENTION_YEARS: 7,
      LEGAL_RETENTION_MINUTES: 10, // Solo para testing
    },

    IS_TESTING_MODE: true,
  };

  /**
   * OBTENER ESTADO - Corregido para usar displayScheduledAt calculado
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
        displayScheduledAt: null,
        deletionReason: null,
        canCancel: false,
        daysRemaining: 0,
        minutesRemaining: 0,
        timeRemaining: null,
        canDeleteUntil: null,
        canCancelUntil: null,
        isWithinActionWindow: false,
        isAnonymized: user?.is_anonymized || false,
        legalStatus: user?.is_anonymized ? 'legally_processed' : 'active',
        processingMethod: 'supabase_pg_cron',
        testingMode: this.CONFIG.IS_TESTING_MODE,
      };
    }

    const now = new Date();
    const scheduledAt = user.deletion_scheduled_at!;

    // Usar DeletionHelpers para calcular la fecha de display redondeada
    const displayScheduledAt = DeletionHelpers.getDisplayScheduledDate(scheduledAt);
    const daysRemaining = DeletionHelpers.getDaysRemaining(scheduledAt);

    // Calcular minutos usando la fecha original (no redondeada) para precisión
    const timeDifference = scheduledAt.getTime() - now.getTime();
    const minutesRemaining = Math.max(0, Math.ceil(timeDifference / (1000 * 60)));

    const canCancel = timeDifference > 0 && !user.is_deletion_cancelled && !user.is_anonymized;

    // Calcular ventana de acción (últimas horas antes del cron)
    const actionWindowMinutes = this.CONFIG.IS_TESTING_MODE ? 1 : 60; // 1 min en testing, 1h en prod
    const actionWindowStart = new Date(scheduledAt.getTime() - (actionWindowMinutes * 60 * 1000));
    const isWithinActionWindow = now >= actionWindowStart && now < scheduledAt;

    const canCancelUntil = canCancel ? scheduledAt : null;

    return {
      isDeletionRequested: true,
      deletionRequestedAt: user.deletion_requested_at,
      deletionScheduledAt: user.deletion_scheduled_at,
      displayScheduledAt, // Fecha redondeada para mostrar al usuario
      deletionReason: user.deletion_reason,
      canCancel,
      daysRemaining,
      minutesRemaining,
      timeRemaining: null, // Eliminado - que el frontend calcule desde displayScheduledAt
      canDeleteUntil: scheduledAt,
      canCancelUntil,
      isWithinActionWindow,
      isAnonymized: user.is_anonymized || false,
      anonymizedAt: user.anonymized_at,
      legalRetentionUntil: user.account_locked_until,
      legalStatus: user.is_anonymized ? 'legally_processed' : 'pending_deletion',
      processingMethod: 'supabase_pg_cron',
      cronFrequency: this.CONFIG.IS_TESTING_MODE ? 'every_minute' : 'daily_3am',
      testingMode: this.CONFIG.IS_TESTING_MODE,
      calculationInfo: {
        requestedAt: user.deletion_requested_at,
        scheduledAt: user.deletion_scheduled_at,
        displayScheduledAt,
        currentTime: now.toISOString(),
        roundedActionLimit: displayScheduledAt?.toISOString() || null,
        withinWindow: isWithinActionWindow,
      },
    };
  }

  /**
   * SOLICITAR ELIMINACIÓN - Actualizado para usar DeletionHelpers
   */
  static async requestDeletion(params: {
    userId: number;
    reason: string;
    ipAddress: string;
    userAgent: string;
  }) {
    const { userId, reason, ipAddress, userAgent } = params;
    const deletionRequestedAt = new Date();

    // Calcular fecha de eliminación según el modo
    const deletionScheduledAt = new Date();
    if (this.CONFIG.IS_TESTING_MODE) {
      // En testing: 2 minutos
      deletionScheduledAt.setMinutes(deletionScheduledAt.getMinutes() + this.CONFIG.GRACE_PERIOD_MINUTES);
      console.log(`Testing: Eliminación programada para ${deletionScheduledAt.toLocaleString()}`);
    } else {
      // En producción: 30 días
      deletionScheduledAt.setDate(deletionScheduledAt.getDate() + this.CONFIG.GRACE_PERIOD_DAYS);
    }

    return await prisma.$transaction(async (tx) => {
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
            display_scheduled_for: DeletionHelpers.getDisplayScheduledDate(deletionScheduledAt)?.toISOString(),
            processing_method: 'supabase_pg_cron',
            cron_frequency: this.CONFIG.IS_TESTING_MODE ? 'every_minute' : 'daily_3am',
            grace_period_days: this.CONFIG.GRACE_PERIOD_DAYS,
            grace_period_minutes: this.CONFIG.GRACE_PERIOD_MINUTES,
            testing_mode: this.CONFIG.IS_TESTING_MODE,
            legal_basis: 'Article 17 GDPR - Right to erasure',
          }),
        },
      });

      return {
        deletionRequestedAt,
        deletionScheduledAt,
        displayScheduledAt: DeletionHelpers.getDisplayScheduledDate(deletionScheduledAt),
        processingMethod: 'supabase_pg_cron',
        cronFrequency: this.CONFIG.IS_TESTING_MODE ? 'every_minute' : 'daily_3am',
        gracePeriodDays: this.CONFIG.GRACE_PERIOD_DAYS,
        gracePeriodMinutes: this.CONFIG.GRACE_PERIOD_MINUTES,
        testingMode: this.CONFIG.IS_TESTING_MODE,
        automaticProcessing: true,
      };
    });
  }

  /**
   * CANCELAR ELIMINACIÓN - Sin cambios
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
            processing_method: 'supabase_pg_cron',
            testing_mode: this.CONFIG.IS_TESTING_MODE,
            legal_basis: 'User withdrew deletion request',
          }),
        },
      });

      return {
        cancelledAt,
        processingMethod: 'supabase_pg_cron',
        automaticProcessing: false,
      };
    });
  }

  /**
   * ESTADÍSTICAS DEL SISTEMA - Actualizado
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

      systemInfo: {
        processingMethod: 'supabase_pg_cron',
        cronFrequency: this.CONFIG.IS_TESTING_MODE ? 'every_minute' : 'daily_3am',
        automaticProcessing: true,
        manualInterventionRequired: false,
      },

      gracePeriodDays: this.CONFIG.GRACE_PERIOD_DAYS,
      gracePeriodMinutes: this.CONFIG.GRACE_PERIOD_MINUTES,
      legalRetentionYears: this.CONFIG.RETENTION.LEGAL_RETENTION_YEARS,
      legalRetentionMinutes: this.CONFIG.RETENTION.LEGAL_RETENTION_MINUTES,
      testingMode: this.CONFIG.IS_TESTING_MODE,
      lastChecked: new Date().toISOString(),
    };
  }

  /**
   * ESTADO DEL SISTEMA - Nuevo método para monitoreo
   */
  static async getSystemStatus() {
    const stats = await this.getDeletionStats();

    return {
      ...stats,
      systemHealthy: stats.pendingDeletions < 100 && stats.expiredLegalRetention === 0,

      cronSystemStatus: {
        enabled: true,
        method: 'supabase_pg_cron',
        frequency: this.CONFIG.IS_TESTING_MODE ? 'every_minute' : 'daily_3am',
        nextExecution: this.CONFIG.IS_TESTING_MODE
          ? 'Within next minute'
          : 'Tomorrow at 3:00 AM',
        requiresManualTrigger: false,
      },

      timestamp: new Date().toISOString(),
      testingMode: this.CONFIG.IS_TESTING_MODE,
    };
  }

  /**
   * VALIDACIÓN DE NUEVA CUENTA - Sin cambios
   */
  static async validateNewUserCreation(email: string) {
    const emailHash = CryptoUtils.hashEmail(email);

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
      processingMethod: 'supabase_pg_cron',
      testingMode: this.CONFIG.IS_TESTING_MODE,
    };
  }

  /**
   * FORZAR CHEQUEO MANUAL (solo para testing/debug)
   */
  static async manualHealthCheck() {
    const stats = await this.getDeletionStats();

    return {
      ...stats,
      manualCheck: true,
      note: 'En producción, pg_cron procesa automáticamente',
      cronInfo: {
        method: 'supabase_pg_cron',
        automaticExecution: true,
        frequencyTesting: 'every_minute',
        frequencyProduction: 'daily_3am',
      },
      timestamp: new Date().toISOString(),
    };
  }

  // GETTERS PÚBLICOS - Mantenidos por compatibilidad
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
    return this.CONFIG.IS_TESTING_MODE ? this.CONFIG.RETENTION.LEGAL_RETENTION_MINUTES : 0;
  }
}

export default UserDeletionSystem;