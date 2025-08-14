/* // features/account/utils/user-deletion-core.ts
// 🎯 CORE - Operaciones principales de eliminación (COMPLETO Y CORREGIDO)
import { prisma } from '@/utils/prisma';
import { CryptoUtils } from './crypto-utils';
import { createServerSideClient } from '@/utils/supabase/server';

export class UserDeletionCore {
    private static readonly DELETION_GRACE_PERIOD_DAYS = 30;
    private static readonly LEGAL_RETENTION_YEARS_VALUE = 7;

    static async findAnonymizedUser(email?: string, supabaseUserId?: string) {
        if (!email && !supabaseUserId) {
            return null;
        }

        const emailHash = email ? CryptoUtils.hashEmail(email) : null;

        return await prisma.user.findFirst({
            where: {
                AND: [
                    {
                        OR: [
                            ...(supabaseUserId ? [{ supabase_user_id: supabaseUserId }] : []),
                            ...(emailHash ? [{
                                AND: [
                                    { original_email_hash: emailHash },
                                    { supabase_user_id: null }
                                ]
                            }] : [])
                        ]
                    },
                    { is_anonymized: true }
                ]
            },
            select: {
                id: true,
                email: true,
                supabase_user_id: true,
                anonymized_at: true,
                original_email_hash: true,
                account_locked_until: true,
            }
        });
    }

    static async cleanupOrphanedSupabaseConnection(userId: number, supabaseUserId: string) {
        try {
            const supabase = createServerSideClient();

            const { error: deleteError } = await supabase.auth.admin.deleteUser(supabaseUserId);

            if (deleteError) {
                console.error(`❌ Error eliminando usuario de Supabase:`, deleteError);
            } else {
                console.log(`🗑️ Usuario eliminado de Supabase Auth: ${supabaseUserId}`);
            }

            await prisma.user.update({
                where: { id: userId },
                data: { supabase_user_id: null }
            });

            console.log(`🧹 Conexión huérfana limpiada para usuario ${userId}`);

            return {
                success: true,
                supabaseDeleted: !deleteError,
                connectionCleaned: true
            };

        } catch (error) {
            console.error(`❌ Error limpiando conexión huérfana:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                supabaseDeleted: false,
                connectionCleaned: false
            };
        }
    }

    static async validateAnonymizedUserIntegrity(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                phone: true,
                avatar: true,
                username: true,
                supabase_user_id: true,
                is_anonymized: true,
                anonymized_at: true,
                original_email_hash: true,
                account_locked_until: true,
            },
        });

        if (!user) {
            return {
                isValid: false,
                errors: ['User not found'],
            };
        }

        if (!user.is_anonymized) {
            return {
                isValid: false,
                errors: ['User is not marked as anonymized'],
            };
        }

        const errors: string[] = [];
        const warnings: string[] = [];

        if (user.first_name || user.last_name || user.phone || user.avatar) {
            errors.push('Personal data not properly anonymized');
        }

        if (!user.email.includes('@deleted.local')) {
            errors.push('Email not properly anonymized');
        }

        if (!user.username.startsWith('deleted_')) {
            errors.push('Username not properly anonymized');
        }

        if (!user.anonymized_at) {
            errors.push('Missing anonymized_at timestamp');
        }

        if (!user.original_email_hash) {
            errors.push('Missing original_email_hash');
        }

        if (!user.account_locked_until) {
            errors.push('Missing account_locked_until (legal retention date)');
        }

        if (user.supabase_user_id) {
            warnings.push('supabase_user_id should be null for fully anonymized user');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            user,
        };
    }

    static get GRACE_PERIOD_DAYS() {
        return this.DELETION_GRACE_PERIOD_DAYS;
    }

    static get LEGAL_RETENTION_YEARS() {
        return this.LEGAL_RETENTION_YEARS_VALUE;
    }

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

        deletionScheduledAt.setDate(deletionScheduledAt.getDate() + this.DELETION_GRACE_PERIOD_DAYS);

        const result = await prisma.$transaction(async (tx) => {
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
                        grace_period_days: this.DELETION_GRACE_PERIOD_DAYS,
                    }),
                },
            });

            return {
                deletionRequestedAt,
                deletionScheduledAt,
                gracePeriodDays: this.DELETION_GRACE_PERIOD_DAYS,
            };
        });

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

            await tx.userDeletionLog.create({
                data: {
                    user_id: userId,
                    action: 'CANCEL',
                    reason,
                    ip_address: ipAddress,
                    user_agent: userAgent,
                },
            });

            return { cancelledAt };
        });
    }

    static async executeUserDeletion(userId: number) {
        return await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: userId },
                select: {
                    email: true,
                    first_name: true,
                    supabase_user_id: true,
                    deletion_scheduled_at: true,
                    is_deletion_cancelled: true,
                    is_anonymized: true,
                },
            });

            if (!user) {
                console.log(`⚠️ Usuario ${userId} no encontrado`);
                return { success: false, reason: 'User not found' };
            }

            if (user.is_deletion_cancelled) {
                console.log(`⚠️ Eliminación cancelada para usuario ${userId}`);
                return { success: false, reason: 'Deletion was cancelled' };
            }

            if (user.is_anonymized) {
                console.log(`⚠️ Usuario ${userId} ya fue anonimizado`);
                return { success: false, reason: 'User already anonymized' };
            }

            const now = new Date();
            if (user.deletion_scheduled_at && user.deletion_scheduled_at > now) {
                console.log(`⚠️ Eliminación no programada aún para usuario ${userId}. Programada para: ${user.deletion_scheduled_at}`);
                return { success: false, reason: 'Not yet scheduled' };
            }

            let supabaseDeleted = false;
            if (user.supabase_user_id) {
                try {
                    const supabase = createServerSideClient();

                    const { error: deleteError } = await supabase.auth.admin.deleteUser(
                        user.supabase_user_id
                    );

                    if (deleteError) {
                        console.error(`❌ Error eliminando usuario de Supabase:`, deleteError);
                    } else {
                        console.log(`🗑️ Usuario eliminado de Supabase Auth: ${user.supabase_user_id}`);
                        supabaseDeleted = true;
                    }

                } catch (supabaseError) {
                    console.error(`❌ Error conectando con Supabase:`, supabaseError);
                }
            }

            const emailHash = CryptoUtils.hashEmail(user.email);
            const timestamp = Date.now();

            const anonymizedEmail = user.supabase_user_id
                ? CryptoUtils.generateAnonymizedEmail(user.supabase_user_id, timestamp)
                : `deleted_${timestamp}@deleted.local`;

            const anonymizedUsername = user.supabase_user_id
                ? CryptoUtils.generateAnonymizedIdentifier(user.supabase_user_id, timestamp)
                : `deleted_${userId}_${timestamp}`;

            const legalRetentionUntil = new Date();
            legalRetentionUntil.setFullYear(legalRetentionUntil.getFullYear() + this.LEGAL_RETENTION_YEARS);

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
                        anonymized_email: anonymizedEmail,
                        anonymized_username: anonymizedUsername,
                        supabase_deleted: supabaseDeleted,
                        legal_retention_until: legalRetentionUntil.toISOString(),
                        anonymization_method: user.supabase_user_id ? 'supabase_id_based' : 'timestamp_based',
                    }),
                },
            });

            try {
                await this.cleanupAnonymizedUserReferences(tx, userId);
            } catch (cleanupError) {
                console.error(`⚠️ Error limpiando referencias para usuario ${userId}:`, cleanupError);
            }

            console.log(`✅ Usuario ${userId} (${user.email}) anonimizado como ${anonymizedEmail}. Retención legal hasta: ${legalRetentionUntil.toISOString()}`);
            return {
                success: true,
                anonymized: true,
                supabaseDeleted,
                anonymizedEmail,
                anonymizedUsername,
                legalRetentionUntil,
                anonymizationMethod: user.supabase_user_id ? 'supabase_id_based' : 'timestamp_based',
            };
        });
    }

    private static async cleanupAnonymizedUserReferences(tx: any, userId: number) {
        const cleanupResults = {
            comments: 0,
            likes: 0,
            notifications: 0,
            reminders: 0,
            messages: 0,
        };

        const commentsResult = await tx.product_comments.updateMany({
            where: { user_id: userId },
            data: {
                content: '[Comentario de usuario eliminado]',
                is_active: false
            },
        });
        cleanupResults.comments = commentsResult.count;

        const likesResult = await tx.product_likes.deleteMany({
            where: { user_id: userId },
        });
        cleanupResults.likes = likesResult.count;

        const notificationsResult = await tx.notification.deleteMany({
            where: { user_id: userId },
        });
        cleanupResults.notifications = notificationsResult.count;

        const remindersResult = await tx.userReminder.deleteMany({
            where: { user_id: userId },
        });
        cleanupResults.reminders = remindersResult.count;

        const messagesResult = await tx.orderMessage.updateMany({
            where: { sender_id: userId },
            data: {
                message: '[Mensaje de usuario eliminado]',
            },
        });
        cleanupResults.messages = messagesResult.count;

        console.log(`🧹 Referencias limpiadas para usuario ${userId}:`, cleanupResults);
        return { success: true, cleanupResults };
    }
} */