/* import { prisma } from '@/utils/prisma';
import { UserDeletionCore } from './user-deletion-core';
import { UserDeletionMaintenance } from './user-deletion-maitenance';


export class UserDeletionScheduler {

  static async processScheduledDeletions() {
    const now = new Date();

    const usersToDelete = await prisma.user.findMany({
      where: {
        deletion_scheduled_at: {
          lte: now,
        },
        is_deletion_cancelled: false,
        is_anonymized: false,
      },
      select: { id: true, email: true, deletion_scheduled_at: true },
    });

    console.log(`🔄 Procesando ${usersToDelete.length} eliminaciones pendientes...`);

    let processedCount = 0;
    for (const user of usersToDelete) {
      try {
        console.log(`⏰ Procesando usuario ${user.id} (${user.email}) - programado para ${user.deletion_scheduled_at}`);
        const result = await UserDeletionCore.executeUserDeletion(user.id);
        if (result.success) {
          processedCount++;
        }
      } catch (error) {
        console.error(`❌ Error procesando usuario ${user.id}:`, error);
      }
    }

    console.log(`✅ Procesamiento completado: ${processedCount}/${usersToDelete.length} usuarios`);
    return {
      processed: processedCount,
      total: usersToDelete.length,
      success: processedCount === usersToDelete.length
    };
  }

  static async processLegalRetentionExpiry() {
    const now = new Date();

    const expiredUsers = await prisma.user.findMany({
      where: {
        is_anonymized: true,
        account_locked_until: {
          lte: now,
        },
      },
      select: { id: true, email: true, account_locked_until: true },
    });

    console.log(`🗑️ Procesando ${expiredUsers.length} registros con retención legal expirada...`);

    let deletedCount = 0;
    for (const user of expiredUsers) {
      try {
        await prisma.$transaction(async (tx) => {
          await tx.userDeletionLog.deleteMany({
            where: { user_id: user.id },
          });

          await tx.user.delete({
            where: { id: user.id },
          });
        });

        console.log(`🗑️ Usuario ${user.id} eliminado definitivamente (retención expirada: ${user.account_locked_until})`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Error eliminando definitivamente usuario ${user.id}:`, error);
      }
    }

    console.log(`✅ Eliminación definitiva completada: ${deletedCount}/${expiredUsers.length} registros`);
    return {
      deleted: deletedCount,
      total: expiredUsers.length,
      success: deletedCount === expiredUsers.length
    };
  }

  static async cleanupOrphanedConnections() {
    const orphaned = await UserDeletionMaintenance.findOrphanedConnections();

    if (orphaned.length === 0) {
      console.log('✅ No se encontraron conexiones huérfanas');
      return 0;
    }

    console.log(`🧹 Limpiando ${orphaned.length} conexiones huérfanas...`);
    let cleanedCount = 0;

    for (const user of orphaned) {
      try {
        if (user.supabase_user_id) {
          const result = await UserDeletionCore.cleanupOrphanedSupabaseConnection(
            user.id,
            user.supabase_user_id
          );

          if (result.success) {
            cleanedCount++;
          }
        }
      } catch (error) {
        console.error(`❌ Error limpiando usuario ${user.id}:`, error);
      }
    }

    console.log(`✅ Limpieza completada: ${cleanedCount}/${orphaned.length} conexiones`);
    return cleanedCount;
  }

  static async runScheduledMaintenance() {
    console.log('🔧 Iniciando mantenimiento programado...');

    try {
      const deletionResults = await this.processScheduledDeletions();

      const retentionResults = await this.processLegalRetentionExpiry();

      const orphanedCleaned = await this.cleanupOrphanedConnections();

      const summary = {
        deletions: deletionResults,
        legalRetentionCleanup: retentionResults,
        orphanedConnectionsCleaned: orphanedCleaned,
        timestamp: new Date().toISOString(),
        success: deletionResults.success && retentionResults.success,
      };

      console.log('✅ Mantenimiento completado:', summary);
      return summary;

    } catch (error) {
      console.error('❌ Error en mantenimiento programado:', error);
      throw error;
    }
  }
} */