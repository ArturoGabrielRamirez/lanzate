export function detectOAuthProvider(email?: string, provider?: string): string {
    if (provider) {
        switch (provider.toLowerCase()) {
            case 'google':
                return 'google';
            case 'facebook':
                return 'facebook';
            case 'microsoft':
            case 'azure':
                return 'microsoft';
            case 'yahoo':
                return 'yahoo';
            case 'email':
                return 'email';
            default:
                break;
        }
    }

    if (email) {
        const domain = email.split('@')[1]?.toLowerCase();

        switch (domain) {
            case 'gmail.com':
            case 'google.com':
                return 'google';
            case 'hotmail.com':
            case 'hotmail.com.ar':
            case 'outlook.com':
            case 'outlook.com.ar':
            case 'live.com':
            case 'msn.com':
                return 'microsoft';
            case 'yahoo.com':
            case 'yahoo.com.ar':
                return 'yahoo';
            case 'facebook.com':
            case 'fb.com':
                return 'facebook';
            default:
                return 'email';
        }
    }

    return 'email';
}