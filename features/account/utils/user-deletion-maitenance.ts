/* 
import { prisma } from '@/utils/prisma';
import { UserDeletionCore } from './user-deletion-core';

export class UserDeletionMaintenance {

    static async getDeletionStats() {
        const now = new Date();

        const pendingDeletions = await prisma.user.count({
            where: {
                deletion_scheduled_at: { not: null },
                is_deletion_cancelled: false,
                is_anonymized: false,
            },
        });

        const anonymizedCount = await prisma.user.count({
            where: {
                is_anonymized: true,
            },
        });

        const recentAnonymizations = await prisma.user.count({
            where: {
                is_anonymized: true,
                anonymized_at: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
        });

        const expiredRetention = await prisma.user.count({
            where: {
                is_anonymized: true,
                account_locked_until: {
                    lte: now,
                },
            },
        });

        const cancelledDeletions = await prisma.user.count({
            where: {
                is_deletion_cancelled: true,
            },
        });

        return {
            pendingDeletions,
            anonymizedAccounts: anonymizedCount,
            recentAnonymizations,
            expiredLegalRetention: expiredRetention,
            cancelledDeletions,
            gracePeriodDays: UserDeletionCore.GRACE_PERIOD_DAYS,
            legalRetentionYears: UserDeletionCore.LEGAL_RETENTION_YEARS, 
        };
    }

    static async getDetailedStats(days: number = 30) {
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

       
        const actionStats = await prisma.userDeletionLog.groupBy({
            by: ['action'],
            where: {
                created_at: { gte: since },
            },
            _count: {
                action: true,
            },
        });

      
        const dailyDeletions = await prisma.userDeletionLog.findMany({
            where: {
                action: 'EXECUTE',
                created_at: { gte: since },
            },
            select: {
                created_at: true,
            },
        });

      
        const deletionsByDay = dailyDeletions.reduce((acc, log) => {
            const day = log.created_at.toISOString().split('T')[0];
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            period: `${days} days`,
            since: since.toISOString(),
            actionBreakdown: actionStats.reduce((acc, stat) => {
                acc[stat.action] = stat._count.action;
                return acc;
            }, {} as Record<string, number>),
            deletionsByDay,
            totalActions: actionStats.reduce((sum, stat) => sum + stat._count.action, 0),
        };
    }


    static async getSystemStatus() {
        const now = new Date();

        const stats = await this.getDeletionStats();
        const orphanedCount = (await this.findOrphanedConnections()).length;

        const activeCount = await prisma.user.count({
            where: {
                is_anonymized: false,
            },
        });

  
        const inconsistentUsers = await this.findInconsistentDeletionStates();

        return {
            activeAccounts: activeCount,
            anonymizedAccounts: stats.anonymizedAccounts,
            pendingDeletions: stats.pendingDeletions,
            expiredLegalRetention: stats.expiredLegalRetention,
            cancelledDeletions: stats.cancelledDeletions,
            orphanedConnections: orphanedCount,
            inconsistentStates: inconsistentUsers.length,
            systemHealthy: orphanedCount === 0 &&
                stats.pendingDeletions < 1000 &&
                inconsistentUsers.length === 0,
            gracePeriodDays: UserDeletionCore.GRACE_PERIOD_DAYS,
            legalRetentionYears: UserDeletionCore.LEGAL_RETENTION_YEARS, 
            lastChecked: now.toISOString(),
        };
    }

  
    static async findOrphanedConnections() {
        const orphanedUsers = await prisma.user.findMany({
            where: {
                is_anonymized: true,
                supabase_user_id: {
                    not: null,
                },
            },
            select: {
                id: true,
                email: true,
                supabase_user_id: true,
                anonymized_at: true,
            },
        });

        return orphanedUsers;
    }

    static async findInconsistentDeletionStates() {
        const inconsistentUsers = await prisma.user.findMany({
            where: {
                OR: [
                   
                    {
                        is_anonymized: true,
                        deletion_requested_at: { not: null },
                    },
                   
                    {
                        is_deletion_cancelled: true,
                        deletion_scheduled_at: { not: null },
                    },
                  
                    {
                        is_anonymized: true,
                        anonymized_at: null,
                    },
                  
                    {
                        is_anonymized: true,
                        account_locked_until: null,
                    },
                ],
            },
            select: {
                id: true,
                email: true,
                is_anonymized: true,
                anonymized_at: true,
                deletion_requested_at: true,
                deletion_scheduled_at: true,
                is_deletion_cancelled: true,
                account_locked_until: true,
            },
        });

        return inconsistentUsers;
    }


    static async repairInconsistentStates() {
        const inconsistentUsers = await this.findInconsistentDeletionStates();
        let repairedCount = 0;

        for (const user of inconsistentUsers) {
            try {
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                       
                        ...(user.is_anonymized ? {
                            deletion_requested_at: null,
                            deletion_scheduled_at: null,
                            deletion_reason: null,
                            deletion_ip_address: null,
                            deletion_user_agent: null,
                            is_deletion_cancelled: false,
                            deletion_cancelled_at: null,
                            deletion_cancelled_reason: null,
                          
                            anonymized_at: user.anonymized_at || new Date(),
                           
                            account_locked_until: user.account_locked_until ||
                                new Date(Date.now() + UserDeletionCore.LEGAL_RETENTION_YEARS * 365 * 24 * 60 * 60 * 1000),
                        } : {}),

                  
                        ...(user.is_deletion_cancelled ? {
                            deletion_scheduled_at: null,
                        } : {}),
                    },
                });

                console.log(`🔧 Reparado estado inconsistente para usuario ${user.id}`);
                repairedCount++;
            } catch (error) {
                console.error(`❌ Error reparando usuario ${user.id}:`, error);
            }
        }

        console.log(`✅ Reparación completada: ${repairedCount}/${inconsistentUsers.length} usuarios`);
        return {
            repaired: repairedCount,
            total: inconsistentUsers.length,
            success: repairedCount === inconsistentUsers.length,
        };
    }

  
    static async generateHealthReport() {
        const systemStatus = await this.getSystemStatus();
        const detailedStats = await this.getDetailedStats(30);
        const inconsistentStates = await this.findInconsistentDeletionStates();

        const healthScore = this.calculateHealthScore(systemStatus);

        return {
            timestamp: new Date().toISOString(),
            healthScore,
            status: healthScore >= 80 ? 'HEALTHY' : healthScore >= 60 ? 'WARNING' : 'CRITICAL',
            systemOverview: systemStatus,
            recentActivity: detailedStats,
            issues: {
                orphanedConnections: systemStatus.orphanedConnections,
                inconsistentStates: inconsistentStates.length,
                expiredRetention: systemStatus.expiredLegalRetention,
            },
            recommendations: this.generateRecommendations(systemStatus, inconsistentStates),
        };
    }

  
    private static calculateHealthScore(status: any): number {
        let score = 100;

      
        if (status.orphanedConnections > 0) {
            score -= Math.min(status.orphanedConnections * 5, 20);
        }

      
        if (status.inconsistentStates > 0) {
            score -= Math.min(status.inconsistentStates * 10, 30);
        }

    
        if (status.expiredLegalRetention > 0) {
            score -= Math.min(status.expiredLegalRetention * 2, 15);
        }

    
        if (status.pendingDeletions > 100) {
            score -= Math.min((status.pendingDeletions - 100) * 0.1, 10);
        }

        return Math.max(0, Math.round(score));
    }

 
    private static generateRecommendations(status: any, inconsistentStates: any[]): string[] {
        const recommendations: string[] = [];

        if (status.orphanedConnections > 0) {
            recommendations.push(`Ejecutar UserDeletionScheduler.cleanupOrphanedConnections() para limpiar ${status.orphanedConnections} conexiones huérfanas`);
        }

        if (inconsistentStates.length > 0) {
            recommendations.push(`Ejecutar UserDeletionMaintenance.repairInconsistentStates() para reparar ${inconsistentStates.length} estados inconsistentes`);
        }

        if (status.expiredLegalRetention > 0) {
            recommendations.push(`Ejecutar UserDeletionScheduler.processLegalRetentionExpiry() para eliminar ${status.expiredLegalRetention} registros con retención expirada`);
        }

        if (status.pendingDeletions > 50) {
            recommendations.push(`Considerar ejecutar UserDeletionScheduler.processScheduledDeletions() para procesar ${status.pendingDeletions} eliminaciones pendientes`);
        }

        if (recommendations.length === 0) {
            recommendations.push('Sistema en buen estado, no se requieren acciones inmediatas');
        }

        return recommendations;
    }


    static async runCompleteDiagnostic() {
        console.log('🔍 Iniciando diagnóstico completo del sistema...');

        const healthReport = await this.generateHealthReport();

        console.log(`📊 Puntuación de salud: ${healthReport.healthScore}/100 (${healthReport.status})`);
        console.log(`📈 Cuentas activas: ${healthReport.systemOverview.activeAccounts}`);
        console.log(`👻 Cuentas anonimizadas: ${healthReport.systemOverview.anonymizedAccounts}`);
        console.log(`⏳ Eliminaciones pendientes: ${healthReport.systemOverview.pendingDeletions}`);

        if (healthReport.issues.orphanedConnections > 0) {
            console.log(`⚠️ Conexiones huérfanas: ${healthReport.issues.orphanedConnections}`);
        }

        if (healthReport.issues.inconsistentStates > 0) {
            console.log(`⚠️ Estados inconsistentes: ${healthReport.issues.inconsistentStates}`);
        }

        console.log('💡 Recomendaciones:');
        healthReport.recommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. ${rec}`);
        });

        return healthReport;
    }
} */