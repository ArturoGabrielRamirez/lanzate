/* import { prisma } from '@/utils/prisma';
import { CryptoUtils } from './crypto-utils';

export class UserDeletionValidation {
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
                timeRemaining: null,
                isAnonymized: user?.is_anonymized || false,
                anonymizedAt: user?.anonymized_at || null,
                legalRetentionUntil: user?.account_locked_until || null,
            };
        }

        const now = new Date();
        const scheduledAt = user.deletion_scheduled_at!;

        const timeDifference = scheduledAt.getTime() - now.getTime();
        const daysRemaining = Math.max(0, Math.ceil(timeDifference / (1000 * 60 * 60 * 24)));
        const canCancel = timeDifference > 0 && !user.is_deletion_cancelled && !user.is_anonymized;

        return {
            isDeletionRequested: true,
            deletionRequestedAt: user.deletion_requested_at,
            deletionScheduledAt: user.deletion_scheduled_at,
            deletionReason: user.deletion_reason,
            canCancel,
            daysRemaining,
            timeRemaining: Math.max(0, timeDifference),
            isAnonymized: user.is_anonymized || false,
            anonymizedAt: user.anonymized_at,
            legalRetentionUntil: user.account_locked_until,
        };
    }

    static async checkEmailDeletionHistory(email: string) {
        const emailHash = CryptoUtils.hashEmail(email);

        const anonymizedUser = await prisma.user.findFirst({
            where: {
                original_email_hash: emailHash,
                is_anonymized: true,
            },
            select: {
                id: true,
                anonymized_at: true,
                account_locked_until: true,
            },
        });

        const deletionLog = await prisma.userDeletionLog.findFirst({
            where: {
                action: 'EXECUTE',
                additional_data: {
                    contains: emailHash,
                },
            },
            select: {
                created_at: true,
                user_id: true,
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return {
            wasAnonymized: !!(anonymizedUser || deletionLog),
            anonymizedAt: anonymizedUser?.anonymized_at || deletionLog?.created_at,
            legalRetentionUntil: anonymizedUser?.account_locked_until,
            canCreateNew: true,
        };
    }

    static async validateNewUserCreation(email: string) {
        const activeUser = await prisma.user.findFirst({
            where: {
                email: email,
                is_anonymized: false,
            },
            select: {
                id: true,
                email: true,
            },
        });

        if (activeUser) {
            return {
                canCreate: false,
                reason: 'Email already in use by active account',
                conflict: true,
            };
        }

        const history = await this.checkEmailDeletionHistory(email);

        return {
            canCreate: true,
            reason: null,
            conflict: false,
            previouslyAnonymized: history.wasAnonymized,
            anonymizedAt: history.anonymizedAt,
            legalRetentionUntil: history.legalRetentionUntil,
        };
    }

    static async canRequestDeletion(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                deletion_requested_at: true,
                is_deletion_cancelled: true,
                is_anonymized: true,
            },
        });

        if (!user) {
            return {
                canRequest: false,
                reason: 'User not found',
            };
        }

        if (user.is_anonymized) {
            return {
                canRequest: false,
                reason: 'User already anonymized',
            };
        }

        if (user.deletion_requested_at && !user.is_deletion_cancelled) {
            return {
                canRequest: false,
                reason: 'Deletion already requested',
            };
        }

        return {
            canRequest: true,
            reason: null,
        };
    }

    static async canCancelDeletion(userId: number) {
        const status = await this.getDeletionStatus(userId);

        return {
            canCancel: status.canCancel,
            reason: !status.canCancel ? this.getCancelReason(status) : null,
            timeRemaining: status.timeRemaining,
            daysRemaining: status.daysRemaining,
        };
    }

    private static getCancelReason(status: any): string {
        if (!status.isDeletionRequested) {
            return 'No deletion requested';
        }

        if (status.isAnonymized) {
            return 'User already anonymized';
        }

        if (status.timeRemaining <= 0) {
            return 'Grace period expired';
        }

        return 'Unknown reason';
    }

    static async getUserDeletionLogs(userId: number) {
        const logs = await prisma.userDeletionLog.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                action: true,
                reason: true,
                ip_address: true,
                user_agent: true,
                additional_data: true,
                created_at: true,
            },
        });

        return logs.map(log => ({
            ...log,
            additional_data: log.additional_data ? JSON.parse(log.additional_data) : null,
        }));
    }

    static async validateDeletionDataIntegrity(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                deletion_requested_at: true,
                deletion_scheduled_at: true,
                is_deletion_cancelled: true,
                is_anonymized: true,
                anonymized_at: true,
                account_locked_until: true,
                original_email_hash: true,
            },
        });

        if (!user) {
            return {
                isValid: false,
                errors: ['User not found'],
            };
        }

        const errors: string[] = [];

        if (user.deletion_requested_at && user.deletion_scheduled_at) {
            if (user.deletion_scheduled_at <= user.deletion_requested_at) {
                errors.push('Scheduled date should be after request date');
            }
        }

        if (user.is_anonymized) {
            if (!user.anonymized_at) {
                errors.push('Anonymized user missing anonymized_at timestamp');
            }
            if (!user.account_locked_until) {
                errors.push('Anonymized user missing account_locked_until date (legal retention)');
            }
            if (!user.original_email_hash) {
                errors.push('Anonymized user missing original_email_hash');
            }
        }

        if (user.is_anonymized && user.deletion_requested_at) {
            errors.push('Anonymized user should not have pending deletion request');
        }

        return {
            isValid: errors.length === 0,
            errors,
            user,
        };
    }
} */