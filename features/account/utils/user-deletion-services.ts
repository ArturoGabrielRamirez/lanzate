/* // features/account/utils/user-deletion-legal.ts
import { prisma } from '@/utils/prisma';
import { CryptoUtils } from './crypto-utils';

export class LegalCompliantUserDeletion {
  // CONFIGURACIÓN LEGAL
  private static readonly DELETION_GRACE_PERIOD_MINUTES = 2; // Testing
  private static readonly DELETION_GRACE_PERIOD_DAYS = 0;
  
  // PERÍODOS DE RETENCIÓN LEGALES (configurable según jurisdicción)
  private static readonly LEGAL_RETENTION_CONFIG = {
    // Logs de eliminación: 2 años (requerido para auditorías GDPR)
    DELETION_LOGS_RETENTION_YEARS: 2,
    
    // Hash de email: 7 años (para prevenir recreación de cuentas)
    EMAIL_HASH_RETENTION_YEARS: 7,
    
    // Datos financieros/facturas: 7 años (requerido por ley fiscal)
    FINANCIAL_DATA_RETENTION_YEARS: 7,
    
    // Datos de usuario: inmediato (tras período de gracia)
    USER_DATA_RETENTION_DAYS: 0,
  };


  static async requestDeletion({
    userId,
    reason,
    ipAddress,
    userAgent
  }: {
    userId: number;
    reason: string;
    ipAddress: string;
    userAgent: string;
  }) {
    const deletionRequestedAt = new Date();
    const deletionScheduledAt = new Date();
    
    // Período de gracia configurable
    if (this.DELETION_GRACE_PERIOD_DAYS > 0) {
      deletionScheduledAt.setDate(deletionScheduledAt.getDate() + this.DELETION_GRACE_PERIOD_DAYS);
    } else {
      deletionScheduledAt.setMinutes(deletionScheduledAt.getMinutes() + this.DELETION_GRACE_PERIOD_MINUTES);
    }

    const result = await prisma.$transaction(async (tx) => {
      // Obtener datos del usuario antes de la eliminación
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { 
          email: true, 
          first_name: true, 
          last_name: true,
          // Incluir datos relacionados que pueden tener requisitos legales
          Account: { select: { id: true, type: true } },
          Store: { select: { id: true, name: true } },
        },
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Marcar usuario para eliminación
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

      // Log legal completo
      await tx.userDeletionLog.create({
        data: {
          user_id: userId,
          action: 'REQUEST',
          reason,
          ip_address: ipAddress,
          user_agent: userAgent,
          additional_data: JSON.stringify({
            scheduled_for: deletionScheduledAt.toISOString(),
            grace_period_minutes: this.DELETION_GRACE_PERIOD_MINUTES,
            legal_basis: 'Article 17 GDPR - Right to erasure',
            user_snapshot: {
              email_hash: CryptoUtils.hashEmail(user.email),
              accounts_count: user.Account?.length || 0,
              stores_count: user.Store?.length || 0,
              has_financial_data: (user.Account?.length || 0) > 0,
            },
            retention_policy_version: '1.0',
            jurisdiction: 'EU/GDPR',
          }),
        },
      });

      return {
        deletionRequestedAt,
        deletionScheduledAt,
        gracePeriodMinutes: this.DELETION_GRACE_PERIOD_MINUTES,
        legalBasis: 'Article 17 GDPR - Right to erasure',
        retentionPolicy: this.LEGAL_RETENTION_CONFIG,
      };
    });

    // Auto-ejecución para testing
    if (this.DELETION_GRACE_PERIOD_MINUTES <= 5) {
      setTimeout(async () => {
        try {
          console.log(`⏰ Ejecutando eliminación legal para usuario ${userId}...`);
          await this.executeLegalDeletion(userId);
        } catch (error) {
          console.error(`❌ Error en eliminación legal:`, error);
        }
      }, this.DELETION_GRACE_PERIOD_MINUTES * 60 * 1000);
    }

    return result;
  }


  static async cancelDeletion({
    userId,
    reason,
    ipAddress,
    userAgent
  }: {
    userId: number;
    reason: string;
    ipAddress: string;
    userAgent: string;
  }) {
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

      // Log de cancelación con base legal
      await tx.userDeletionLog.create({
        data: {
          user_id: userId,
          action: 'CANCEL',
          reason,
          ip_address: ipAddress,
          user_agent: userAgent,
          additional_data: JSON.stringify({
            cancelled_at: cancelledAt.toISOString(),
            legal_basis: 'User withdrew deletion request',
            retention_restored: true,
          }),
        },
      });

      return { cancelledAt, legalStatus: 'deletion_cancelled' };
    });
  }


  static async executeLegalDeletion(userId: number) {
    return await prisma.$transaction(async (tx) => {
      // Obtener usuario completo
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { 
          id: true,
          email: true, 
          first_name: true,
          last_name: true,
          phone: true,
          avatar: true,
          username: true,
          deletion_scheduled_at: true,
          is_deletion_cancelled: true,
          // Datos relacionados
          Account: { select: { id: true, type: true, created_at: true } },
          Store: { select: { id: true, name: true, created_at: true } },
        },
      });

      if (!user) {
        return { success: false, reason: 'User not found' };
      }

      if (user.is_deletion_cancelled) {
        return { success: false, reason: 'Deletion was cancelled' };
      }

      // Verificar tiempo
      const now = new Date();
      if (user.deletion_scheduled_at && user.deletion_scheduled_at > now) {
        return { success: false, reason: 'Not yet scheduled' };
      }

      // PROCESO DE ELIMINACIÓN LEGAL

      // 1. Crear hashes y referencias legales
      const emailHash = CryptoUtils.hashEmail(user.email);
      const timestamp = Date.now();
      const anonymizationId = `anon_${userId}_${timestamp}`;

      // 2. Determinar qué datos conservar por requisitos legales
      const hasFinancialData = (user.Account?.length || 0) > 0;
      const hasBusinessData = (user.Store?.length || 0) > 0;

      // 3. ANONIMIZAR DATOS PERSONALES (cumple GDPR Art. 17)
      await tx.user.update({
        where: { id: userId },
        data: {
          // Eliminar datos personales identificables
          email: `deleted_${timestamp}@deleted.local`,
          first_name: null,
          last_name: null,
          phone: null,
          avatar: null,
          username: `deleted_${userId}_${timestamp}`,
          
          // Marcar como anonimizado
          is_anonymized: true,
          anonymized_at: now,
          original_email_hash: emailHash,
          
          // Limpiar campos de eliminación
          deletion_requested_at: null,
          deletion_scheduled_at: null,
          deletion_reason: null,
          deletion_ip_address: null,
          deletion_user_agent: null,
        },
      });

      // 4. CONSERVAR DATOS POR REQUISITOS LEGALES
      const legalRetentionData = {
        user_id: userId,
        anonymization_id: anonymizationId,
        original_email_hash: emailHash,
        anonymized_at: now,
        
        // Calcular fechas de eliminación según requisitos legales
        deletion_logs_retain_until: new Date(now.getFullYear() + this.LEGAL_RETENTION_CONFIG.DELETION_LOGS_RETENTION_YEARS, now.getMonth(), now.getDate()),
        email_hash_retain_until: new Date(now.getFullYear() + this.LEGAL_RETENTION_CONFIG.EMAIL_HASH_RETENTION_YEARS, now.getMonth(), now.getDate()),
        
        // Metadatos legales
        legal_basis: JSON.stringify({
          gdpr_article: 'Article 17 - Right to erasure',
          retention_justification: {
            deletion_logs: `${this.LEGAL_RETENTION_CONFIG.DELETION_LOGS_RETENTION_YEARS} years - audit requirements`,
            email_hash: `${this.LEGAL_RETENTION_CONFIG.EMAIL_HASH_RETENTION_YEARS} years - prevent account recreation`,
            financial_data: hasFinancialData ? `${this.LEGAL_RETENTION_CONFIG.FINANCIAL_DATA_RETENTION_YEARS} years - tax law` : 'none',
          },
          jurisdiction: 'EU/GDPR',
          compliance_officer: 'system',
        }),
        
        // Resumen de datos eliminados vs conservados
        deletion_summary: JSON.stringify({
          deleted_immediately: ['email', 'first_name', 'last_name', 'phone', 'avatar', 'username'],
          anonymized: ['user_id'],
          retained_legally: ['deletion_logs', 'email_hash'],
          retention_periods: this.LEGAL_RETENTION_CONFIG,
        }),
      };

      // 5. Guardar registro legal (si la tabla existe)
    /*   try {
        await tx.legalRetentionRecord.create({
          data: legalRetentionData,
        });
 

      // 6. Log final de ejecución
      await tx.userDeletionLog.create({
        data: {
          user_id: userId,
          action: 'EXECUTE',
          reason: 'Legal compliant deletion executed',
          ip_address: 'system',
          user_agent: 'legal-deletion-service',
          additional_data: JSON.stringify({
            anonymization_id: anonymizationId,
            anonymized: true,
            executed_at: now.toISOString(),
            original_email_hash: emailHash,
            legal_compliance: {
              gdpr_article_17: 'applied',
              data_minimization: 'applied',
              storage_limitation: 'applied',
              retention_schedule: this.LEGAL_RETENTION_CONFIG,
            },
            data_processing_summary: {
              personal_data_deleted: true,
              anonymization_applied: true,
              legal_basis_documented: true,
              audit_trail_maintained: true,
            },
          }),
        },
      });

      console.log(`✅ Usuario ${userId} procesado legalmente - Anonimizado con ID: ${anonymizationId}`);
      
      return { 
        success: true, 
        anonymized: true, 
        anonymizationId,
        legalCompliance: {
          gdprArticle17: 'applied',
          retentionSchedule: this.LEGAL_RETENTION_CONFIG,
          auditTrail: 'maintained',
        }
      };
    });
  }

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
        original_email_hash: true,
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
        retentionPolicy: this.LEGAL_RETENTION_CONFIG,
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
      legalStatus: user.is_anonymized ? 'legally_processed' : 'pending_deletion',
      legalBasis: 'Article 17 GDPR - Right to erasure',
      retentionPolicy: this.LEGAL_RETENTION_CONFIG,
    };
  }


  static async cleanupExpiredLegalData() {
    const now = new Date();
    const logsRetentionDate = new Date(now.getFullYear() - this.LEGAL_RETENTION_CONFIG.DELETION_LOGS_RETENTION_YEARS, now.getMonth(), now.getDate());

    // Eliminar logs de eliminación antiguos (después de 2 años)
    const deletedLogs = await prisma.userDeletionLog.deleteMany({
      where: {
        created_at: {
          lt: logsRetentionDate,
        },
      },
    });

    console.log(`🧹 Limpieza legal: ${deletedLogs.count} logs eliminados (más de ${this.LEGAL_RETENTION_CONFIG.DELETION_LOGS_RETENTION_YEARS} años)`);

    return {
      deletedLogs: deletedLogs.count,
      retentionPolicyApplied: this.LEGAL_RETENTION_CONFIG,
    };
  }
} */