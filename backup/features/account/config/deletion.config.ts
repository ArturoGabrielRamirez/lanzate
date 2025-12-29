export const DELETION_CONFIG = {
    IS_TESTING_MODE: process.env.NODE_ENV !== 'production',

    GRACE_PERIOD: {
        TESTING_MINUTES: 2,
        PRODUCTION_DAYS: 30,
    },

    RETENTION: {
        PRODUCTION_YEARS: 7,
        TESTING_MINUTES: 10,
    },

    CRON: {
        TESTING_FREQUENCY: 'every_minute',
        PRODUCTION_FREQUENCY: 'daily_3am',
    }
} as const

export function getGracePeriod() {
    return DELETION_CONFIG.IS_TESTING_MODE
        ? { minutes: DELETION_CONFIG.GRACE_PERIOD.TESTING_MINUTES }
        : { days: DELETION_CONFIG.GRACE_PERIOD.PRODUCTION_DAYS }
}

export function getRetentionPeriod() {
    return DELETION_CONFIG.IS_TESTING_MODE
        ? { minutes: DELETION_CONFIG.RETENTION.TESTING_MINUTES }
        : { years: DELETION_CONFIG.RETENTION.PRODUCTION_YEARS }
}