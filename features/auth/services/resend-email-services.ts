import { toast } from "sonner";
import { EmailChangeStatus } from "../types";
// 🔥 MANTENER TU FETCH ORIGINAL - no server action

interface ResendParams {
    type: 'signup' | 'recovery' | 'smart' | 'email_change';
    email?: string;
    emailChangeStatus?: EmailChangeStatus;
    step?: 'old_email' | 'new_email';
}

interface ResendResponse {
    message: string;
    data?: {
        email: string;
        resendType?: string;
        type: string;
        reason?: string;
        requestId?: number;
    };
}

class ResendEmailService {
    private buildPayload(params: ResendParams) {
        const { type, email, emailChangeStatus, step } = params;

        if (type === 'smart' && emailChangeStatus) {
            const { status } = { status: emailChangeStatus };
            let autoStep: 'old_email' | 'new_email' | undefined;

            if (status.hasEmailChange) {
                if (!status.oldEmailConfirmed) {
                    autoStep = 'old_email';
                } else if (status.oldEmailConfirmed && !status.newEmailConfirmed) {
                    autoStep = 'new_email';
                }
            }

            return {
                type: 'email_change' as const,
                step: step || autoStep
            };
        }

        if (type === 'email_change') {
            return {
                type: 'email_change' as const,
                step
            };
        }

        return {
            type: type === 'recovery' ? 'recovery' as const : 'signup' as const,
            email
        };
    }

    private handleErrorResponse(error: any) {
        const message = error.message || 'Error desconocido';

        if (message.includes('rate limit') || message.includes('too many') || message.includes('Demasiadas solicitudes')) {
            toast.error("Demasiadas solicitudes. Espera 5 minutos antes de intentar nuevamente.");
        } else if (message.includes('not found') || message.includes('no encontrado')) {
            toast.error("Usuario no encontrado.");
        } else if (message.includes('not authenticated') || message.includes('no autenticado')) {
            toast.error("Usuario no autenticado. Por favor, inicia sesión.");
        } else if (message.includes('already confirmed') || message.includes('ya está confirmado')) {
            toast.info("Email ya confirmado.");
        } else if (message.includes('No hay confirmaciones pendientes')) {
            toast.info("No hay confirmaciones pendientes.");
        } else {
            toast.error(message);
        }
    }

    private async handleResponse(response: Response): Promise<ResendResponse> {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Response is not JSON. Got:', text.substring(0, 200));
            throw new Error('Server returned non-JSON response. Check server logs.');
        }

        const data = await response.json();

        if (!response.ok || data.error) {
            this.handleErrorResponse({ message: data.message });
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return {
            message: data.message || "Email reenviado exitosamente",
            data: data.data
        };
    }

    async resend(params: ResendParams): Promise<ResendResponse> {
        try {
            const payload = this.buildPayload(params);
            console.log('🔄 Resending email with payload:', payload);
            
            // 🔥 MANTENER TU FETCH ORIGINAL
            const response = await fetch('/auth/resend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            return this.handleResponse(response);

        } catch (error) {
            console.error('❌ Error in resend service:', error);
            this.handleErrorResponse(error);
            throw error;
        }
    }

    // 🔥 MÉTODOS ESPECÍFICOS MANTENIDOS
    async resendEmailChange(step?: 'old_email' | 'new_email'): Promise<ResendResponse> {
        return this.resend({
            type: 'email_change',
            step
        });
    }

    async resendSmart(emailChangeStatus: EmailChangeStatus): Promise<ResendResponse> {
        return this.resend({
            type: 'smart',
            emailChangeStatus
        });
    }
}

export const resendEmailService = new ResendEmailService();